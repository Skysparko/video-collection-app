"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const passport_1 = __importDefault(require("passport"));
const auth_middleware_1 = require("../middleware/auth-middleware");
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
router.get("/user", auth_middleware_1.authenticateJWT, (req, res) => {
    if (req.user) {
        const user = req.user;
        res.json({
            email: user.email,
            // Add other user details as needed
        });
    }
    else {
        res.sendStatus(404);
    }
});
// Google OAuth routes
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    res.redirect("/profile");
});
exports.default = router;
