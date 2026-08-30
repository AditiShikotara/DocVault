import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/authController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);

export default router;