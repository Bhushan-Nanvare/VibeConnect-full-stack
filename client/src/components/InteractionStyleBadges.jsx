import React from 'react'

const InteractionStyleBadges = ({badges, className = ''}) => {
  
  if(!badges || badges.length === 0) return null

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {badges.map((badge, idx) => (
        <span key={idx} className='text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-2.5 py-1'>
          {badge}
        </span>
      ))}
    </div>
  )
}

export default InteractionStyleBadges


