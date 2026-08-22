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
    ".sql"
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
    ".env.production"
]);

export const filterSourceFiles = (tree) => {
    return tree.filter((item) => {
        // We only want actual files, not directories
        if (item.type !== "blob") {
            return false;
        }

        const pathParts = item.path.split("/");

        // Ignore unwanted directories
        const hasIgnoredDirectory = pathParts.some((part) =>
            ignoredDirectories.has(part)
        );

        if (hasIgnoredDirectory) {
            return false;
        }

        const fileName = pathParts[pathParts.length - 1];

        // Ignore environment files
        if (ignoredFiles.has(fileName)) {
            return false;
        }

        // Allow important files without extensions
        if (allowedFiles.has(fileName)) {
            return true;
        }

        // Check extension
        const extension = fileName.includes(".")
            ? "." + fileName.split(".").pop().toLowerCase()
            : "";

        return allowedExtensions.has(extension);
    });
};