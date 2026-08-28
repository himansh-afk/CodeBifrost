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