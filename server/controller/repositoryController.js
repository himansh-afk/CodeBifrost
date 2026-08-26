import { parseGitHubUrl } from "../utils/helpers.js";
import { filterSourceFiles } from "../services/github/fileFilter.js";
import { addChunks, clearStore, getNamespaceSize } from "../services/rag/vectorStore.js";
import {
    getBranch,
    getRepository,
    getRepositoryTree,
    getBlobContent,
    decodeFileContent,
    getValidGithubAccessToken
} from "../services/github/githubService.js";
import { askCodebase } from "../services/rag/ragService.js";
import { chunkCode } from "../services/rag/chunker.js";
import { generateEmbedding } from "../services/rag/embedder.js";
import User from "../models/User.js";

export const askRepository = async (req, res) => {
    try {
        const { question, url } = req.body;
        if (!question) {
            return res.status(400).json({
                message: "question is required"
            });
        }
        if (!url) {
            return res.status(400).json({
                message: "repo url is required"
            });
        }
        const { owner, repo } = parseGitHubUrl(url);
        const namespace = `${owner}/${repo}`;
        const size = await getNamespaceSize(namespace);
        if (size === 0) {
            return res.status(400).json({
                message: "Repo hasnt analyzed yet.call /analyze first"
            });
        }
        const result = await askCodebase(question, namespace);
        res.json(result);
    } catch (error) {
        console.error("RAG question error:", error.message);
        res.status(500).json({
            message: "Failed to answer question",
            error: error.message
        });
    }
};

export const analyzeRepository = async (req, res) => {

    try {

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        if (!user.githubAccessToken) {
            return res.status(400).json({
                message: "GitHub account not connected"
            });
        }

        const githubToken = await getValidGithubAccessToken(user);

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
        const namespace = `${owner}/${repo}`;


        // -----------------------------
        // 2. Repository metadata
        // -----------------------------

        const repository = await getRepository(owner, repo, githubToken);

        const branch = repository.default_branch;


        // -----------------------------
        // 3. Get latest commit
        // -----------------------------

        const branchData = await getBranch(
            owner,
            repo,
            branch,
            githubToken
        );

        const commitSha = branchData.commit.sha;


        // -----------------------------
        // 4. Get repository tree
        // -----------------------------

        const tree = await getRepositoryTree(
            owner,
            repo,
            commitSha,
            githubToken
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
                file.sha,
                githubToken
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
        await clearStore(namespace);
        console.log("Total embedded chunks:", embeddedChunks.length);
        //console.log("Sample chunk:", JSON.stringify(embeddedChunks[0], null, 2));
        await addChunks(embeddedChunks, namespace);


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