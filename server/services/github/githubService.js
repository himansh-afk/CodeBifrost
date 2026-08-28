import axios from "axios";

const githubApi = axios.create({
    baseURL: "https://api.github.com",
    headers: {
        Accept: "application/vnd.github+json",
    }
});

const getAuthConfig = (githubToken) => ({
    headers: {
        Authorization: `Bearer ${githubToken}`
    }
});

export const getRepository = async (owner, repo, githubToken) => {
    const response = await githubApi.get(
        `/repos/${owner}/${repo}`,
        getAuthConfig(githubToken)
    );

    return response.data;
};

export const getBranch = async (owner, repo, branch, githubToken) => {
    const response = await githubApi.get(
        `/repos/${owner}/${repo}/branches/${branch}`,
        getAuthConfig(githubToken)
    );

    return response.data;
};

export const getRepositoryTree = async (
    owner,
    repo,
    treeSha,
    githubToken
) => {
    const response = await githubApi.get(
        `/repos/${owner}/${repo}/git/trees/${treeSha}`,
        {
            ...getAuthConfig(githubToken),
            params: {
                recursive: "true"
            }
        }
    );

    return response.data;
};

export const getBlobContent = async (owner, repo, sha, githubToken) => {
    const response = await githubApi.get(
        `/repos/${owner}/${repo}/git/blobs/${sha}`,
        getAuthConfig(githubToken)
    );
    return response.data;
}

export const decodeFileContent = (content) => {
    return Buffer.from(content, "base64").toString("utf-8");
};

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

export const refreshGithubAccessToken = async (refreshToken) => {
    const response = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: refreshToken
        },
        {
            headers: {
                Accept: "application/json"
            }
        }
    );
    return response.data;
}
