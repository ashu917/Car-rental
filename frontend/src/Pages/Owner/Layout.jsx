import React, { useEffect } from 'react'
import Sidebar from '../../Components/Owner/Sidebar'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { assets,  } from '../../assets/assets'
import { useAppContext } from '../../Components/Context/AppContext'

const Layout = () => {
 const {isOwner, user, authReady}=useAppContext()
 const navigate = useNavigate()

 useEffect(()=>{
  if(authReady && !isOwner){
    navigate('/')
  }
 },[authReady, isOwner])
 
 if(!authReady){
   return null
 }
  return (
    <div className='flex flex-col h-screen'>
       {/* Owner header: logo left, welcome right */}
       <div className='flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-700 border-b border-gray-200 bg-white shadow-sm flex-shrink-0'>
         <Link to='/' aria-label='Go to home' className='flex items-center'>
           <img src={assets.logo} alt='CarRental logo' className='h-8 cursor-pointer hover:scale-105 transition-transform duration-300' />
         </Link>
         <div className='flex items-center gap-4'>
           <p className='text-sm text-gray-600'>
             Welcome, <span className='font-semibold text-gray-800'>{user?.name || 'User'}</span>
           </p>
           <div className='w-2 h-2 bg-green-400 rounded-full'></div>
         </div>
       </div>
       <div className='flex flex-1 overflow-hidden'>
        <Sidebar/>
        <div className='flex-1 overflow-y-auto'>
          <Outlet/>
        </div>
       </div>
    </div>
  )
}

export default Layout
