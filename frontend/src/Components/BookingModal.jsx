import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAppContext } from './Context/AppContext'

// BookingModal using shadcn-like styling with Tailwind + framer-motion
const BookingModal = ({ open, onClose, carId, pickupDate, returnDate }) => {
  const { axios, user } = useAppContext()
  const [aadhaarNo, setAadhaarNo] = useState('')
  const [licenceNo, setLicenceNo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const aadhaarRegex = useMemo(() => /^[0-9]{12}$/,
    [])
  const licenceRegex = useMemo(() => /^[A-Za-z0-9]{10,16}$/,
    [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!aadhaarRegex.test(aadhaarNo)) {
      toast.error('Enter valid 12-digit Aadhaar number')
      return
    }
    if (!licenceRegex.test(licenceNo)) {
      toast.error('Enter valid Licence (10-16 alphanumeric)')
      return
    }
    if (!user?._id) {
      toast.error('You must be logged in to book')
      return
    }

    try {
      setSubmitting(true)
      // Backend expects: { car, pickupDate, returnDate }
      const payload = {
        car: carId,
        pickupDate,
        returnDate,
      }
      const { data } = await axios.post('/api/booking/create-booking', payload)
      if (data?.success) {
        toast.success(data?.message || 'Booking created successfully')
        onClose?.()
      } else {
        toast.error(data?.message || 'Failed to create booking')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
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
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => !submitting && onClose?.()} />

          {/* Dialog */}
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="relative bg-white w-full max-w-lg mx-4 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Confirm Booking</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => !submitting && onClose?.()}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Aadhaar Card Number</label>
                  <input
                    type="text"
                    value={aadhaarNo}
                    onChange={(e) => setAadhaarNo(e.target.value)}
                    placeholder="12 digit number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Driving Licence Number</label>
                  <input
                    type="text"
                    value={licenceNo}
                    onChange={(e) => setLicenceNo(e.target.value)}
                    placeholder="10-16 alphanumeric"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Pickup Date</label>
                    <input
                      type="text"
                      value={pickupDate}
                      readOnly
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Return Date</label>
                    <input
                      type="text"
                      value={returnDate}
                      readOnly
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-gray-600"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border"
                  onClick={() => !submitting && onClose?.()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {submitting ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BookingModal;





