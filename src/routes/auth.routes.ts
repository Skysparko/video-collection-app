import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import passport from "passport";
import { authenticateJWT } from "../middleware/auth-middleware";
import User, { IUser } from "../models/User";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { JWT_SECRET } from "../config";
const router = Router();

dotenv.config();

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

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Function to verify Google ID token
async function verifyGoogleToken(idToken: string) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
  });
  return ticket.getPayload();
}

router.post("/google", async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify the ID token
    const payload = await verifyGoogleToken(idToken);
    const { sub, email } = payload as any;

    // Find or create the user in your database
    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = new User({
        googleId: sub,
        email,
        password:"123456"
      });
      await user.save();
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, email: user.email });
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
