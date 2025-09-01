import User from "../models/User.js";
import generateToken from "../middleware/generateToken.js";
import bcrypt from 'bcrypt';

const googleAuth = async (req, res) => {
  try {
    // Google sends profile info in req.user._json (because of passport)
    const profile = req.user?._json;
    if (!profile) {
      return res.status(400).json({ message: "Google profile not found" });
    }

    // 1️⃣ Check if user already exists by email
    let user = await User.findOne({ email: profile.email });

    // 2️⃣ If user does not exist, create a new one
    if (!user) {
      // Hash the Google "sub" (unique Google ID) as a dummy password
      const hashed = await bcrypt.hash(profile.sub, 10);

      user = await User.create({
        name: profile.name,                         // Google display name
        email: profile.email,                       // Google email
        password: hashed,                           // store hashed Google ID
        role: "user",                               // default role
        image: profile.picture || ""                // Google profile pic if available
      });
    }

    // 3️⃣ Generate JWT token
    const token = generateToken(user);

    // 4️⃣ Redirect to frontend with token
    // Using encodeURIComponent to safely pass token in URL
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?token=${encodeURIComponent(token)}`);

    
  } catch (err) {
    console.error("Google Auth Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export default googleAuth;
