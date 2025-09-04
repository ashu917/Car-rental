

// function to check Availability of car for a given date 

import Booking from "../models/Booking.js"
import Car from '../models/Car.js'
import { sendBookingStatusEmail } from '../config/mailer.js'

const startOfDay = (d) => {
    const dt = new Date(d)
    dt.setHours(0, 0, 0, 0)
    return dt
}

const endOfDay = (d) => {
    const dt = new Date(d)
    dt.setHours(23, 59, 59, 999)
    return dt
}

const checkAvailability = async (car, pickupDate, returnDate) => {
    const start = startOfDay(pickupDate)
    const end = endOfDay(returnDate)
    const overlapping = await Booking.find({
        car,
        pickupDate: { $lte: end },
        returnDate: { $gte: start },
    })
    return overlapping.length === 0
}


// API to check Availability of  cars for the given Date and location
 export const checkAvailabilityOfCar= async(req,res)=>{
    try {
        const {location, pickupDate, returnDate}=req.body

        if (!location || !pickupDate || !returnDate) {
            return res.json({ success:false, message: 'location, pickupDate and returnDate are required' })
        }
        const start = startOfDay(pickupDate)
        const end = endOfDay(returnDate)
        if (isNaN(start) || isNaN(end) || start > end) {
            return res.json({ success:false, message: 'Invalid date range' })
        }


        // fetch all available cars for the given location
        const cars= await Car.find({location, isAvailable:true})

        // check car Availability for the given date range using promise
        const availableCarsPromise=cars.map(async (car)=>{
            const isAvailable= await checkAvailability(car._id, start, end)
            return{...car._doc, isAvailable:isAvailable}
        })

        let availableCars= await Promise.all(availableCarsPromise);
        availableCars= availableCars.filter(car=>car.isAvailable===true)
        res.json({success:true, availableCars})

    } catch (error) {
      console.log(error.message);
      res.json({success: false, message:error.message})
        
    }
}



// API to Create Bookings

export const createBooking= async (req,res)=>{
    try {
        const {_id}=req.user;
        const {car, pickupDate, returnDate}=req.body

        if (!car || !pickupDate || !returnDate) {
            return res.json({ success:false, message: 'car, pickupDate and returnDate are required' })
        }
        const start = startOfDay(pickupDate)
        const end = endOfDay(returnDate)
        if (isNaN(start) || isNaN(end) || start > end) {
            return res.json({ success:false, message: 'Invalid date range' })
        }

        const isAvaliable= await checkAvailability(car, start, end);
        if(!isAvaliable){
            return res.json({success:false, message:"car is not available "})
        }
        const carData= await Car.findById(car)
        if (!carData || !carData.isAvailable) {
            return res.json({ success:false, message: "car not found or unavailable" })
        }

        // calculate price based on pickupdate and returnDate 
        const picked = new Date(start)
        const returned = new Date(end)
        const noOfDays= Math.ceil((returned-picked)/(1000*60*60*24))
        if (noOfDays <= 0) {
            return res.json({ success:false, message: 'Return date must be after pickup date' })
        }
        const price = (carData.pricePerDay || 0) * noOfDays;
        await Booking.create({car,owner:carData.owner,user:_id,pickupDate:start,returnDate:end,price})
        res.json({success:true, message:"Booking Created Successfully"})
        
    } catch (error) {
        console.log(error.message);
      res.json({success: false, message:error.message})
        
    }
}

// api to listUSer Bookings
export const  getUserBookings= async (req,res)=>{
try {
    const {_id}=req.user;
    const bookings= await Booking.find({user:_id}).populate("car").sort({createdAt:-1})
    res.json({success:true, bookings})
} catch (error) {
    console.log(error.message);
    res.json({success:false, message:error.message})
}

}


