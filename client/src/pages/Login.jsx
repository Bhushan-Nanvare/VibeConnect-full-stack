import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const content = {
  login: { title: 'Welcome back', subtitle: 'Sign in to continue to VibeConnect', button: 'Sign in', endpoint: 'login' },
  register: { title: 'Create your account', subtitle: 'Join VibeConnect in a few seconds', button: 'Sign up', endpoint: 'register' },
  forgot: { title: 'Forgot password?', subtitle: "Enter your email and we'll send you a reset link", button: 'Send reset link', endpoint: 'forgot-password' },
}

const inputClass = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-indigo-500 transition'

const Login = () => {
  const { signIn } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post(`/api/auth/${content[mode].endpoint}`, form)
      if (data.success) {
        if (data.token) {
          signIn(data.token)
        } else {
          toast.success(data.message)
          setMode('login')
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
    setLoading(false)
  }

  return (
    <div className='min-h-screen flex flex-col md:flex-row relative overflow-hidden bg-[#B8E6D3]'>
      {/* Background Pattern - Behind everything */}
      <div className='absolute inset-0 opacity-20 z-0'>
        <div className='absolute top-20 left-10 w-32 h-32 bg-white/30 rounded-lg rotate-12'></div>
        <div className='absolute top-40 right-20 w-24 h-24 bg-white/30 rounded-lg -rotate-12'></div>
        <div className='absolute bottom-32 left-1/4 w-28 h-28 bg-white/30 rounded-lg rotate-45'></div>
        <div className='absolute bottom-20 right-1/3 w-20 h-20 bg-white/30 rounded-lg -rotate-45'></div>
      </div>

      {/* Left Column - Promotional Section */}
      <div className='flex-1 flex flex-col items-start justify-between p-8 md:p-12 lg:p-16 relative z-20'>
        {/* Logo */}
        <div className='flex items-center gap-2 mb-8 relative z-30'>
          <img src={assets.logo} alt="logo" className='h-10 w-auto object-contain'/>
        </div>

        {/* Promotional Text */}
        <div className='text-white mb-8 max-w-2xl relative z-30'>
          <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4 transition-all duration-300 hover:scale-105 hover:opacity-90 cursor-default'>
            Share your thoughts, moments, and stories with a growing community
          </h1>
          <p className='text-base md:text-lg lg:text-xl text-white/90 leading-relaxed transition-all duration-300 hover:opacity-100 hover:translate-x-1 cursor-default'>
            A calm, private space to connect, share, and discover — designed for meaningful conversations.
          </p>
        </div>

        {/* 3D Shapes Container */}
        <div className='flex-1 w-full relative flex items-center justify-center z-10'>
          {/* Abstract 3D Shapes */}
          <div className='relative w-full h-full max-w-md'>
            {/* Large curved arc - pink/peach */}
            <div className='absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full opacity-80 shadow-lg transform rotate-12'></div>
            
            {/* Metallic rose-gold cylinder */}
            <div className='absolute top-20 right-20 w-16 h-24 bg-gradient-to-b from-amber-400 to-rose-500 rounded-full opacity-90 shadow-lg transform -rotate-12'></div>
            
            {/* Transparent blue/teal prism */}
            <div className='absolute top-32 left-1/3 w-20 h-20 bg-gradient-to-br from-cyan-300/60 to-teal-300/60 backdrop-blur-sm transform rotate-45 shadow-lg border border-white/30'></div>
            
            {/* Clear glass cylinder */}
            <div className='absolute bottom-32 left-20 w-12 h-32 bg-gradient-to-b from-white/40 to-white/20 rounded-full backdrop-blur-sm shadow-lg border border-white/30'></div>
            
            {/* Light blue/teal cylinder */}
            <div className='absolute bottom-20 right-1/4 w-14 h-20 bg-gradient-to-b from-cyan-200 to-teal-300 rounded-full opacity-80 shadow-lg transform rotate-12'></div>
            
            {/* White textured sphere */}
            <div className='absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full shadow-xl transform -translate-x-1/2 -translate-y-1/2'>
              <div className='absolute top-1/2 left-0 w-full h-0.5 bg-gray-300'></div>
            </div>
            
            {/* Metallic silver/grey rectangular prism */}
            <div className='absolute bottom-10 right-10 w-20 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg opacity-90 shadow-lg transform -rotate-12'></div>
          </div>
        </div>
      </div>

      {/* Right Column - Form Section */}
      <div className='flex-1 bg-white flex flex-col items-center justify-center p-8 md:p-12 lg:p-16 relative z-10'>
        {/* Language Selector */}
        <div className='absolute top-6 right-6 md:top-8 md:right-8'>
          <div className='flex items-center gap-2 text-gray-600 cursor-pointer hover:text-gray-800'>
            <span className='text-sm font-medium'>English (UK)</span>
            <ChevronDown className='w-4 h-4' />
          </div>
        </div>

        <div className='w-full max-w-md'>
          <h2 className='text-2xl font-bold text-gray-800 mb-1'>{content[mode].title}</h2>
          <p className='text-sm text-gray-500 mb-6'>{content[mode].subtitle}</p>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {mode === 'register' && (
              <input name='full_name' value={form.full_name} onChange={handleChange} placeholder='Full name' className={inputClass} required />
            )}
            <input type='email' name='email' value={form.email} onChange={handleChange} placeholder='Email' className={inputClass} required />
            {mode !== 'forgot' && (
              <input type='password' name='password' value={form.password} onChange={handleChange} placeholder='Password' className={inputClass} required />
            )}
            {mode === 'login' && (
              <p onClick={() => setMode('forgot')} className='text-right text-sm text-indigo-600 hover:underline cursor-pointer'>Forgot password?</p>
            )}
            <button disabled={loading} className='w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer disabled:opacity-60'>
              {loading ? 'Please wait...' : content[mode].button}
            </button>
          </form>

          <p className='text-sm text-center text-gray-600 mt-6'>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className='text-indigo-600 font-medium hover:underline cursor-pointer'>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
