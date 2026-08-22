import { parseGitHubUrl } from "../utils/helpers.js";
import { filterSourceFiles } from "../services/github/fileFilter.js";
import { getBranch, getRepository, getRepositoryTree, getFileContent, decodeFileContent } from "../services/github/githubService.js";

export const analyzeRepository = async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({
                message: "repository url is required"
            });
        }
        const { owner, repo } = parseGitHubUrl(url);
        const repository = await getRepository(owner, repo);
        const branch = repository.default_branch;
        const branchData = await getBranch(owner, repo, branch);
        const commitSha = branchData.commit.sha;
        const tree = await getRepositoryTree(owner, repo, commitSha);
        const files = filterSourceFiles(tree.tree);
        const sourceFiles = [];
        for (const file of files) {
            const fileData = await getFileContent(owner, repo, file.path);
            const content = decodeFileContent(fileData.content);
            sourceFiles.push({
                path: file.path,
                content
            });
        }
        res.json({
            owner,
            repo,
            branch,
            commitSha,
            totalTreeItems: tree.tree.length,
            filesFound: sourceFiles.length,
            files: sourceFiles
        });
    } catch (error) {
        console.error("GitHub API error:",
            error.response?.data || error.message
        );
        res.status(500).json({
            message: "Failed to analyze repository",
            error: error.response?.data?.message || error.message
        });
    }
};