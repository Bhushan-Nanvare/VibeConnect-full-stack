import React from 'react'

const MessageComfortIndicator = ({comfortLevel, variant = 'text', size = 'sm'}) => {
  
  if(!comfortLevel || comfortLevel === 'open') return null

  const sizeClass = size === 'xs' ? 'text-xs' : 'text-sm'
  
  if(variant === 'icon' || variant === 'dot') {
    return (
      <span className={`${sizeClass} text-gray-400`} title={`Messages: ${comfortLevel}`}>
        {comfortLevel === 'closed' ? '🔒' : '📬'}
      </span>
    )
  }

  return (
    <span className={`${sizeClass} text-gray-400 ml-2`}>
      {comfortLevel === 'selective' ? '📬 Selective' : '🔒 Closed'}
    </span>
  )
}

export default MessageComfortIndicator


