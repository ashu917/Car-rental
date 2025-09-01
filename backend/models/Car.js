import mongoose, { model }  from "mongoose";
//import { Types } from "mongoose";
const {ObjectId}=mongoose.Schema.Types

const CarSchema = new mongoose.Schema(
  {
    owner: { type: ObjectId, ref: "User", required: true, index: true },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    year: { type: Number, required: true, min: 1900 },
    category: { type: String, required: true, trim: true }, // e.g., SUV, Sedan
    seating_capacity: { type: Number, required: true, min: 1 },
    fuel_type: { type: String, required: true, trim: true }, // e.g., Petrol, Diesel, Electric
    transmission: { type: String, required: true, trim: true }, // Automatic / Manual
    pricePerDay: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    isAvailable: { type: Boolean, default: true, index: true },
    isBooked: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);
// helpful indexes for common queries
CarSchema.index({ owner: 1, isAvailable: 1 });
CarSchema.index({ location: 1, isAvailable: 1 });
CarSchema.index({ brand: 1, model: 1, year: 1 });
CarSchema.index({ isBooked: 1, isAvailable: 1 });
const Car =mongoose.model("Car",CarSchema)

export default Car;