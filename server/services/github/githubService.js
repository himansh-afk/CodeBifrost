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

export const getValidGithubAccessToken = async (user) => {
    if (user.githubAccessToken && user.githubTokenExpiresAt && new Date(user.githubTokenExpiresAt) > new Date()) {
        return user.githubAccessToken;
    }
    if (!user.githubRefreshToken) {
        throw new Error("Github refresh token missing");
    }
    console.log("github access token expired.refreshing....");
    const tokenData = await refreshGithubAccessToken(user.githubRefreshToken);
    if (!tokenData.access_token) {
        throw new Error(
            tokenData.error_description || "failed to refresh github access token"
        );
    }
    user.githubAccessToken = tokenData.access_token;
    user.githubRefreshToken = tokenData.refresh_token || user.githubRefreshToken;
    user.githubTokenExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
    await user.save();
    console.log("github access taken refreshed successfully");
    return user.githubAccessToken;
}