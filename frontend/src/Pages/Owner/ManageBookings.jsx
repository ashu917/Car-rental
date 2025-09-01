import React, { useEffect, useState } from 'react'
import Title from '../../Components/Title'
import { assets} from '../../assets/assets'
import { useAppContext } from '../../Components/Context/AppContext'
import toast from 'react-hot-toast'

const ManageBookings = () => {

  const {currency, axios, authReady}=useAppContext()
  const [bookings, setBookings] = useState([])
  
 const fetchOwnerBookings= async ()=>{
  try {
     const token = localStorage.getItem('token') || '';
     const {data}= await axios.get('/api/booking/owner',{
      headers: {
        Authorization: `Bearer ${token}`
      }
     })
     data.success  ? setBookings(data.bookings): toast.error(data.message)
  } catch (error) {
    toast.error(error.message)
  }
 }

// chnage booking status
const changeBookingStatus = async (bookingId, status) => {
  try {
    const token = localStorage.getItem('token') || '';
    const { data } = await axios.post('/api/booking/change-status', { bookingId, status }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (data.success) {
      toast.success(data.message)
      fetchOwnerBookings()   // always reload fresh data
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
  }
}


  useEffect(() => {
    if (authReady) {
      fetchOwnerBookings();
    }
  }, [authReady])

  return (
    <div className='px-4 pt-6 md:px-8 flex-1 bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        {/* Title */}
        <div className='mb-8'>
          <Title
            title='Manage Bookings'
            subTitle='Track all customer bookings, approve or cancel requests, and manage booking statuses.'
            align='left'
          />
        </div>

        {/* Table header */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='p-6 border-b border-gray-100'>
            <h2 className='text-xl font-semibold text-gray-900'>Recent Bookings</h2>
            <p className='text-gray-500 text-sm mt-1'>Manage customer booking requests and statuses</p>
          </div>
          
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Car
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Date Range
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Total
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Rows */}
              {bookings.length > 0 && (
                <tbody className='bg-white divide-y divide-gray-200'>
                  {bookings.map((b) => (
                    <tr key={b._id} className='hover:bg-gray-50 transition-colors duration-200'>
                      {/* Car */}
                      <td className='px-6 py-4'>
                        <div className='flex items-center'>
                          <img src={b.car?.image} alt='' className='w-16 h-12 object-cover rounded-lg mr-4' />
                          <div>
                            <p className='font-medium text-gray-900'>{b.car?.brand} {b.car?.model}</p>
                            <p className='text-gray-500 text-sm'>{b.car?.category}</p>
                          </div>
                        </div>
                      </td>

                      {/* Date range */}
                      <td className='px-6 py-4'>
                        <p className='text-gray-900 font-medium'>
                          {(b.pickupDate || '').split('T')[0]} - {(b.returnDate || '').split('T')[0]}
                        </p>
                      </td>

                      {/* Total */}
                      <td className='px-6 py-4'>
                        <p className='text-gray-900 font-medium'>{currency}{b.price}</p>
                      </td>

                      {/* Payment (using status for now) */} 
                      <td className='px-6 py-4'>
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${
                          b.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                          b.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          b.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                          'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                          {b.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className='px-6 py-4'>
                        <div className='flex items-center space-x-3'>
                          <button  
                            onClick={() => changeBookingStatus(b._id, 'confirmed')} 
                            className='inline-flex items-center px-3 py-1.5 border border-green-300 shadow-sm text-xs font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200'
                          >
                            <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                            </svg>
                            Approve
                          </button>
                          <button 
                            onClick={() => changeBookingStatus(b._id, 'cancelled')} 
                            className='inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200'
                          >
                            <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
            
            {bookings.length === 0 && (
              <div className='p-12 text-center'>
                <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                  </svg>
                </div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>No bookings yet</h3>
                <p className='text-gray-500'>When customers book your cars, they will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageBookings
