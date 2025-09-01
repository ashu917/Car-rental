import React from 'react'
import { assets } from '../assets/assets'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const { requireAuth } = useAuth()
  const navigate = useNavigate()
  
  const handleListCar = () => {
    if (!requireAuth('list your car')) return;
    navigate('/owner/add-car')
  }
  
  return (
    <div className="flex flex-col md:flex-row md:items-start items-center justify-between px-8 md:pl-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 max-w-6xl md:mx-auto rounded-3xl overflow-hidden shadow-2xl relative">
      
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-blue-600/20"></div>
      
      {/* Content */}
      <div className="text-white md:max-w-md relative z-10 py-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">Do You Own a Luxury Car?</h2>
        <p className="mt-3 text-lg text-blue-100">Monetize your vehicle effortlessly by listing on CarRental.</p>
        <p className="mt-3 max-w-xs text-blue-50 leading-relaxed">
          We take care of insurance, driver verification, and secure payments — so you can earn passive income, stress-free.
        </p>
        <button onClick={handleListCar} className="px-8 py-3 bg-white hover:bg-gray-50 transition-all duration-300 text-indigo-600 rounded-xl text-sm mt-6 cursor-pointer font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1">
          List your car
        </button>
      </div>

      <img
        src={assets.banner_car_image}
        alt="car"
        className="max-h-45 mt-10 md:mt-0 relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
      />
    </div>
  )
}

export default Banner
