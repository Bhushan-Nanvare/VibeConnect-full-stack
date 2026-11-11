import React, { useState } from 'react'
import { BarChart3, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

const PollMessage = ({ message, currentUserId }) => {
  const getPollData = () => {
    if (message.poll_data) return message.poll_data;
    if (message.text) {
      try {
        return JSON.parse(message.text);
      } catch (e) {
        return { question: 'Poll', options: [] };
      }
    }
    return { question: 'Poll', options: [] };
  }

  const [pollData, setPollData] = useState(getPollData())
  const [hasVoted, setHasVoted] = useState(pollData.votes?.some(v => v.user_id === currentUserId) || false)
  const { getToken } = useAuth()

  const handleVote = async (optionIndex) => {
    if (hasVoted) return

    try {
      const token = await getToken()
      const updatedPoll = {
        ...pollData,
        votes: [
          ...(pollData.votes || []),
          { user_id: currentUserId, option_index: optionIndex, timestamp: new Date() }
        ]
      }

      // Update poll in message
      const { data } = await api.put(`/api/message/${message._id}/poll`, {
        poll_data: updatedPoll
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setPollData(updatedPoll)
        setHasVoted(true)
      }
    } catch (error) {
      toast.error('Failed to vote')
    }
  }

  const totalVotes = pollData.votes?.length || 0

  return (
    <div className='bg-white rounded-lg shadow p-4 max-w-sm'>
      <div className='flex items-center gap-2 mb-3'>
        <BarChart3 className='w-4 h-4 text-indigo-500'/>
        <span className='font-semibold text-slate-800'>Poll: {pollData.question}</span>
      </div>
      <div className='space-y-2'>
        {pollData.options?.map((option, index) => {
          const optionVotes = pollData.votes?.filter(v => v.option_index === index).length || 0
          const percentage = totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0
          const userVoted = pollData.votes?.some(v => v.user_id === currentUserId && v.option_index === index)

          return (
            <button
              key={index}
              onClick={() => handleVote(index)}
              disabled={hasVoted}
              className={`w-full text-left p-2 rounded-lg border-2 transition-all ${
                userVoted
                  ? 'border-indigo-500 bg-indigo-50'
                  : hasVoted
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer'
              }`}
            >
              <div className='flex items-center justify-between mb-1'>
                <span className='text-sm font-medium text-slate-700'>{option}</span>
                {hasVoted && (
                  <span className='text-xs text-gray-500'>{optionVotes} votes</span>
                )}
              </div>
              {hasVoted && (
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className='bg-indigo-500 h-2 rounded-full transition-all'
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
            </button>
          )
        })}
      </div>
      {totalVotes > 0 && (
        <p className='text-xs text-gray-500 mt-2'>{totalVotes} total votes</p>
      )}
    </div>
  )
}

export default PollMessage

