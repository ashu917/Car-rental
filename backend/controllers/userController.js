import generateToken from "../middleware/generateToken.js";  // adjust path if needed
import User from "../models/User.js";
import bcrypt from 'bcrypt'
import Car from '../models/Car.js'
import crypto from 'crypto'
import { sendOtpEmail } from '../config/mailer.js'




// register user 
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password || password.length < 5) {
      return res.status(400).json({  success: false
        ,message: "All fields are required" });
    }

    // Validate role if provided
    const allowedRoles = ["owner", "user"];
    const finalRole = role && allowedRoles.includes(role) ? role : "user";

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(409).json({ success: false,message: "Email already registered" });
    }

    const hashedPassword= await bcrypt.hash(password,10)

    // create or update pending user
    if (!user) {
      user = await User.create({name, email, password:hashedPassword, role: finalRole, isVerified:false})
    } else {
      user.name = name
      user.password = hashedPassword
      user.role = finalRole
    }

    // generate OTP
    const otp = ('' + Math.floor(100000 + Math.random() * 900000))
    user.otpCode = crypto.createHash('sha256').update(otp).digest('hex')
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()

    // send email
    await sendOtpEmail(email, otp)

    res.json({ success:true, message:'OTP sent to email. Please verify to complete registration.' })


  } catch (error) {
    console.error("Register Error:", error);
    const hint = error?.code === 'ESOCKET' ? ' Email service not reachable. Check SMTP env or internet.' : ''
    res.status(500).json({ success:false, message: `Server error.${hint}` });
  }
};


// login User
export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.isVerified) {
      try {
        const otp = '' + Math.floor(100000 + Math.random() * 900000)
        user.otpCode = crypto.createHash('sha256').update(otp).digest('hex')
        user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)
        await user.save()
        await sendOtpEmail(email, otp)
      } catch (mailErr) {
        console.error('Login resend OTP error:', mailErr?.message || mailErr)
      }
      return res.json({ success: false, message: "Please verify your email. We've sent you a new OTP." });
    }

    // 2️⃣ Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    // 3️⃣ Generate token (pass full user object)
    const token = generateToken(user);

    // 4️⃣ Send response
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image || ""
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ success:false, message:'Email and OTP are required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ success:false, message:'User not found' })

    const hashed = crypto.createHash('sha256').update(String(otp)).digest('hex')
    const isMatch = user.otpCode && user.otpCode === hashed
    const notExpired = user.otpExpiresAt && user.otpExpiresAt > new Date()
    if (!isMatch || !notExpired) {
      return res.status(400).json({ success:false, message:'Invalid or expired OTP' })
    }

    user.isVerified = true
    user.otpCode = null
    user.otpExpiresAt = null
    await user.save()

    const token = generateToken(user)
    res.json({
      success:true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image || ""
      }
    })
  } catch (error) {
    console.error('Verify OTP Error:', error)
    res.status(500).json({ success:false, message:'Server error' })
  }
}

// resend OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ success:false, message:'User not found' })
    if (user.isVerified) return res.json({ success:true, message:'Already verified' })

    const otp = ('' + Math.floor(100000 + Math.random() * 900000))
    user.otpCode = crypto.createHash('sha256').update(otp).digest('hex')
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()

    await sendOtpEmail(email, otp)
    res.json({ success:true, message:'OTP resent to email' })
  } catch (error) {
    console.error('Resend OTP Error:', error)
    res.status(500).json({ success:false, message:'Server error' })
  }
}

// get user data using Token (JWT )
 export const getUserData= async (req,res)=>{
    try {
         const {user}=req;
         res.json({success:true , user})
    } catch (error) {
        console.log(error.message);
        res.json({success:false , message:" error is here "})
    }
 }


 // get All Cars for  the Frontend 
 export const getCars= async (req,res)=>{
  try {
       const cars =await Car.find({isAvailable:true, isBooked: false})
       res.json({success:true , cars})
  } catch (error) {
      console.log(error.message);
      res.json({success:false , message:" error is here "})
  }
}

 // public cars (no auth)
 export const getPublicCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true, isBooked: false }).select('-owner');
    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: ' error is here ' });
  }
 }
