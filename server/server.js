import "dotenv/config";
import express from "express";
import cors from "cors";
import repositoryRoutes from "./routes/repositoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

process.env.GITHUB_TOKEN

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend is Working!"
    });
});

app.use("/api/repository", repositoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

connectDB();

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});