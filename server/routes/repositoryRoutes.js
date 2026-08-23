import express from "express";
import { analyzeRepository, askRepository } from "../controller/repositoryController.js";

const router = express.Router();

router.post("/analyze", analyzeRepository);
router.post("/ask", askRepository);

export default router;