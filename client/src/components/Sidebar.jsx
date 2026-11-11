import React from 'react'
import { assets, dummyUserData } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import MenuItems from './MenuItems'
import { CirclePlus, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSelector } from 'react-redux';

const Sidebar = ({sidebarOpen, setSidebarOpen}) => {

    const navigate = useNavigate()
    const user = useSelector((state) => state.user.value)
    const {signOut} = useAuth()

  return (
    <div className={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between max-sm:absolute top-0 bottom-0 z-20 ${sidebarOpen ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out`}>
      <div className='w-full'>
            {/* User Profile at Top */}
            <div className='flex flex-col items-center px-4 pt-6 pb-4'>
              {/* Circular colorful background with profile picture */}
              <div className='relative w-32 h-32 mb-4'>
                {/* Larger circular colorful background */}
                <div className='absolute inset-0 rounded-full bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 opacity-80 blur-sm'></div>
                <div className='absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400'></div>
                {/* Profile picture centered */}
                <img 
                  src={user.profile_picture} 
                  alt={user.full_name} 
                  className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full object-cover z-10 border-2 border-white shadow-md'
                />
              </div>
              {/* Name and Username */}
              <div className='text-center'>
                <h1 className='text-base font-bold text-gray-800 mb-1'>{user.full_name}</h1>
                <p className='text-sm text-gray-500'>@{user.username}</p>
              </div>
            </div>

            <hr className='border-gray-300 mb-4'/>

            <MenuItems setSidebarOpen={setSidebarOpen}/>

            <Link to='/create-post' className='flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg  bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer'>
                <CirclePlus className='w-5 h-5'/>
                Create Post
            </Link>
      </div>

        <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between'>
            <div onClick={()=> navigate('/profile')} className='flex gap-2 items-center cursor-pointer'>
                <img src={user.profile_picture} alt={user.full_name} className='w-8 h-8 rounded-full object-cover' />
                <div>
                    <h1 className='text-sm font-medium'>{user.full_name}</h1>
                    <p className='text-xs text-gray-500'>@{user.username}</p>
                </div>
            </div>
            <LogOut onClick={signOut} className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer'/>
        </div>

    </div>
  )
}

export default Sidebar
