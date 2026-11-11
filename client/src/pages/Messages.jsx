import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import moment from 'moment'
import Suggestions from '../components/Suggestions'
import Loading from '../components/Loading'

const Messages = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const { getToken, isSignedIn } = useAuth()
  const navigate = useNavigate()

  const fetchRecentMessages = async () => {
    try {
      setLoading(true)
      const token = await getToken()
      const { data } = await api.get('/api/user/recent-messages', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        // Group messages by sender and get the latest message for each sender
        const groupedMessages = data.messages.reduce((acc, message) => {
          const senderId = message.from_user_id._id;
          if (!acc[senderId] || new Date(message.createdAt) > new Date(acc[senderId].createdAt)) {
            acc[senderId] = message
          }
          return acc;
        }, {})

        // Count unread messages per sender
        const messagesWithUnreadCount = Object.values(groupedMessages).map(message => {
          const unreadCount = data.messages.filter(
            m => m.from_user_id._id === message.from_user_id._id && !m.seen
          ).length
          return { ...message, unreadCount }
        })

        // Sort messages by date
        const sortedMessages = messagesWithUnreadCount.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setMessages(sortedMessages)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (isSignedIn) {
      fetchRecentMessages()
      const interval = setInterval(fetchRecentMessages, 30000)
      return () => clearInterval(interval)
    }
  }, [isSignedIn])

  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-6 px-4'>
      <div className='max-w-7xl mx-auto flex gap-6'>
        {/* Center Messages - Similar to Feed */}
        <div className='flex-1 max-w-2xl mx-auto'>
          <h2 className='text-2xl font-bold text-slate-800 mb-6'>Messages</h2>
          <div className='space-y-4'>
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message._id}
                  onClick={() => navigate(`/messages/${message.from_user_id._id}`)}
                  className='bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition-all duration-200'
                >
                  <div className='flex items-start gap-4'>
                    {/* Profile Picture - Clickable to open profile */}
                    <img
                      src={message.from_user_id.profile_picture}
                      alt={message.from_user_id.full_name}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/profile/${message.from_user_id._id}`)
                      }}
                      className='w-12 h-12 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all'
                    />
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between mb-1'>
                        <div className='flex items-center gap-2'>
                          <h3 className='font-semibold text-slate-800'>{message.from_user_id.full_name}</h3>
                          {message.unreadCount > 0 && (
                            <span className='bg-indigo-500 text-white text-xs font-medium px-2 py-0.5 rounded-full'>
                              {message.unreadCount}
                            </span>
                          )}
                        </div>
                        <span className='text-xs text-gray-500'>{moment(message.createdAt).fromNow()}</span>
                      </div>
                      <p className='text-sm text-gray-600 truncate'>
                        {message.text ? message.text : message.message_type === 'image' ? '📷 Image' : 'Media'}
                      </p>
                      {/* Unread Without Guilt - Subtle state indicators */}
                      {!message.seen && message.message_state === 'unread' && (
                        <div className='mt-2 flex items-center gap-1'>
                          <span className='w-2 h-2 bg-indigo-500 rounded-full'></span>
                          <span className='text-xs text-indigo-600 font-medium'>Unread</span>
                        </div>
                      )}
                      {message.message_state === 'seen_not_ready' && (
                        <div className='mt-1'>
                          <span className='text-xs text-gray-400'>Seen</span>
                        </div>
                      )}
                      {message.message_state === 'will_reply_later' && (
                        <div className='mt-1'>
                          <span className='text-xs text-gray-400'>Will reply later</span>
                        </div>
                      )}
                      {message.message_state === 'no_reply_needed' && (
                        <div className='mt-1'>
                          <span className='text-xs text-gray-400'>No reply needed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='bg-white rounded-xl shadow p-8 text-center'>
                <p className='text-gray-500'>No messages yet. Start a conversation!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Suggestions (No Stories) */}
        <div className='hidden xl:block w-80 sticky top-6 h-fit'>
          <Suggestions />
        </div>
      </div>
    </div>
  ) : <Loading />
}

export default Messages
