import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { UserPlus } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from '../features/user/userSlice'
import toast from 'react-hot-toast'

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([])
  const { getToken } = useAuth()
  const currentUser = useSelector((state) => state.user.value)
  const dispatch = useDispatch()

  const fetchSuggestions = async () => {
    try {
      const token = await getToken()
      const { data } = await api.get('/api/user/suggestions', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setSuggestions(data.users || [])
      }
    } catch (error) {
      // Silently fail if endpoint doesn't exist
      console.log('Suggestions endpoint not available')
    }
  }

  const handleFollow = async (userId) => {
    try {
      const { data } = await api.post('/api/user/follow', { id: userId }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        toast.success(data.message)
        dispatch(fetchUser(await getToken()))
        fetchSuggestions()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchSuggestions()
  }, [])

  if (suggestions.length === 0) return null

  return (
    <div className='bg-white max-w-xs mt-4 p-4 rounded-lg shadow'>
      <h3 className='font-semibold text-slate-800 mb-4'>Suggestions</h3>
      <div className='flex flex-col gap-3'>
        {suggestions.slice(0, 3).map((user) => (
          <div key={user._id} className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <img src={user.profile_picture} alt={user.full_name} className='w-10 h-10 rounded-full object-cover'/>
              <div>
                <p className='text-sm font-medium text-slate-800'>{user.full_name}</p>
                <p className='text-xs text-gray-500'>@{user.username}</p>
              </div>
            </div>
            <button
              onClick={() => handleFollow(user._id)}
              disabled={currentUser?.following?.includes(user._id)}
              className='px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-300 hover:border-indigo-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {currentUser?.following?.includes(user._id) ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
        <a href='/discover' className='text-xs text-indigo-600 hover:text-indigo-700 text-center mt-2'>See all</a>
      </div>
    </div>
  )
}

export default Suggestions


