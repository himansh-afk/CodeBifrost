import express from "express";
import { analyzeRepository, askRepository } from "../controller/repositoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze", authMiddleware, analyzeRepository);
router.post("/ask", authMiddleware, askRepository);

export default router;