import express from "express";
import { register, login, githubCallback, githubLogin, githubRegister } from "../controller/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/github", githubLogin);
router.get("/github/callback", githubCallback);
router.post("/github/register", githubRegister);

export default router;