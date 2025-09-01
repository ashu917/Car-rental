import React, { useState } from 'react'
import { assets,  ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom'
import { useAppContext } from '../Context/AppContext'
import toast from 'react-hot-toast'

const Sidebar = () => {
    
  const {user, axios, fetchUser} =useAppContext()
  const location = useLocation()
  const [image, setImage] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)


  const updateImage = async () => {
    try {
      if (!image) {
        toast.error('Please select an image first');
        return;
      }

      setIsUpdating(true);
      
      const formData = new FormData()
      formData.append('image', image)

      const { data } = await axios.post('/api/owner/update-image', formData)
      
      if (data.success) {
        fetchUser()
        toast.success(data.message || 'Profile image updated successfully!')
        setImage(null)
      } else {
        toast.error(data.message || 'Failed to update profile image')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      console.error('Error response:', error.response?.data)
      toast.error(error.response?.data?.message || error.message || 'Failed to update profile image')
    } finally {
      setIsUpdating(false);
    }
  }

  return (
         <div className="relative h-full w-20 md:w-64 border-r border-gray-200 text-sm bg-white flex-shrink-0 overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Profile Section - Fixed at top */}
        <div className="flex flex-col items-center pt-8 pb-6 border-b border-gray-100">
          <div className="group relative">
            <label htmlFor="image">
                       <img
               src={image ? URL.createObjectURL(image) : user?.image || assets.user_profile}
               alt="profile"
               className="rounded-full w-24 h-24 object-cover border-4 border-white shadow-lg"
             />
            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  // Check file size (max 5MB)
                  if (file.size > 5 * 1024 * 1024) {
                    toast.error('Image size should be less than 5MB');
                    return;
                  }
                  // Check file type
                  if (!file.type.startsWith('image/')) {
                    toast.error('Please select a valid image file');
                    return;
                  }
                  setImage(file);
                }
              }}
            />

            <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer">
              <img src={assets.edit_icon} alt="edit icon" />
            </div>
          </label>
        </div>

               {image && (
           <div className="absolute top-16 right-0 flex gap-2">
             <button
               onClick={() => setImage(null)}
               className="flex p-2 gap-1 bg-red-100 text-red-600 cursor-pointer rounded-lg hover:bg-red-200"
             >
               Cancel
             </button>
             <button
               onClick={updateImage}
               disabled={isUpdating}
               className="flex p-2 gap-1 bg-indigo-100 text-indigo-600 cursor-pointer rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {isUpdating ? (
                 <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
               ) : (
                 <>
                   Save <img src={assets.check_icon} width={13} alt="check icon" />
                 </>
               )}
             </button>
           </div>
         )}

               <p className="mt-2 text-base max-md:hidden font-semibold text-gray-800">{user?.name}</p>
         <p className="text-xs text-gray-500 max-md:hidden">Car Owner</p>
        </div>

               {/* Navigation Menu - Fixed height, no scroll */}
         <div className="flex-1 py-4">
           {ownerMenuLinks.map((link, index) => (
             <NavLink
               key={index}
               to={link.path}
               className={`relative flex items-center gap-3 w-full py-3 pl-6 first:mt-0 ${
                 link.path === location.pathname
                   ? 'bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600'
                   : 'text-gray-600 hover:bg-gray-50'
               }`}
             >
               <img
                 src={
                   link.path === location.pathname ? link.coloredIcon : link.icon
                 }
                 alt={`${link.name} icon`}
                 className="w-5 h-5"
               />
               <span className="max-md:hidden font-medium">{link.name}</span>
               {link.path === location.pathname && (
                 <div className="bg-indigo-600 w-1.5 h-8 rounded-full right-0 absolute"></div>
               )}
             </NavLink>
           ))}
         </div>
      </div>
    </div>
  )
}

export default Sidebar

