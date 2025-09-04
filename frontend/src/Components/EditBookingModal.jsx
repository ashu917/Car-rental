import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EditBookingModal = ({ open, onClose, booking, onSubmit }) => {
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')

  const pickupMin = useMemo(() => new Date().toISOString().split('T')[0], [])

  useEffect(() => {
    if (booking?._id) {
      setPickupDate(booking.pickupDate ? booking.pickupDate.split('T')[0] : '')
      setReturnDate(booking.returnDate ? booking.returnDate.split('T')[0] : '')
    }
  }, [booking])

  const disabled = booking?.status === 'cancelled'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!pickupDate || !returnDate) return
    onSubmit?.({ bookingId: booking._id, pickupDate, returnDate })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40" onClick={() => onClose?.()} />
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="relative bg-white w-full max-w-2xl mx-4 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit Booking</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => onClose?.()} aria-label="Close">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-1">
                  <div className="rounded-lg overflow-hidden border border-gray-200">
                    <img src={booking?.car?.image} alt="" className="w-full h-auto aspect-video object-cover" />
                  </div>
                  <p className="mt-3 text-gray-900 font-medium">{booking?.car?.brand} {booking?.car?.model}</p>
                  <p className="text-gray-500">{booking?.car?.year} · {booking?.car?.category} · {booking?.car?.location}</p>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Pickup Date</label>
                      <input type="date" value={pickupDate} min={pickupMin} onChange={(e) => setPickupDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2" disabled={disabled} required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Return Date</label>
                      <input type="date" value={returnDate} min={pickupDate || pickupMin} onChange={(e) => setReturnDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2" disabled={disabled} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Status</label>
                      <input type="text" value={booking?.status || ''} readOnly className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-gray-600" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Total Price</label>
                      <input type="text" value={booking?.price ?? ''} readOnly className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button type="button" className="px-4 py-2 rounded-lg border" onClick={() => onClose?.()}>Close</button>
                <button type="submit" className={`px-4 py-2 rounded-lg text-white ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`} disabled={disabled}>Save Changes</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default EditBookingModal


