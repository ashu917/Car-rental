

import  express ,{ Router } from 'express';
import { getCars, getUserData, LoginUser, registerUser, getPublicCars, verifyOtp, resendOtp } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
 const userRouter=express.Router();
 userRouter.post('/register',registerUser)
 userRouter.post('/login', LoginUser)
 userRouter.post('/verify-otp', verifyOtp)
 userRouter.post('/resend-otp', resendOtp)
 userRouter.get('/data',protect,getUserData)
 userRouter.get('/cars',protect,getCars)
 userRouter.get('/public/cars',getPublicCars)
 export  default userRouter;