import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const VerifyEmail = () => {
  const { token } = useParams()
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    api.post('/api/auth/verify-email', { token })
      .then(({ data }) => {
        if (data.success) {
          toast.success(data.message)
          signIn(data.token)
          navigate('/')
        } else {
          setMessage(data.message)
        }
      })
      .catch((error) => setMessage(error.response?.data?.message || error.message))
  }, [token])

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#B8E6D3] p-4'>
      <div className='bg-white rounded-xl shadow p-8 w-full max-w-md text-center'>
        <h2 className='text-xl font-bold text-gray-800 mb-4'>Email verification</h2>
        <p className='text-gray-600 mb-6'>{message}</p>
        <Link to='/' className='text-indigo-600 font-medium hover:underline'>Back to sign in</Link>
      </div>
    </div>
  )
}

export default VerifyEmail
