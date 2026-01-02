import React from 'react'

const RequestOpennessBadge = ({openness, variant = 'badge'}) => {
  
  if(!openness || openness === 'open') return null

  if(variant === 'text') {
    return (
      <p className='text-xs text-amber-600 mt-1'>
        {openness === 'connections_only' ? 'Accepting connections only' : 'Not accepting requests'}
      </p>
    )
  }

  return (
    <div className='mt-2 flex justify-center'>
      <span className='text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-1'>
        {openness === 'connections_only' ? '👋 Connections Only' : '🔒 Not Accepting'}
      </span>
    </div>
  )
}

export default RequestOpennessBadge


