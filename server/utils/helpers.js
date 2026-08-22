export const parseGitHubUrl = (url) => {
    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.hostname !== "github.com") {
            throw new Error("Invalid github URL");
        }
        const parts = parsedUrl.pathname.split("/").filter(Boolean);
        if (parts.length < 2) {
            throw new Error("Invalid GitHub repository URL");
        }
        const owner = parts[0];
        const repo = parts[1].replace(".git", "");
        return { owner, repo };
    } catch (error) {
        throw new Error("Invalid GitHub repository URL");
    }
};