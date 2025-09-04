import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../Components/Title'
import { useAppContext } from '../Components/Context/AppContext'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import EditBookingModal from '../Components/EditBookingModal'

const MyBookings = () => {

  const{axios, user,currency}= useAppContext();

  const [bookings, setBookings] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
 

  const fetchMyBookings = async () => {
    try {
      const {data}= await axios.get('/api/booking/user-bookings')
      if(data.success){
        setBookings(data.bookings)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    user && fetchMyBookings()
  }, [user])

  const handleCancel = async (bookingId) => {
    try {
      const res = await Swal.fire({
        title: 'Cancel this booking?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e02424',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, cancel it',
      })
      if (!res.isConfirmed) return
      const { data } = await axios.post('/api/booking/cancel', { bookingId })
      if (data.success) {
        await Swal.fire({ title: 'Cancelled', text: data.message || 'Booking cancelled', icon: 'success', timer: 1400, showConfirmButton: false })
        fetchMyBookings()
      } else {
        await Swal.fire({ title: 'Failed', text: data.message || 'Failed to cancel', icon: 'error' })
      }
    } catch (error) {
      await Swal.fire({ title: 'Error', text: error.response?.data?.message || error.message, icon: 'error' })
    }
  }

  const openEdit = (booking) => { setSelectedBooking(booking); setShowEdit(true) }

  const submitEdit = async ({ bookingId, pickupDate, returnDate }) => {
    try {
      const { data } = await axios.post('/api/booking/update-dates', { bookingId, pickupDate, returnDate })
      if (data.success) {
        setShowEdit(false)
        await Swal.fire({ title: 'Updated', text: data.message || 'Booking updated', icon: 'success', timer: 1400, showConfirmButton: false })
        fetchMyBookings()
      } else {
        await Swal.fire({ title: 'Failed', text: data.message || 'Failed to update', icon: 'error' })
      }
    } catch (error) {
      await Swal.fire({ title: 'Error', text: error.response?.data?.message || error.message, icon: 'error' })
    }
  }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'>
      <Title
        title='My Bookings'
        subTitle='View and manage all your car bookings'
        align='left'
      />

      <div>
        {bookings.map((booking, index) => (
          <div
            key={booking._id || index}
            className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'
          >
            {/* Car Image + Info */}
            <div className='md:col-span-1'>
              <div className='rounded-md overflow-hidden mb-3'>
                <img
                  src={booking.car?.image || assets.default_car_image}
                  alt=''
                  className='w-full h-auto aspect-video object-cover'
                />
              </div>
              <p className='text-lg font-medium mt-2'>
                {booking.car?.brand || ''} {booking.car?.model || ''}
              </p>
              <p className='text-gray-500'>
                {booking.car?.year || ''} · {booking.car?.category || ''} ·{' '}
                {booking.car?.location || ''}
              </p>
            </div>

            {/* Booking Info */}
            <div className='md:col-span-2'>
              <div className='flex items-center gap-2'>
                <p className='px-3 py-1.5 bg-light rounded'>
                  Booking #{index + 1}
                </p>
                <p
                  className={`px-3 py-1 text-xs rounded-full ${
                    booking.status === 'confirmed'
                      ? 'bg-green-400/15 text-green-600'
                      : 'bg-red-400/15 text-red-600'
                  }`}
                >
                  {booking.status || 'pending'}
                </p>
              </div>

              {/* Rental Period */}
              <div className='flex items-start gap-2 mt-3'>
                <img
                  src={assets.calendar_icon_colored}
                  alt=''
                  className='w-4 h-4 mt-1'
                />
                <div>
                  <p className='text-gray-500'>Rental Period</p>
                  <p>
                    {booking.pickupDate
                      ? booking.pickupDate.split('T')[0]
                      : 'N/A'}{' '}
                    To{' '}
                    {booking.returnDate
                      ? booking.returnDate.split('T')[0]
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Pickup Location */}
              <div className='flex items-start gap-2 mt-3'>
                <img
                  src={assets.location_icon}
                  alt=''
                  className='w-4 h-4 mt-1'
                />
                <div>
                  <p className='text-gray-500'>Pickup Location</p>
                  <p>{booking.car?.location || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className='md:col-span-1 flex flex-col justify-between gap-6'>
              <div className='text-sm text-gray-500 text-right'>
                <p>Total Price</p>
                <h1 className='text-2xl font-semibold text-primary'>
                  {currency}
                  {booking.price || 0}
                </h1>
                <p>
                  Booked on{' '}
                  {booking.createdAt
                    ? booking.createdAt.split('T')[0]
                    : 'N/A'}
                </p>
              </div>
              <div className='flex items-center justify-end gap-2'>
                <button
                  onClick={() => openEdit(booking)}
                  className='px-3 py-1.5 border rounded-lg'
                  disabled={booking.status === 'cancelled'}
                >
                  Update Dates
                </button>
                <button
                  onClick={() => handleCancel(booking._id)}
                  className='px-3 py-1.5 border rounded-lg text-red-600'
                  disabled={booking.status === 'cancelled'}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <EditBookingModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        booking={selectedBooking}
        onSubmit={submitEdit}
      />
    </div>
  )
}

export default MyBookings

// Modal mount
// Keep outside of map to avoid multiple instances
// but we mount it at the end to keep DOM simple



