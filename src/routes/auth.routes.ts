import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import passport from "passport";
import { authenticateJWT } from "../middleware/auth-middleware";
import { IUser } from "../models/User";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/user", authenticateJWT, (req, res) => {
  if (req.user) {
    const user = req.user as IUser;
    res.json({
      email: user.email,
      // Add other user details as needed
    });
  } else {
    res.sendStatus(404);
  }
});

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

export default router;
