import React from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { UserPlus, MessageCircle, Heart, UserCheck, X } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import { dismissItem, markItemRead } from '../features/inbox/inboxSlice'
import api from '../api/axios'

const InboxItem = ({item}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { getToken } = useAuth()

  const handleClick = async () => {
    // Mark as read when clicked
    if (!item.read) {
      const token = await getToken()
      dispatch(markItemRead({itemId: item._id, token}))
    }

    // Navigate based on item type
    switch(item.item_type) {
      case 'connection_request':
      case 'connection_accepted':
        navigate(`/profile/${item.actor_id._id}`)
        break
      case 'message_state_update':
        navigate(`/messages/${item.actor_id._id}`)
        break
      case 'post_like':
      case 'post_comment':
      case 'mention':
        navigate(`/`)
        break
      case 'follow':
        navigate(`/profile/${item.actor_id._id}`)
        break
      default:
        break
    }
  }

  const handleDismiss = async (e) => {
    e.stopPropagation()
    const token = await getToken()
    dispatch(dismissItem({itemId: item._id, token}))
  }

  const getIcon = () => {
    switch(item.item_type) {
      case 'connection_request':
        return <UserPlus className="w-4 h-4 text-indigo-600" />
      case 'connection_accepted':
        return <UserCheck className="w-4 h-4 text-green-600" />
      case 'message_state_update':
        return <MessageCircle className="w-4 h-4 text-blue-600" />
      case 'post_like':
      case 'follow':
        return <Heart className="w-4 h-4 text-red-500" />
      default:
        return <MessageCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getText = () => {
    if (!item.actor_id) return 'Activity update'

    const actorName = item.actor_id.full_name || 'Someone'
    
    switch(item.item_type) {
      case 'connection_request':
        return `${actorName} sent you a connection request`
      case 'connection_accepted':
        return `${actorName} accepted your connection request`
      case 'message_state_update':
        if (item.metadata?.message_state) {
          const stateMap = {
            'will_reply_later': 'will reply later',
            'no_reply_needed': 'indicated no reply needed'
          }
          return `${actorName} ${stateMap[item.metadata.message_state] || 'read your message'}`
        }
        return `${actorName} read your message`
      case 'post_like':
        return `${actorName} liked your post`
      case 'follow':
        return `${actorName} started following you`
      default:
        return 'Activity update'
    }
  }

  return (
    <div 
      className={`bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition-all duration-200 relative ${!item.read ? 'border-l-4 border-indigo-500' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm text-slate-800 font-medium">{getText()}</p>
              <span className="text-xs text-gray-500 mt-1 block">
                {moment(item.createdAt).fromNow()}
              </span>
            </div>
            {item.actor_id && (
              <img 
                src={item.actor_id.profile_picture} 
                alt={item.actor_id.full_name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/profile/${item.actor_id._id}`)
                }}
              />
            )}
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InboxItem


