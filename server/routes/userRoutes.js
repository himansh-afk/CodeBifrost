import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select(
            "-password -githubAccessToken -githubRefreshToken -githubTokenExpiresAt"
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            githubUsername: user.githubUsername,
            avatar: user.avatar,
            repositories: Object.fromEntries(user.repositories)
        });
    } catch (error) {
        console.error("GET ME ERROR:", error);
        res.status(500).json({ message: "Failed to fetch user", error: error.message });
    }
});

export default router;