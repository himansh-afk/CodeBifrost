import axios from "axios";

const githubApi = axios.create({
    baseURL: "https://api.github.com",
    headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    }
});

export const getRepository = async (owner, repo) => {
    const response = await githubApi.get(
        `/repos/${owner}/${repo}`
    );

    return response.data;
};

export const getBranch = async (owner, repo, branch) => {
    const response = await githubApi.get(
        `/repos/${owner}/${repo}/branches/${branch}`
    );

    return response.data;
};

export const getRepositoryTree = async (
    owner,
    repo,
    treeSha
) => {
    const response = await githubApi.get(
        `/repos/${owner}/${repo}/git/trees/${treeSha}`,
        {
            params: {
                recursive: "true"
            }
        }
    );

    return response.data;
};

export const getFileContent = async (owner, repo, path) => {
    const response = await githubApi.get(
        `/repos/${owner}/${repo}/contents/${path}`
    );

    return response.data;
};

export const decodeFileContent = (content) => {
    return Buffer.from(content, "base64").toString("utf-8");
};