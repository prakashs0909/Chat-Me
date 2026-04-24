import { Router } from "express";
import { login, logout, register, updateProfile, checkAuth, verifyEmail } from "../controllers/auth-controller.js";
import { authenticate } from "../middlewares/auth-middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticate, logout);
router.put("/update-profile", authenticate, updateProfile);
router.get("/check", authenticate, checkAuth);
router.get("/verify-email/:rawid", verifyEmail);

export default router;