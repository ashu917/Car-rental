import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import CarCard from './CarCard'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from './Context/AppContext'
import { useAuth } from '../hooks/useAuth'

const FeaturedSection = () => {

    const navigate=useNavigate();
    const {cars}= useAppContext();
    const { requireAuth } = useAuth();
  return (
    <div className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50'>
      
      <div>
        <Title title='Featured Vehicles' subTitle='Explore our selection of premium vehicles availble for your next adventure'/>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18'>
     {
              cars.slice(0 ,6).map((car)=>(
            <div key={car._id}>
             <CarCard  car={car}/>

            </div>
        ))
     }
      </div>

      <button onClick={()=>{
        navigate('/cars'); scrollTo(0.0)
      }}
       className='flex items-center justify-center gap-2 px-8 py-3 border border-indigo-200 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white rounded-xl mt-18 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl bg-white/80 backdrop-blur-sm'>
      Explore all cars<img src={assets.arrow_icon} alt='arrow' className='w-5 h-5'/>

      </button>
    </div>
  )
}

export default FeaturedSection
