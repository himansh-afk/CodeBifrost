import express from "express";
import { analyzeRepository } from "../controller/repositoryController.js";

const router = express.Router();

router.post("/analyze", analyzeRepository);

export default router;