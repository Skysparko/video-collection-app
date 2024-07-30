"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const video_routes_1 = __importDefault(require("./routes/video.routes"));
const config_1 = require("./config");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.APP_URL, // Your frontend URL
    credentials: true // Allow cookies and credentials
}));
mongoose_1.default.connect(config_1.MONGO_URI).then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Define your routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/videos', video_routes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
