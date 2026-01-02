import React from 'react'

const EnergyModeBadge = ({energyMode, expiresAt, variant = 'badge', size = 'sm'}) => {
  
  if(!energyMode || energyMode === 'normal') return null

  // Check if temporary mode has expired
  if(expiresAt && new Date(expiresAt) < new Date()) return null

  const sizeClass = size === 'xs' ? 'text-xs' : 'text-sm'

  if(variant === 'dot') {
    const dotSize = size === 'xs' ? 'w-1.5 h-1.5' : 'w-2 h-2'
    return (
      <span 
        className={`${dotSize} rounded-full bg-purple-400 border-2 border-white absolute top-0 right-0`} 
        title={energyMode}
      ></span>
    )
  }

  if(variant === 'text') {
    return (
      <span className={`${sizeClass} text-purple-600`}>
        {energyMode}
      </span>
    )
  }

  return (
    <span className='text-xs bg-purple-100 text-purple-700 rounded-full px-2 py-0.5'>
      {energyMode}
    </span>
  )
}

export default EnergyModeBadge


