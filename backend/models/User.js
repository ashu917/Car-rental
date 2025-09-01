import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
      role:{
        type:String,
        enum:["owner","user"], default:'user'
    },
      image:{
        type:String,
        default:''
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    otpCode:{
        type:String,
        default:null
    },
    otpExpiresAt:{
        type:Date,
        default:null
    }
},{
    timestamps:true
})
const User=mongoose.model("User",userSchema)
export  default User;