import { Router } from "express";
import passport from "passport";
import {
  login,
  logout,
  register,
  updateProfile,
  checkAuth,
  verifyEmail,
} from "../controllers/auth-controller.js";
import { authenticate } from "../middlewares/auth-middleware.js";
import { ENV_VAR } from "../config/env-var.js";
import { generateToken } from "../utils/jwt-util.js";

const router = Router();

const oauthSuccess = (req, res) => {
  generateToken(req.user._id, res);
  res.redirect(`${ENV_VAR.CLIENT_URL}/`);
};

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticate, logout);
router.put("/update-profile", authenticate, updateProfile);
router.get("/check", authenticate, checkAuth);
router.get("/verify-email/:rawid", verifyEmail);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${ENV_VAR.CLIENT_URL}/login`,
    session: false,
  }),
  oauthSuccess,
);
export default router;
