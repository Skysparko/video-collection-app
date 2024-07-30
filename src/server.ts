import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import videoRoutes from './routes/video.routes';
import { MONGO_URI } from './config';
import path from 'path';
import dotnev from "dotenv"
dotnev.config()
const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.APP_URL, // Your frontend URL
  credentials: true // Allow cookies and credentials
}));

mongoose.connect(MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Define your routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
