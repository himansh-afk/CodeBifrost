const allowedExtensions = new Set([
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".py",
    ".java",
    ".cpp",
    ".c",
    ".h",
    ".hpp",
    ".go",
    ".rs",
    ".php",
    ".rb",
    ".cs",
    ".swift",
    ".kt",
    ".kts",
    ".html",
    ".css",
    ".scss",
    ".sql",
    ".ipynb",
    ".md",
    ".yaml",
    ".yml",
    ".json",
    ".toml",
    ".txt",
    ".csv",
]);

const allowedFiles = new Set([
    "package.json",
    "README.md",
    "Dockerfile",
    "docker-compose.yml",
    "docker-compose.yaml"
]);

const ignoredDirectories = new Set([
    "node_modules",
    ".git",
    "dist",
    "build",
    "coverage",
    ".next",
    "out",
    "vendor",
    "__pycache__"
]);

const ignoredFiles = new Set([
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
    "package-lock.json",
    "yarn.lock",
    "poetry.lock"
]);

export const filterSourceFiles = (tree) => {
    return tree.filter((item) => {
        if (item.type !== "blob") {
            return false;
        }

        const pathParts = item.path.split("/");

        const hasIgnoredDirectory = pathParts.some((part) =>
            ignoredDirectories.has(part)
        );

        if (hasIgnoredDirectory) {
            return false;
        }

        const fileName = pathParts[pathParts.length - 1];

        if (ignoredFiles.has(fileName)) {
            return false;
        }

        if (allowedFiles.has(fileName)) {
            return true;
        }

        const extension = fileName.includes(".")
            ? "." + fileName.split(".").pop().toLowerCase()
            : "";

        return allowedExtensions.has(extension);
    });
};