// Api to get Owner
export const  getOwnerBookings= async (req,res)=>{
    try {
        if(req.user.role !== "owner"){
            return res.json({success:false, message:"You are not authorized to access this resource"})
        }
        const query = { owner: req.user._id };
        const bookings = await  Booking.find(query).populate('car user').select("-user.password").sort({createdAt:-1})
        res.json({success:true, bookings})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}


// api to change booking status 
export const  changeBookingStatus= async( req, res)=>{
    try {
        const {_id}=req.user;
        const {bookingId, status}=req.body;
        const allowedStatuses = ["pending","confirmed","cancelled"]
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ success:false, message: "invalid status" })
        }
        const booking = await Booking.findById(bookingId)
       
        if(booking.owner.toString() !== _id.toString()){
            return res.json({success:false, message:"You are not authorized to access this resource"})
        }
        booking.status=status;
        await booking.save();

        // Update car booking status
        if (status === 'confirmed') {
            // Mark car as booked when booking is confirmed
            await Car.findByIdAndUpdate(booking.car, { isBooked: true });
        } else if (status === 'cancelled') {
            // Mark car as not booked when booking is cancelled
            await Car.findByIdAndUpdate(booking.car, { isBooked: false });
        }

        // Send email to user on status change (best-effort)
        try {
            const populated = await Booking.findById(bookingId).populate('car user')
            const toEmail = populated?.user?.email
            const carName = populated?.car ? `${populated.car.brand} ${populated.car.model}` : 'Your car booking'
            if (toEmail) {
                await sendBookingStatusEmail({
                    toEmail,
                    status,
                    carName,
                    pickupDate: populated.pickupDate,
                    returnDate: populated.returnDate,
                    price: populated.price,
                })
            }
        } catch (mailErr) {
            console.error('Booking status mail error:', mailErr?.message || mailErr)
        }

        res.json({success:true, message:"Booking Status Updated Successfully"})
    } catch (error) {
        console.log();
        res.json({success:false, message:error.message})
    }
}

// allow a user to cancel their own booking
export const cancelMyBooking = async (req, res) => {
    try {
        const { _id: userId } = req.user
        const { bookingId } = req.body

        if (!bookingId) {
            return res.json({ success: false, message: 'bookingId is required' })
        }

        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.json({ success: false, message: 'Booking not found' })
        }
        if (booking.user.toString() !== userId.toString()) {
            return res.json({ success: false, message: 'Not authorized to cancel this booking' })
        }
        if (booking.status === 'cancelled') {
            return res.json({ success: true, message: 'Booking already cancelled' })
        }

        booking.status = 'cancelled'
        await booking.save()

        // free the car if needed
        await Car.findByIdAndUpdate(booking.car, { isBooked: false })

        return res.json({ success: true, message: 'Booking cancelled successfully' })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// allow a user to update dates of their own booking
export const updateMyBookingDates = async (req, res) => {
    try {
        const { _id: userId } = req.user
        const { bookingId, pickupDate, returnDate } = req.body

        if (!bookingId || !pickupDate || !returnDate) {
            return res.json({ success: false, message: 'bookingId, pickupDate and returnDate are required' })
        }

        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.json({ success: false, message: 'Booking not found' })
        }
        if (booking.user.toString() !== userId.toString()) {
            return res.json({ success: false, message: 'Not authorized to update this booking' })
        }
        if (booking.status === 'cancelled') {
            return res.json({ success: false, message: 'Cancelled bookings cannot be updated' })
        }

        const start = startOfDay(pickupDate)
        const end = endOfDay(returnDate)
        if (isNaN(start) || isNaN(end) || start > end) {
            return res.json({ success: false, message: 'Invalid date range' })
        }

        // ensure the car is available for the new range, ignoring this booking itself
        const overlapping = await Booking.find({
            car: booking.car,
            _id: { $ne: booking._id },
            pickupDate: { $lte: end },
            returnDate: { $gte: start },
            status: { $ne: 'cancelled' }
        })
        if (overlapping.length > 0) {
            return res.json({ success: false, message: 'Car not available for selected dates' })
        }

        // recalc price
        const carData = await Car.findById(booking.car)
        const picked = new Date(start)
        const returned = new Date(end)
        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
        if (noOfDays <= 0) {
            return res.json({ success: false, message: 'Return date must be after pickup date' })
        }
        const price = (carData?.pricePerDay || 0) * noOfDays

        booking.pickupDate = start
        booking.returnDate = end
        booking.price = price
        await booking.save()

        return res.json({ success: true, message: 'Booking updated successfully' })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}