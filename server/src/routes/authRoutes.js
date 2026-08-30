import express from "express";
import { forgotPassword, loginUser, logoutUser, registerUser, resetPassword } from "../controllers/authController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;