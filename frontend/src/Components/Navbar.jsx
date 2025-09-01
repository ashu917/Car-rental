import React, { useState } from 'react';
import { assets, menuLinks } from '../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from './Context/AppContext';
import toast from 'react-hot-toast';
import Login from './Login';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {

  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext();
  const { requireAuth } = useAuth();

  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');



  const chnageRole = async () => {
    try {
      const { data } = await axios.get('/api/owner/change-role')
      if (data.success) {
        setIsOwner(true)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Something went wrong')
    }
  }


  return (
    <div
      className={`bg-gradient-to-r from-white/95 via-blue-50/95 to-indigo-50/95 backdrop-blur-xl border-b border-white/20 shadow-lg flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-700 relative transition-all duration-300 z-50`}
    >
      {/* Logo */}
      <Link to='/'>
        <img src={assets.logo} alt='logo' className='h-8 hover:scale-110 transition-transform duration-300' />
      </Link>

              {/* Menu links */}
        <div
          className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-r border-white/20 right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50
            ${location.pathname === '/' ? 'bg-gradient-to-b from-blue-50/90 to-indigo-50/90' : 'bg-gradient-to-b from-white/90 to-blue-50/90'}
            ${open ? 'max-sm:translate-x-0' : 'max-sm:translate-x-full'}
            backdrop-blur-md`}
        >
          {menuLinks.map((link, index) => {
            // Home and Cars links should be regular links, others need authentication
            if (link.path === '/' || link.path === '/cars') {
              return (
                <Link key={index} to={link.path} className="hover:text-indigo-600 transition-colors duration-300 font-medium">
                  {link.name}
                </Link>
              );
            } else {
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (!requireAuth(`access ${link.name.toLowerCase()}`)) return;
                    navigate(link.path);
                  }}
                  className="hover:text-indigo-600 transition-colors duration-300 font-medium text-left bg-transparent border-none cursor-pointer"
                >
                  {link.name}
                </button>
              );
            }
          })}

        {/* Search */}
        <div className='hidden lg:flex items-center text-sm gap-2 border border-white/30 px-3 rounded-full max-w-56 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300'>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { 
              if (e.key === 'Enter') {
                navigate(`/cars?q=${encodeURIComponent(searchQuery.trim())}`) 
              }
            }}
            className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500'
            placeholder='Search cars'
          />
          <button onClick={() => {
            navigate(`/cars?q=${encodeURIComponent(searchQuery.trim())}`)
          }}>
            <img src={assets.search_icon} alt='search' />
          </button>
        </div>

        {/* Dashboard and login */}
        <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
          {user?.role === 'owner' ? (
            <button
              onClick={() => {
                if (!requireAuth('access dashboard')) return;
                navigate('/owner')
              }}
              className='cursor-pointer hover:text-indigo-600 transition-colors duration-300 font-medium'
            >
              Dashboard
            </button>
          ) : (
            <button
              onClick={() => {
                if (user) {
                  // If user is logged in, go to dashboard
                  navigate('/dashboard')
                } else {
                  // If not logged in, show login toast
                  if (!requireAuth('list your car')) return;
                }
              }}
              className='cursor-pointer hover:text-indigo-600 transition-colors duration-300 font-medium'
            >
              {user ? 'Dashboard' : 'List cars'}
            </button>
          )}

          <button
            onClick={() => { user ? logout() : setShowLogin(true) }}
            className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 cursor-pointer px-8 py-2 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
          >
            {user ? 'Logout' : 'Login'}
          </button>
        </div>

      </div>

      {/* Mobile toggle button */}
      <button onClick={() => setOpen(!open)} className='sm:hidden hover:scale-110 transition-transform duration-300'>
        <img src={open ? assets.close_icon : assets.menu_icon} alt='menu toggle' />
      </button>
    </div>
  );
};

export default Navbar;





