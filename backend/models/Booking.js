import mongoose, { model }  from "mongoose";
//import { Types } from "mongoose";
const {ObjectId}=mongoose.Schema.Types

const bookingSchema = new mongoose.Schema(
  {
   car:{type:ObjectId, ref:"Car", required:true, index:true},
   user:{type:ObjectId, ref:"User", required:true, index:true},
   owner:{type:ObjectId, ref:"User", required:true, index:true},
   pickupDate:{type: Date, required:true},
   returnDate:{type:Date, required:true},
   status:{type:String, enum:["pending", "confirmed", "cancelled"], default: "pending", index:true},
   price:{type:Number, required :true}
  },
  { timestamps: true }
);
bookingSchema.index({ pickupDate: 1, returnDate: 1, car: 1 });
const Booking =mongoose.model("Booking",bookingSchema)

export default Booking;