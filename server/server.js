import "dotenv/config";
import express from "express";
import cors from "cors";
import repositoryRoutes from "./routes/repositoryRoutes.js";

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

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});