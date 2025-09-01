// src/VehicleCards.js
import React, { useCallback } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


const CarCard = ({car}) => {
  const currency=import.meta.env.VITE_CURRENCY
  const navigate=useNavigate()
  const { requireAuth } = useAuth()
  
  // Safety check: don't render if car is not available or is booked
  if (car.isAvailable === false || car.isBooked === true) {
    return null;
  }
  
  const handleCardClick = useCallback(() => {
    if (!requireAuth('view car details')) return;
    navigate(`/car-details/${car._id}`); 
    scrollTo(0,0)
  }, [requireAuth, navigate, car._id])
  
  return (
    <div onClick={handleCardClick}
     className="group rounded-2xl overflow-hidden bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-3">

      <div className=' relative h-48 overflow-hidden'>
        <img  src={car.image} alt='Car Image' className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'/>

        {car.isAvailable &&< p className=' absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg'  > Available Now </p>}
        
        {/* Price positioned at right-bottom of car image */}
        <div className='absolute bottom-4 right-4 bg-gradient-to-r from-black/70 to-gray-700/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-lg'>
          <span className='font-bold text-base'>{currency}{car.pricePerDay}</span>
          <span className='text-sm text-white/80 ml-1'>/day</span>
        </div>
      </div>


      <div className='p-5'>

      <div className='flex justify-between items-start mb-3'>
      <div>
        <h3 className='text-xl font-bold text-gray-800 mb-1'>{car.brand}  {car.model}</h3>
        <p className='text-gray-600 text-sm font-medium'>{car.category}.{car.year}</p>
      </div>
    </div>

      <div  className='mt-5 grid grid-cols-2 gap-y-3 text-gray-600'>
      <div className='flex items-center text-sm text-gray-700'>
        <img src={assets.users_icon} alt='' className='h-4 mr-2'/>
        <span className='font-medium'>{car.seating_capacity}  Seats</span>
      </div>

       <div className='flex items-center text-sm text-gray-700'>
        <img src={assets.fuel_icon} alt='' className='h-4 mr-2'/>
        <span className='font-medium'>{car.fuel_type}</span>
      </div>
       <div className='flex items-center text-sm text-gray-700'>
        <img src={assets.car_icon} alt='' className='h-4 mr-2'/>
        <span className='font-medium'>{car.transmission}</span>
      </div>
       <div className='flex items-center text-sm text-gray-700'>
        <img src={assets.location_icon} alt='' className='h-4 mr-2'/>
        <span className='font-medium'>{car.location}</span>
      </div>

      </div>

      </div>
    </div>
  );
};

export default React.memo(CarCard);
