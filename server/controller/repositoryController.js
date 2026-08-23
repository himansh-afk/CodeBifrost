import { parseGitHubUrl } from "../utils/helpers.js";
import { filterSourceFiles } from "../services/github/fileFilter.js";
import { addChunks } from "../services/rag/vectorStore.js";
import {
    getBranch,
    getRepository,
    getRepositoryTree,
    getBlobContent,
    decodeFileContent
} from "../services/github/githubService.js";

import { chunkCode } from "../services/rag/chunker.js";
import { generateEmbedding } from "../services/rag/embedder.js";


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


        const filesToProcess = files.slice(0, 5);


        // -----------------------------
        // 6. Fetch source code
        // -----------------------------

        const sourceFiles = [];

        for (const file of filesToProcess) {

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

                const embedding = await generateEmbedding(
                    chunk.chunkText
                );

                embeddedChunks.push({
                    ...chunk,
                    embedding
                });

            }
        }
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