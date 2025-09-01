import React, { useEffect, useMemo, useState } from 'react'
import { useAppContext } from '../Components/Context/AppContext'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'

// Enhanced Stat Card with animations and better styling
const StatCard = ({ label, value, icon, color = 'blue', trend = null, onClick }) => (
  <div 
    className='group relative p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer'
    onClick={onClick}
  >
    <div className='flex items-center justify-between min-w-0'>
      <div className='flex items-center gap-4 min-w-0 flex-1'>
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${color}-100 to-${color}-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0`}>
          <img src={icon} alt='' className='w-7 h-7' />
        </div>
        <div className='min-w-0 flex-1'>
          <p className='text-gray-600 text-sm font-medium mb-1 truncate'>{label}</p>
          <p className='text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent truncate'>{value}</p>
        </div>
      </div>
      {trend && (
        <div className={`text-xs px-3 py-1.5 rounded-full flex-shrink-0 ${trend > 0 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
  </div>
)

// Detailed Stats Modal Component
const StatsDetailModal = ({ isOpen, onClose, cardData, bookings, currency, assets }) => {
  if (!isOpen || !cardData) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Handle escape key press
  React.useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen, onClose])

  const renderCardContent = () => {
    switch (cardData.type) {
      case 'total-bookings':
        return (
          <div className='space-y-6'>
            <div className='text-center'>
              <div className='w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4'>
                <img src={assets.listIconColored} alt='' className='w-10 h-10' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-2'>Total Bookings</h3>
              <p className='text-4xl font-bold text-blue-600'>{bookings.length}</p>
            </div>
            
            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-blue-50 rounded-xl p-4 text-center'>
                <p className='text-sm text-blue-600 font-medium'>Confirmed</p>
                <p className='text-2xl font-bold text-blue-700'>{bookings.filter(b => b.status === 'confirmed').length}</p>
              </div>
              <div className='bg-yellow-50 rounded-xl p-4 text-center'>
                <p className='text-sm text-yellow-600 font-medium'>Pending</p>
                <p className='text-2xl font-bold text-yellow-700'>{bookings.filter(b => b.status === 'pending').length}</p>
              </div>
            </div>

            <div className='bg-gray-50 rounded-xl p-4'>
              <h4 className='font-semibold text-gray-900 mb-3'>Recent Bookings</h4>
              <div className='space-y-2'>
                {bookings.slice(0, 3).map((booking, i) => (
                  <div key={i} className='flex items-center justify-between text-sm'>
                    <span className='text-gray-600'>{booking.car?.brand} {booking.car?.model}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'confirmed':
        return (
          <div className='space-y-6'>
            <div className='text-center'>
              <div className='w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4'>
                <img src={assets.check_icon} alt='' className='w-10 h-10' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-2'>Confirmed Bookings</h3>
              <p className='text-4xl font-bold text-green-600'>{bookings.filter(b => b.status === 'confirmed').length}</p>
            </div>
            
            <div className='bg-green-50 rounded-xl p-4'>
              <h4 className='font-semibold text-gray-900 mb-3'>Confirmed Bookings Details</h4>
              <div className='space-y-3'>
                {bookings.filter(b => b.status === 'confirmed').map((booking, i) => (
                  <div key={i} className='bg-white rounded-lg p-3 border border-green-200'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='font-medium text-gray-900'>{booking.car?.brand} {booking.car?.model}</span>
                      <span className='text-green-600 font-semibold'>{currency}{booking.price}</span>
                    </div>
                    <div className='text-sm text-gray-600'>
                      <p>Dates: {new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}</p>
                      <p>Location: {booking.car?.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'pending':
        return (
          <div className='space-y-6'>
            <div className='text-center'>
              <div className='w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4'>
                <img src={assets.cautionIconColored} alt='' className='w-10 h-10' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-2'>Pending Bookings</h3>
              <p className='text-4xl font-bold text-yellow-600'>{bookings.filter(b => b.status === 'pending').length}</p>
            </div>
            
            <div className='bg-yellow-50 rounded-xl p-4'>
              <h4 className='font-semibold text-gray-900 mb-3'>Pending Bookings Details</h4>
              <div className='space-y-3'>
                {bookings.filter(b => b.status === 'pending').map((booking, i) => (
                  <div key={i} className='bg-white rounded-lg p-3 border border-yellow-200'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='font-medium text-gray-900'>{booking.car?.brand} {booking.car?.model}</span>
                      <span className='text-yellow-600 font-semibold'>{currency}{booking.price}</span>
                    </div>
                    <div className='text-sm text-gray-600'>
                      <p>Dates: {new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}</p>
                      <p>Location: {booking.car?.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'total-spent':
        return (
          <div className='space-y-6'>
            <div className='text-center'>
              <div className='w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4'>
                <img src={assets.dashboardIconColored} alt='' className='w-10 h-10' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-2'>Total Spent</h3>
              <p className='text-4xl font-bold text-purple-600'>{currency}{bookings.reduce((sum, b) => sum + (b.price || 0), 0).toLocaleString()}</p>
            </div>
            
            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-purple-50 rounded-xl p-4 text-center'>
                <p className='text-sm text-purple-600 font-medium'>Average per Booking</p>
                <p className='text-xl font-bold text-purple-700'>
                  {currency}{bookings.length > 0 ? (bookings.reduce((sum, b) => sum + (b.price || 0), 0) / bookings.length).toFixed(0) : 0}
                </p>
              </div>
              <div className='bg-green-50 rounded-xl p-4 text-center'>
                <p className='text-sm text-green-600 font-medium'>Confirmed Spent</p>
                <p className='text-xl font-bold text-green-700'>
                  {currency}{bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + (b.price || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className='bg-gray-50 rounded-xl p-4'>
              <h4 className='font-semibold text-gray-900 mb-3'>Spending Breakdown</h4>
              <div className='space-y-2'>
                {bookings.map((booking, i) => (
                  <div key={i} className='flex items-center justify-between text-sm bg-white rounded-lg p-2'>
                    <span className='text-gray-600'>{booking.car?.brand} {booking.car?.model}</span>
                    <span className='font-medium text-gray-900'>{currency}{booking.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              {cardData.label} Details
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 shadow-sm"
            >
              <img src={assets.close_icon} alt="Close" className="w-5 h-5" />
            </button>
          </div>

          {renderCardContent()}
        </div>
      </div>
    </div>
  )
}

// Profile Edit Modal Component
const ProfileEditModal = ({ isOpen, onClose, user, onUpdate, assets }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  })
  const [profileImage, setProfileImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(user?.image || assets.user_profile)
  const [loading, setLoading] = useState(false)

  // Handle escape key press
  React.useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen, onClose])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onload = () => setPreviewImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simulate API call - replace with your actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update user data (you'll need to implement this with your backend)
      onUpdate({ ...formData, image: previewImage })
      toast.success('Profile updated successfully!')
      onClose()
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 shadow-sm"
          >
            <img src={assets.close_icon} alt="Close" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="text-center py-4">
            <div className="relative inline-block">
              <img
                src={previewImage}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-600 transition-colors duration-200 shadow-lg">
                <img src={assets.upload_icon} alt="Upload" className="w-5 h-5 brightness-0 invert" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-300 text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-300 text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-300 text-base"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-300 resize-none text-base"
              rows="4"
              placeholder="Enter your address"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}

// Left Sidebar Component
const Sidebar = ({ user, assets, activeSection, setActiveSection, onEditProfile, bookings, totalSpent, currency }) => {
  const navigationItems = [
    {
      id: 'browse-cars',
      label: 'Browse Cars',
      icon: assets.carIconColored,
      href: '/cars'
    },
    {
      id: 'my-bookings',
      label: 'My Bookings',
      icon: assets.listIconColored,
      href: '/my-bookings'
    },
    {
      id: 'find-cars',
      label: 'Find Cars',
      icon: assets.search_icon,
      href: '/cars'
    }
  ]

  return (
    <div className='w-80 bg-white/90 backdrop-blur-sm border-r border-white/30 h-full shadow-xl rounded-tr-2xl rounded-br-2xl'>
      {/* Profile Section */}
      <div className='p-6 border-b border-white/30 bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 rounded-tr-2xl'>
        <div className='flex items-center gap-4 mb-4'>
          <div className='relative'>
            <img 
              src={user?.image || assets.user_profile} 
              alt='Profile' 
              className='w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg' 
            />
            <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-sm'></div>
          </div>
          <div className='flex-1'>
            <h2 className='text-lg font-bold text-gray-900'>{user?.name}</h2>
            <p className='text-gray-600 text-sm'>{user?.email}</p>
            <span className='inline-block mt-1 px-2 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-medium border border-blue-200'>
              {user?.role === 'owner' ? '🚗 Car Owner' : '👤 Customer'}
            </span>
          </div>
        </div>
        
        {/* Profile Edit Button */}
        <button 
          onClick={onEditProfile}
          className='w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-white to-blue-50 border border-blue-200 text-blue-700 hover:from-blue-50 hover:to-blue-100 transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1'
        >
          <img src={assets.edit_icon} alt='' className='w-4 h-4' />
          Edit Profile
        </button>
      </div>

      {/* Navigation Section */}
      <div className='p-4'>
        <h3 className='text-sm font-semibold text-gray-700 mb-4 px-2'>Quick Navigation</h3>
        <div className='space-y-2'>
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                activeSection === item.id 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 shadow-md' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-blue-600'
              }`}
              onClick={() => setActiveSection(item.id)}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                activeSection === item.id 
                  ? 'bg-gradient-to-r from-blue-100 to-indigo-100' 
                  : 'bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-blue-100 group-hover:to-indigo-100'
              }`}>
                <img src={item.icon} alt='' className='w-4 h-4' />
              </div>
              <span className='font-medium'>{item.label}</span>
              {activeSection === item.id && (
                <div className='ml-auto w-2 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full'></div>
              )}
            </a>
          ))}
        </div>
      </div>

      {/* Dashboard Stats Summary */}
      <div className='p-4 border-t border-white/30 mt-auto'>
        <h3 className='text-sm font-semibold text-gray-700 mb-3 px-2'>Dashboard Summary</h3>
        <div className='space-y-2'>
                      <div className='flex items-center justify-between px-2 py-1'>
              <span className='text-xs text-gray-600'>Total Bookings</span>
              <span className='text-xs font-semibold text-gray-900'>{bookings.length}</span>
            </div>
            <div className='flex items-center justify-between px-2 py-1'>
              <span className='text-xs text-gray-600'>Active Rentals</span>
              <span className='text-xs font-semibold text-green-600'>{bookings.filter(b => b.status === 'confirmed').length}</span>
            </div>
            <div className='flex items-center justify-between px-2 py-1'>
              <span className='text-xs text-gray-600'>Total Spent</span>
              <span className='text-xs font-semibold text-gray-900'>{currency}{totalSpent.toLocaleString()}</span>
            </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced Booking Card
const BookingCard = ({ booking, currency, assets }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200'
      case 'pending': return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border-yellow-200'
      case 'cancelled': return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200'
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return assets.check_icon
      case 'pending': return assets.cautionIconColored
      case 'cancelled': return assets.close_icon
      default: return assets.cautionIconColored
    }
  }

  return (
    <div className='group p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 hover:shadow-xl transition-all duration-500 hover:-translate-y-2'>
      <div className='flex items-center gap-4'>
        <div className='relative'>
          <img 
            src={booking.car?.image || assets.car_image1} 
            alt='' 
            className='w-24 h-20 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300' 
          />
          <div className='absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-white'>
            <img src={getStatusIcon(booking.status)} alt='' className='w-4 h-4' />
          </div>
        </div>
        
        <div className='flex-1 min-w-0'>
          <h3 className='font-bold text-gray-900 truncate text-lg'>
            {booking.car?.brand} {booking.car?.model}
          </h3>
          <div className='flex items-center gap-2 mt-2'>
            <img src={assets.calendar_icon_colored} alt='' className='w-4 h-4' />
            <p className='text-sm text-gray-600 font-medium'>
              {new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}
            </p>
          </div>
          <div className='flex items-center gap-2 mt-2'>
            <img src={assets.location_icon_colored} alt='' className='w-4 h-4' />
            <p className='text-sm text-gray-600 font-medium'>{booking.car?.location}</p>
          </div>
        </div>
        
        <div className='text-right'>
          <span className={`text-xs px-4 py-2 rounded-full border ${getStatusColor(booking.status)} font-semibold`}>
            {booking.status || 'pending'}
          </span>
          <p className='text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mt-2'>{currency}{booking.price || 0}</p>
        </div>
      </div>
    </div>
  )
}

const UserDashboard = () => {
  const { user, axios, currency } = useAppContext();
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('browse-cars')
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [selectedStatCard, setSelectedStatCard] = useState(null)

  const confirmedCount = useMemo(() => bookings.filter(b => b.status === 'confirmed').length, [bookings])
  const pendingCount = useMemo(() => bookings.filter(b => b.status === 'pending').length, [bookings])
  const totalSpent = useMemo(() => bookings.reduce((sum, b) => sum + (b.price || 0), 0), [bookings])

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/booking/user-bookings')
      if (data.success) {
        setBookings(data.bookings || [])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = (updatedData) => {
    // Update user data in context (you'll need to implement this)
    // You can call your API here to update the user profile
  }

  useEffect(() => {
    if (user) fetchMyBookings()
  }, [user])

  const recent = bookings.slice(0, 3)

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50'>
      {/* Main Dashboard Layout - No padding, sidebar sticks to top-left */}
      <div className='flex'>
        {/* Left Sidebar - Sticks to top-left */}
        <div className='w-80 flex-shrink-0'>
          <Sidebar 
            user={user} 
            assets={assets} 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
            onEditProfile={() => setShowProfileEdit(true)}
            bookings={bookings}
            totalSpent={totalSpent}
            currency={currency}
          />
        </div>

        {/* Main Content Area */}
        <div className='flex-1 px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 pt-20 pb-12'>
          {/* Header */}
          <div className='mb-8 text-center'>
            <h1 className='text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4'>
              User Dashboard
            </h1>
            <p className='text-gray-600 text-xl'>Your car rental journey at a glance</p>
          </div>

          {/* Main Content Area */}
          <div className='flex-1'>
            {/* Stats Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
              <StatCard 
                label='Total Bookings' 
                value={bookings.length} 
                icon={assets.listIconColored} 
                color='blue'
                onClick={() => setSelectedStatCard({ type: 'total-bookings', label: 'Total Bookings', bookings: bookings })}
              />
              <StatCard 
                label='Confirmed' 
                value={confirmedCount} 
                icon={assets.check_icon} 
                color='green'
                onClick={() => setSelectedStatCard({ type: 'confirmed', label: 'Confirmed Bookings', bookings: bookings.filter(b => b.status === 'confirmed') })}
              />
              <StatCard 
                label='Pending' 
                value={pendingCount} 
                icon={assets.cautionIconColored} 
                color='yellow'
                onClick={() => setSelectedStatCard({ type: 'pending', label: 'Pending Bookings', bookings: bookings.filter(b => b.status === 'pending') })}
              />
              <StatCard 
                label='Total Spent' 
                value={`${currency}${totalSpent.toLocaleString()}`} 
                icon={assets.dashboardIconColored} 
                color='purple'
                onClick={() => setSelectedStatCard({ type: 'total-spent', label: 'Total Spent', bookings: bookings })}
              />
            </div>

            {/* Recent Bookings Section */}
            <div className='bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-8'>
              <div className='flex items-center justify-between mb-8'>
                <div>
                  <h3 className='text-xl font-bold text-gray-900 mb-2'>Recent Bookings</h3>
                  <p className='text-gray-600'>Your latest car rental activities</p>
                </div>
                <a 
                  href='/my-bookings' 
                  className='px-6 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 text-sm font-semibold flex items-center gap-2 border border-blue-200 shadow-lg hover:shadow-xl hover:-translate-y-1'
                >
                  View all
                  <img src={assets.arrow_icon} alt='' className='w-4 h-4' />
                </a>
              </div>

              <div className='space-y-6'>
                {loading && (
                  <div className='flex items-center justify-center py-16'>
                    <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600'></div>
                    <span className='ml-4 text-gray-600 text-lg'>Loading your bookings...</span>
                  </div>
                )}

                {!loading && recent.length === 0 && (
                  <div className='text-center py-16'>
                    <div className='w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg'>
                      <img src={assets.carIconColored} alt='' className='w-10 h-10 opacity-50' />
                    </div>
                    <h3 className='text-gray-900 font-bold text-lg mb-3'>No bookings yet</h3>
                    <p className='text-gray-600 mb-6 max-w-md mx-auto'>Start your car rental journey by exploring our available vehicles and make your first booking</p>
                    <a 
                      href='/cars' 
                      className='inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1'
                    >
                      <img src={assets.carIconColored} alt='' className='w-5 h-5 brightness-0 invert' />
                      Browse Cars
                    </a>
                  </div>
                )}

                {!loading && recent.map((booking, i) => (
                  <BookingCard 
                    key={booking._id || i} 
                    booking={booking} 
                    currency={currency} 
                    assets={assets} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Modal */}
        <ProfileEditModal
          isOpen={showProfileEdit}
          onClose={() => setShowProfileEdit(false)}
          user={user}
          onUpdate={handleProfileUpdate}
          assets={assets}
        />

                 {/* Stats Detail Modal */}
         {selectedStatCard && (
           <StatsDetailModal
             isOpen={!!selectedStatCard}
             onClose={() => setSelectedStatCard(null)}
             cardData={selectedStatCard}
             bookings={bookings}
             currency={currency}
             assets={assets}
           />
         )}
      </div>
    </div>
  )
}

export default UserDashboard


