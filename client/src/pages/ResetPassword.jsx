import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/reset-password', { token, password })
      if (data.success) {
        toast.success(data.message)
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
    setLoading(false)
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#B8E6D3] p-4'>
      <form onSubmit={handleSubmit} className='bg-white rounded-xl shadow p-8 w-full max-w-md space-y-4'>
        <h2 className='text-xl font-bold text-gray-800'>Choose a new password</h2>
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='New password (min. 8 characters)'
          className='w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-indigo-500 transition' required />
        <button disabled={loading} className='w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer disabled:opacity-60'>
          {loading ? 'Please wait...' : 'Update password'}
        </button>
        <Link to='/' className='block text-center text-sm text-indigo-600 hover:underline'>Back to sign in</Link>
      </form>
    </div>
  )
}

export default ResetPassword
