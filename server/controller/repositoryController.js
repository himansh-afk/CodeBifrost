import { parseGitHubUrl } from "../utils/helpers.js";
import { filterSourceFiles } from "../services/github/fileFilter.js";
import { addChunks, clearStore, getStoreSize } from "../services/rag/vectorStore.js";
import {
    getBranch,
    getRepository,
    getRepositoryTree,
    getBlobContent,
    decodeFileContent
} from "../services/github/githubService.js";
import { askCodebase } from "../services/rag/ragService.js";
import { chunkCode } from "../services/rag/chunker.js";
import { generateEmbedding } from "../services/rag/embedder.js";

export const askRepository = async (req, res) => {

    try {

        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                message: "question is required"
            });
        }

        if (getStoreSize() === 0) {
            return res.status(400).json({
                message: "No repository indexed yet. Call /analyze first."
            });
        }

        const result = await askCodebase(question);

        res.json(result);

    } catch (error) {

        console.error(
            "RAG question error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to answer question",
            error: error.message
        });
    }
};

export const analyzeRepository = async (req, res) => {

    try {

        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                message: "repository url is required"
            });
        }

        // -----------------------------
        // 1. Parse GitHub URL
        // -----------------------------

        const { owner, repo } = parseGitHubUrl(url);


        // -----------------------------
        // 2. Repository metadata
        // -----------------------------

        const repository = await getRepository(owner, repo);

        const branch = repository.default_branch;


        // -----------------------------
        // 3. Get latest commit
        // -----------------------------

        const branchData = await getBranch(
            owner,
            repo,
            branch
        );

        const commitSha = branchData.commit.sha;


        // -----------------------------
        // 4. Get repository tree
        // -----------------------------

        const tree = await getRepositoryTree(
            owner,
            repo,
            commitSha
        );


        // -----------------------------
        // 5. Filter source files
        // -----------------------------

        const files = filterSourceFiles(tree.tree);


        // const filesToProcess = files;


        // -----------------------------
        // 6. Fetch source code
        // -----------------------------

        const sourceFiles = [];

        for (const file of files) {

            const fileData = await getBlobContent(
                owner,
                repo,
                file.sha
            );

            const content = decodeFileContent(
                fileData.content
            );

            sourceFiles.push({
                path: file.path,
                content
            });
        }


        // -----------------------------
        // 7. Chunk + Embed
        // -----------------------------

        const embeddedChunks = [];

        for (const file of sourceFiles) {

            const chunks = chunkCode(
                file.content,
                file.path
            );

            for (const chunk of chunks) {
                if (!chunk.chunkText || chunk.chunkText.trim() === "") continue;
                const embedding = await generateEmbedding(
                    chunk.chunkText
                );

                embeddedChunks.push({
                    ...chunk,
                    embedding
                });

            }
        }
        clearStore();
        addChunks(embeddedChunks);


        // -----------------------------
        // 8. Response
        // -----------------------------

        res.json({

            owner,
            repo,
            branch,
            commitSha,

            totalTreeItems: tree.tree.length,

            filesFound: files.length,

            filesProcessed: sourceFiles.length,

            totalChunks: embeddedChunks.length,

            embeddingDimensions:
                embeddedChunks[0]?.embedding?.length || 0

        });

    } catch (error) {

        console.error(
            "GitHub/RAG error:",
            error.response?.data || error.message
        );

        res.status(500).json({

            message: "Failed to analyze repository",

            error:
                error.response?.data?.message ||
                error.message

        });

    }

};