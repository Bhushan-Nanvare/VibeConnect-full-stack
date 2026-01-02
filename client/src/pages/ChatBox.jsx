import React, { useEffect, useRef, useState } from 'react'
import { dummyMessagesData, dummyUserData } from '../assets/assets'
import { ImageIcon, SendHorizonal, Plus } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import api from '../api/axios'
import { addMessage, fetchMessages, resetMessages, setMessages } from '../features/messages/messagesSlice'
import toast from 'react-hot-toast'
import ConversationTools from '../components/ConversationTools'
import PollMessage from '../components/PollMessage'
import ChecklistMessage from '../components/ChecklistMessage'
import QuickDecisionMessage from '../components/QuickDecisionMessage'
import EnergyModeBadge from '../components/EnergyModeBadge'
import MessageComfortIndicator from '../components/MessageComfortIndicator'

const ChatBox = () => {

  const {messages} = useSelector((state)=>state.messages)
  const { userId } = useParams()
  const { getToken } = useAuth()
  const dispatch = useDispatch()

  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [user, setUser] = useState(null)
  const [showTools, setShowTools] = useState(false)
  const messagesEndRef = useRef(null)
  const { user: currentUser } = useUser()

  const connections = useSelector((state) => state.connections.connections)

  const fetchUserMessages = async () => {
    try {
      const token = await getToken()
      dispatch(fetchMessages({token, userId}))
    } catch (error) {
      toast.error(error.message)
    }
  }

  const sendMessage = async (messageType = 'text', customText = null) => {
    try {
      const messageText = customText !== null ? customText : text
      if(!messageText && !image && messageType === 'text') return

      const token = await getToken()
      const formData = new FormData();
      formData.append('to_user_id', userId)
      formData.append('text', messageText || '');
      formData.append('message_type', messageType);
      image && formData.append('image', image);

      const { data } = await api.post('/api/message/send', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setText('')
        setImage(null)
        setShowTools(false)
        dispatch(addMessage(data.message))
      }else{
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleToolSend = (toolType, toolData) => {
    sendMessage(toolType, toolData)
  }

  // Unread Without Guilt - Update message state (zero-typing interaction)
  const updateMessageState = async (messageId, newState) => {
    try {
      const token = await getToken()
      const { data } = await api.put(`/api/message/${messageId}/state`, 
        { message_state: newState },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        // Update message in local state
        dispatch(setMessages(messages.map(msg => 
          msg._id === messageId ? {...msg, message_state: newState, seen: newState !== 'unread'} : msg
        )))
      }
    } catch (error) {
      // Silent fail - don't show errors for this subtle feature
    }
  }

  // Handle tap/long-press for quick state selection
  const [longPressTimer, setLongPressTimer] = useState(null)
  const [showStateMenu, setShowStateMenu] = useState(null)

  const handleMessagePress = (message, isIncoming) => {
    if (!isIncoming || message.message_state === 'unread') return

    // Single tap - cycle through states: seen_not_ready -> will_reply_later -> no_reply_needed -> seen_not_ready
    const stateCycle = {
      'seen_not_ready': 'will_reply_later',
      'will_reply_later': 'no_reply_needed',
      'no_reply_needed': 'seen_not_ready'
    }
    const nextState = stateCycle[message.message_state] || 'seen_not_ready'
    updateMessageState(message._id, nextState)
  }

  const handleMessageLongPressStart = (messageId) => {
    const timer = setTimeout(() => {
      setShowStateMenu(messageId)
    }, 500)
    setLongPressTimer(timer)
  }

  const handleMessageLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }

  useEffect(()=>{
    fetchUserMessages()

    return ()=>{
      dispatch(resetMessages())
    }
  },[userId])

  useEffect(()=>{
    if(connections.length > 0){
      const user = connections.find(connection => connection._id === userId)
      setUser(user)
    }
  },[connections, userId])

  useEffect(()=>{
    messagesEndRef.current?.scrollIntoView({behavior: "smooth" })
  },[messages])

  return user && (
    <div className='flex flex-col h-screen'>
      <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300'>
        <img src={user.profile_picture} alt="" className="size-8 rounded-full"/>
        <div className='flex-1'>
          <p className="font-medium">{user.full_name}</p>
          <div className="flex items-center gap-2 -mt-1.5">
            <p className="text-sm text-gray-500">@{user.username}</p>
            {user.energy_mode && user.energy_mode !== 'normal' && (
              <EnergyModeBadge energyMode={user.energy_mode} expiresAt={user.energy_mode_expires_at} variant='dot' size='xs' />
            )}
            <MessageComfortIndicator comfortLevel={user.message_comfort_level} variant='icon' size='xs' />
          </div>
        </div>
      </div>
      <div className='p-5 md:px-10 h-full overflow-y-scroll'>
        <div className='space-y-4 max-w-4xl mx-auto'>
          {
            messages.toSorted((a,b)=> new Date(a.createdAt) - new Date(b.createdAt)).map((message, index)=> {
              // Prepare message with parsed data if needed
              let poll_data = message.poll_data;
              let checklist_data = message.checklist_data;
              let decision_data = message.decision_data;

              if (!poll_data && message.message_type === 'poll' && message.text) {
                try {
                  poll_data = JSON.parse(message.text);
                } catch (e) {
                  poll_data = null;
                }
              }
              if (!checklist_data && message.message_type === 'checklist' && message.text) {
                try {
                  checklist_data = JSON.parse(message.text);
                } catch (e) {
                  checklist_data = null;
                }
              }
              if (!decision_data && message.message_type === 'decision' && message.text) {
                try {
                  decision_data = JSON.parse(message.text);
                } catch (e) {
                  decision_data = null;
                }
              }

              const messageWithData = {
                ...message,
                poll_data,
                checklist_data,
                decision_data
              }

              const isIncomingMessage = message.to_user_id === currentUser?.id
              
              return (
                <div key={index} className={`flex flex-col ${!isIncomingMessage ? 'items-start' : 'items-end'}`}>
                  {message.message_type === 'poll' ? (
                    <PollMessage message={messageWithData} currentUserId={currentUser?.id} />
                  ) : message.message_type === 'checklist' ? (
                    <ChecklistMessage message={messageWithData} currentUserId={currentUser?.id} />
                  ) : message.message_type === 'decision' ? (
                    <QuickDecisionMessage message={messageWithData} currentUserId={currentUser?.id} />
                  ) : (
                    <div 
                      className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow relative ${!isIncomingMessage ? 'rounded-bl-none' : 'rounded-br-none'} ${isIncomingMessage ? 'cursor-pointer' : ''}`}
                      onClick={() => isIncomingMessage && handleMessagePress(message, true)}
                      onMouseDown={() => isIncomingMessage && handleMessageLongPressStart(message._id)}
                      onMouseUp={handleMessageLongPressEnd}
                      onMouseLeave={handleMessageLongPressEnd}
                      onTouchStart={() => isIncomingMessage && handleMessageLongPressStart(message._id)}
                      onTouchEnd={handleMessageLongPressEnd}
                    >
                      {
                      message.message_type === 'image' && <img src={message.media_url} className='w-full max-w-sm rounded-lg mb-1' alt="" />
                      }
                      <p>{message.text}</p>
                      {/* Subtle state indicator - only for incoming messages */}
                      {isIncomingMessage && message.message_state && message.message_state !== 'unread' && (
                        <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 rounded-full bg-gray-400" 
                          title={message.message_state === 'seen_not_ready' ? 'Seen, not ready' : message.message_state === 'will_reply_later' ? 'Will reply later' : 'No reply needed'}
                        />
                      )}
                      {/* State menu for quick selection */}
                      {showStateMenu === message._id && isIncomingMessage && (
                        <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-1 z-10">
                          <button onClick={() => {updateMessageState(message._id, 'seen_not_ready'); setShowStateMenu(null)}} className="block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 rounded">Not ready</button>
                          <button onClick={() => {updateMessageState(message._id, 'will_reply_later'); setShowStateMenu(null)}} className="block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 rounded">Reply later</button>
                          <button onClick={() => {updateMessageState(message._id, 'no_reply_needed'); setShowStateMenu(null)}} className="block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 rounded">No reply</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          }
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className='px-4'>
        {showTools && (
          <div className='mb-4 flex justify-center'>
            <ConversationTools onClose={() => setShowTools(false)} onSend={handleToolSend} />
          </div>
        )}
        <div className='flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'>
          <button
            onClick={() => setShowTools(!showTools)}
            className='text-gray-400 hover:text-indigo-500 transition-colors'
          >
            <Plus className='size-6'/>
          </button>
          <input type="text" className='flex-1 outline-none text-slate-700' placeholder='Type a message...'
          onKeyDown={e=>e.key === 'Enter' && sendMessage()} onChange={(e)=>setText(e.target.value)} value={text} />

          <label htmlFor="image">
            {
              image 
              ? <img src={URL.createObjectURL(image)} alt="" className='h-8 rounded'/> 
              : <ImageIcon className='size-7 text-gray-400 cursor-pointer'/>
            }
            <input type="file" id='image' accept="image/*" hidden onChange={(e)=>setImage(e.target.files[0])}/>
          </label>

          <button onClick={() => sendMessage()} className='bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 cursor-pointer text-white p-2 rounded-full'>
            <SendHorizonal size={18}/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBox
