import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import Video from "../models/Video";
import { authenticateJWT } from "../middleware/auth-middleware";
import { IUser } from "../models/User";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Ensure the file extension is .mp4
    const extension = path.extname(file.originalname) || ".mp4";
    const filename = `${Date.now()}${extension}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

router.post(
  "/upload",
  authenticateJWT,
  upload.single("video"),
  async (req, res) => {
    const user = req.user as IUser; // Type assertion
    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const video = new Video({
      user: user._id,
      filename: req?.file?.filename,
      url: `/uploads/${req?.file?.filename}`,
    });
    await video.save();
    res.status(201).json(video);
  }
);

router.delete("/:id", authenticateJWT, async (req, res) => {
  const user = req.user as IUser; // Type assertion
  if (!user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const video = await Video.findById(req.params.id);
  if (video && video.user.equals(user?._id)) {
    // Delete video file from uploads folder
    const filePath = path.join("uploads", video.filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });

    // Delete video record from database
    await Video.deleteOne({ _id: req.params.id });
    res.status(200).send("File deleted successfully");
  } else {
    res.sendStatus(404);
  }
});

// Listing API to get all videos
router.get("/", authenticateJWT, async (req, res) => {
  const user = req.user as IUser; // Type assertion
  if (!user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const videos = await Video.find({ user: user._id });
  res.json(videos);
});

export default router;
