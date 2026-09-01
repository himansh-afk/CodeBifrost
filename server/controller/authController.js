import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { getGithubUser, getGithubEmail } from "../services/github/githubService.js";
import { getGithubAccessToken } from "../services/github/githubAuthService.js";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name, email, password: hashedPassword
        });
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );


        res.status(201).json({
            message: "Registration succesful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("REGISTER ERROR:", error);

        res.status(500).json({
            message: "Registration Failed",
            error: error.message
        });
    }
}

export const githubRegister = async (req, res) => {
    try {
        const { githubToken, password } = req.body;

        if (!githubToken || !password) {
            return res.status(400).json({
                message: "GitHub token and password are required"
            });
        }

        // Verify temporary GitHub registration token
        const githubData = jwt.verify(
            githubToken,
            process.env.JWT_SECRET
        );

        const {
            githubId,
            githubUsername,
            email,
            avatar,
            githubAccessToken,
            githubRefreshToken,
            githubTokenExpiresAt
        } = githubData;

        if (!githubId || !githubUsername || !email) {
            return res.status(400).json({
                message: "Invalid GitHub registration data"
            });
        }

        // Check whether account already exists
        const existingUser = await User.findOne({
            $or: [
                { email },
                { githubId: String(githubId) }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already registered. Please login."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create CodeBifrost account
        const user = await User.create({
            name: githubUsername,
            email,
            password: hashedPassword,
            githubId: String(githubId),
            githubUsername,
            avatar,

            githubAccessToken,
            githubRefreshToken,
            githubTokenExpiresAt: githubTokenExpiresAt
                ? new Date(githubTokenExpiresAt)
                : null
        });

        // Generate normal CodeBifrost JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        console.log({
            hasAccessToken: !!user.githubAccessToken,
            hasRefreshToken: !!user.githubRefreshToken,
            expiresAt: user.githubTokenExpiresAt
        });

        res.status(201).json({
            message: "GitHub registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                githubUsername: user.githubUsername,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error("GITHUB REGISTER ERROR:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "GitHub registration session expired. Please register again."
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid GitHub registration token"
            });
        }

        res.status(500).json({
            message: "GitHub registration failed",
            error: error.message
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                githubUsername: user.githubUsername,
                avatar: user.avatar
            }
        })
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
}

export const githubLogin = (req, res) => {

    const githubAuthUrl =
        `https://github.com/login/oauth/authorize` +
        `?client_id=${process.env.GITHUB_CLIENT_ID}` +
        `&redirect_uri=${process.env.GITHUB_CALLBACK_URL}` +
        `&scope=user:email%20repo`;

    res.redirect(githubAuthUrl);
};

export const githubCallback = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({
                message: "Github auth code missing"
            });
        }
        // 1. Exchange code for GitHub token
        const tokenData = await getGithubAccessToken(code);

        if (!tokenData.access_token) {
            return res.status(401).json({
                message: "Failed to obtain GitHub access token"
            });
        }

        const accessToken = tokenData.access_token;

        // 2. Get GitHub user
        const githubUser = await getGithubUser(accessToken);

        // 3. Get verified email
        const email = await getGithubEmail(accessToken);

        if (!email) {
            return res.status(400).json({
                message: "No verified GitHub email found"
            });
        }
        const existingUser = await User.findOne({
            githubId: String(githubUser.id)
        });

        if (existingUser) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/login?githubError=already_registered`
            );
        }
        console.log("GitHub user:", {
            id: githubUser.id,
            username: githubUser.login,
            email
        });
        const registrationToken = jwt.sign(
            {
                githubId: githubUser.id,
                githubUsername: githubUser.login,
                email,
                avatar: githubUser.avatar_url,

                githubAccessToken: tokenData.access_token,
                githubRefreshToken: tokenData.refresh_token,
                githubTokenExpiresAt: tokenData.expires_in
                    ? new Date(
                        Date.now() + tokenData.expires_in * 1000
                    ).toISOString()
                    : null
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "10m"
            }
        );
        res.redirect(
            `${process.env.FRONTEND_URL}/register/complete?githubToken=${registrationToken}`
        );
    } catch (error) {

        console.error(
            "GITHUB OAUTH ERROR:",
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "GitHub authentication failed",
            error: error.response?.data || error.message
        });
    }
}

//http://127.0.0.1:5000/api/auth/github