import React from 'react'
import { assets } from '../assets/assets'
import { SignIn } from '@clerk/clerk-react'
import { ChevronDown } from 'lucide-react'

const Login = () => {
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

        {/* Clerk SignIn Component */}
        <div className='w-full max-w-md'>
          <SignIn />
        </div>
      </div>
    </div>
  )
}

export default Login
