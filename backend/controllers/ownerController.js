
import imagekit from "../config/imagekit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import  fs from 'fs';


export const changeRoleToOwner = async (req, res) => {
     try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { role: "owner" });
        res.json({ success: true, message: "now you can list cars" });
     } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
     }
}


 // api to list car


// problem  
export const addCar= async (req,res)=>{
     try {
        const { _id } = req.user;
        const imageFile = req.file;

        // Validate carData presence and parse safely
        const rawCarData = req.body && req.body.carData;
        if (!rawCarData) {
          return res.status(400).json({ success: false, message: 'carData is required in form-data' });
        }
        let car;
        if (typeof rawCarData === 'string') {
          try {
            car = JSON.parse(rawCarData);
          } catch (e) {
            return res.status(400).json({ success: false, message: 'carData must be valid JSON' });
          }
        } else {
          car = rawCarData;
        }

        if (!imageFile) {
          return res.status(400).json({ success: false, message: 'Image file is required' });
        }

        // upload Image to imagekit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file:fileBuffer,
            fileName:imageFile.originalname,
            folder:'/cars'
        })

        // optimize through imagekit Url transfirmation
var optimizeImageUrl = imagekit.url({
    path : response.filePath,
    transformation : [
        {width:'1280'},// width resizing
        {quality:'auto'},// auto compression
        {format:'webp'}// convert to modern format 
    ]
});

  const image = optimizeImageUrl;
  await Car.create({ ...car, owner:_id, image })
   res.json({success:true, message :"car added"})


     } catch (error) {
       res.status(500).json({ success: false, message: error.message })

     }
}



// Api to list Owner Cars 
export const getOwnerCars = async (req, res) => {
  try {
    const { _id, role } = req.user;
            const query = { owner: _id };
    const cars = await Car.find(query);
    
    res.json({ success: true, cars });
  } catch (error) {
    console.error(error.message); // ✅ better for debugging
    res.status(500).json({ success: false, message: error.message });
  }
};


// Api to Toggle Car Availability 
 export const toggleCarAvailability= async(req,res)=>{
  try {
    const {_id, role}=req.user;
    const{carId}=req.body;
    const car= await Car.findById(carId)

    // checking if car belongs to the user 
    if(car.owner.toString() !== _id.toString()){
      return res.json({success:false, message:"unauthorized"})
    }
    car.isAvailable=!car.isAvailable;
    await car.save()
    res.json({success:true, message: "Availability Toggled"})
  } catch (error) {
     console.error(error.message); // ✅ better for debugging
    res.status(500).json({ success: false, message: error.message });
  }
 }



 // Api  for delete car 
 export const deleteCar= async(req,res)=>{
  try {
    const {_id, role}=req.user;
    const{carId}=req.body;
    const car= await Car.findById(carId)

    if(!car){
      return res.status(404).json({success:false, message:"Car not found"})
    }

    // checking if car belongs to the user 
    if(car.owner.toString() !== _id.toString()){
      return res.status(403).json({success:false, message:"Unauthorized"})
    }

    // Permanently delete the car to avoid violating required `owner` field
    await Car.findByIdAndDelete(carId)
    res.json({success:true,  message:"car deleted"})
  } catch (error) {
     console.error(error.message); // ✅ better for debugging
    res.status(500).json({ success: false, message: error.message });
  }
 }




 // api to get dashboard data

 export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role !== 'owner') {
      return res.json({ success: false, message: 'Unauthorized' });
    }

    // Scope: owners see their data
    const carQuery = { owner: _id };
    const bookingQuery = { owner: _id };

    const cars = await Car.find(carQuery);
    const bookings = await Booking.find(bookingQuery).populate('car').sort({ createdAt: -1 });
    const pendingBookings = await Booking.find({ ...bookingQuery, status: 'pending' });
    const completedBookings = await Booking.find({ ...bookingQuery, status: 'confirmed' });

    const monthlyRevenue = bookings
      .filter((b) => b.status === 'confirmed')
      .reduce((acc, b) => acc + (b.price || 0), 0);

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
 } 

 // api to update user image 
 export const updateUserImage = async(req,res)=>{
  try {
     const {_id}=req.user;
     const imageFile= req.file;
     
     if (!imageFile) {
       return res.status(400).json({ success: false, message: 'Image file is required' });
     }

     // upload image to ImageKit
     const fileBuffer= fs.readFileSync(imageFile.path)
     const response = await imagekit.upload({
      file:fileBuffer,
      fileName: imageFile.originalname,
      folder:'/users'
     })

     // optimization through imagekit URL transformation
     var optimizedImageUrl= imagekit.url({
      path:response.filePath,
      transformation:[
        {width:'400'},
        {quality:'auto'},
        {format:'webp'}
      ]
     });

     const image= optimizedImageUrl;
     await User.findByIdAndUpdate(_id,{image});
     
     // Clean up the temporary file
     fs.unlinkSync(imageFile.path);
     
     res.json({success: true, message:'Profile image updated successfully'})
  } catch (error) {
    console.error(error.message); // ✅ better for debugging
    res.status(500).json({ success: false, message: error.message });
  }
 }







