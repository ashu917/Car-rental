import express from 'express'
import { changeBookingStatus, checkAvailabilityOfCar, getOwnerBookings, getUserBookings, cancelMyBooking, updateMyBookingDates } from '../controllers/bookingController.js'
import { protect, authorizeRole } from '../middleware/auth.js'
import { createBooking } from '../controllers/bookingController.js'
const bookingRouter=express.Router()


bookingRouter.post('/check-availability',checkAvailabilityOfCar)
bookingRouter.post('/create-booking', protect, createBooking)
bookingRouter.get('/user-bookings', protect, getUserBookings)
bookingRouter.post('/cancel', protect, cancelMyBooking)
bookingRouter.post('/update-dates', protect, updateMyBookingDates)
bookingRouter.get('/owner', protect, authorizeRole(['owner']), getOwnerBookings)
bookingRouter.post('/change-status', protect, authorizeRole(['owner']), changeBookingStatus)
export default bookingRouter