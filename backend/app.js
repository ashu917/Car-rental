


import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import compression from 'compression';

import connectDb from './config/db.js';
import userRouter from './routes/userRoutes.js';
import ownerRouter from './routes/ownerRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import geminiRouter from './routes/geminiRoutes.js';
import feedbackRouter from './routes/feedbackRoutes.js';

// GOOGLE
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import googleAuth from './middleware/googleAuth.js';

const app = express();

// ✅ Compression middleware for better performance
app.use(compression());

// ✅ CORS setup
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://car-rental-frontend-l2gx.onrender.com:5173', 
  credentials: true
}));

app.use(express.json());

// avoid favicon errors
app.get('/favicon.ico', (req, res) => res.status(204).end());

// ✅ Connect MongoDB using your helper
connectDb();

// ✅ Passport Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL || 'https://car-rental-frontend-l2gx.onrender.com'}/auth/google/callback`
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Google login route
app.get('/auth/google', passport.authenticate('google', {
  scope: ["email", "profile"],
  prompt: "select_account"
}));

// Google callback
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'https://car-rental-frontend-l2gx.onrender.com'}/` }),
  googleAuth
);

// ✅ API routes
app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/booking', bookingRouter);

//   api call for  gemini api
app.use('/api/gemini', geminiRouter);

// Feedback routes
app.use('/api/feedback', feedbackRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
