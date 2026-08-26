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

export const getBlobContent = async (owner, repo, sha) => {
    const response = await githubApi.get(
        `/repos/${owner}/${repo}/git/blobs/${sha}`
    );
    return response.data;
}

export const decodeFileContent = (content) => {
    return Buffer.from(content, "base64").toString("utf-8");
};

export const getGithubAccessToken = async (code) => {
    const response = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
        },
        {
            headers: {
                Accept: "application/json"
            }
        }
    );
    return response.data;
}

export const getGithubUser = async (accessToken) => {
    const response = await axios.get(
        "https://api.github.com/user",
        {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${accessToken}`
            }
        }
    );
    return response.data;
}

export const getGithubEmail = async (accessToken) => {
    const response = await axios.get(
        "https://api.github.com/user/emails",
        {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${accessToken}`
            }
        }
    );
    const primaryEmail = response.data.find(
        email => email.primary && email.verified
    );
    return primaryEmail?.email || null;
}