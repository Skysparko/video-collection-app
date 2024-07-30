"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Video_1 = __importDefault(require("../models/Video"));
const auth_middleware_1 = require("../middleware/auth-middleware");
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        // Ensure the file extension is .mp4
        const extension = path_1.default.extname(file.originalname) || ".mp4";
        const filename = `${Date.now()}${extension}`;
        cb(null, filename);
    },
});
const upload = (0, multer_1.default)({ storage });
router.post("/upload", auth_middleware_1.authenticateJWT, upload.single("video"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = req.user; // Type assertion
    if (!user) {
        return res.status(401).json({ error: "User not authenticated" });
    }
    const video = new Video_1.default({
        user: user._id,
        filename: (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.filename,
        url: `/uploads/${(_b = req === null || req === void 0 ? void 0 : req.file) === null || _b === void 0 ? void 0 : _b.filename}`,
    });
    yield video.save();
    res.status(201).json(video);
}));
router.delete("/:id", auth_middleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user; // Type assertion
    if (!user) {
        return res.status(401).json({ error: "User not authenticated" });
    }
    const video = yield Video_1.default.findById(req.params.id);
    if (video && video.user.equals(user === null || user === void 0 ? void 0 : user._id)) {
        // Delete video file from uploads folder
        const filePath = path_1.default.join("uploads", video.filename);
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            }
        });
        // Delete video record from database
        yield Video_1.default.deleteOne({ _id: req.params.id });
        res.status(200).send("File deleted successfully");
    }
    else {
        res.sendStatus(404);
    }
}));
// Listing API to get all videos
router.get("/", auth_middleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user; // Type assertion
    if (!user) {
        return res.status(401).json({ error: "User not authenticated" });
    }
    const videos = yield Video_1.default.find({ user: user._id });
    res.json(videos);
}));
exports.default = router;
