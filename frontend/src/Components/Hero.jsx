import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets' 
import { useAppContext } from './Context/AppContext'
import { useAuth } from '../hooks/useAuth'

// const cityList = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Noida']

const Hero = () => {
    const [pickpLocation,setPickupLocation]=useState('')

    const{pickpDate, setPickupDate, returnDate, setReturnDate}=useAppContext()
    const navigate = useNavigate()
    const { requireAuth } = useAuth()
    
    const handleSearch=(e)=>{
        e.preventDefault();
        navigate('/cars? pickpLocation ='+ pickpLocation +`$pickupDate=` +setPickupDate +`$returnDate=`+ returnDate)
    }
  return (
    <div className='h-screen flex flex-col items-center justify-center gap-14 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-center relative overflow-hidden'>
      {/* Background overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-700/20'></div>
      
      {/* Content */}
      <div className='relative z-10'>
        <h1 className='text-4xl md:text-5xl font-bold text-white mb-8 drop-shadow-lg'>
          Luxury cars on Rent
        </h1>

        <form onSubmit={handleSearch} className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-2xl md:rounded-full w-full max-w-80 md:max-w-4xl bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2'>
          <div className='flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8'>
            <div className=' flex flex-col items-start gap-2'>
              <input 
                type="text"
                placeholder="Pickup Location"
                required 
                className='outline-none border border-gray-200 rounded-lg px-3 py-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent' 
                value={pickpLocation} 
                onChange={(e)=>setPickupLocation(e.target.value)}
              />
              <p className='px-1 text-sm text-gray-500'>{pickpLocation ? pickpLocation :'Please enter location'}</p>
            </div>

            {/* /* // for picUpDate */ }
            <div className='flex flex-col items-start gap-2'>
                   <label htmlFor='picup-date' className='text-gray-700 font-medium'>Pic-up-Date</label>
                   <input value={pickpDate} onChange={e=>setPickupDate(e.target.value)} type='date' id='picup-date' min={new Date().toISOString().split('T')[0]} className='text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent' required/>
            </div>
             <div className='flex flex-col items-start gap-2'>
                   <label htmlFor='return-date' className='text-gray-700 font-medium'>Return-Date</label>
                   <input  value={returnDate} onChange={e=>setReturnDate(e.target.value)}  type='date' id='return-date'  className='text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent' required/>
            </div>

          </div>
           <button  onClick={handleSearch}  type='button' className='flex items-center justify-center gap-2 px-8 py-3 max-sm:mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 font-medium' >
              <img src={assets.search_icon} alt='search'
                  className='brightness-300 w-5 h-5'
              />
              Search
            </button>
        </form>
      </div>
      
      <img src={assets.main_car} alt='car' className='max-h-74 relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500'/>
    </div>
  )
}

export default Hero