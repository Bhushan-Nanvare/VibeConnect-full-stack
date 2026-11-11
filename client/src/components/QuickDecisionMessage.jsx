import React, { useState } from 'react'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

const QuickDecisionMessage = ({ message, currentUserId }) => {
  const getDecisionData = () => {
    if (message.decision_data) return message.decision_data;
    if (message.text) {
      try {
        return JSON.parse(message.text);
      } catch (e) {
        return { question: 'Quick Decision' };
      }
    }
    return { question: 'Quick Decision' };
  }

  const initialDecisionData = getDecisionData();
  const [decisionData, setDecisionData] = useState(initialDecisionData)
  const [userResponse, setUserResponse] = useState(
    initialDecisionData.responses?.find(r => r.user_id === currentUserId)?.response || null
  )
  const { getToken } = useAuth()

  const handleResponse = async (response) => {
    try {
      const token = await getToken()
      const existingResponses = decisionData.responses || []
      const userResponseIndex = existingResponses.findIndex(r => r.user_id === currentUserId)
      
      let updatedResponses
      if (userResponseIndex >= 0) {
        updatedResponses = existingResponses.map((r, index) => 
          index === userResponseIndex ? { ...r, response, timestamp: new Date() } : r
        )
      } else {
        updatedResponses = [...existingResponses, { user_id: currentUserId, response, timestamp: new Date() }]
      }

      const updatedDecision = {
        ...decisionData,
        responses: updatedResponses
      }

      const { data } = await api.put(`/api/message/${message._id}/decision`, {
        decision_data: updatedDecision
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setDecisionData(updatedDecision)
        setUserResponse(response)
      }
    } catch (error) {
      toast.error('Failed to submit response')
    }
  }

  const yesCount = decisionData.responses?.filter(r => r.response === 'yes').length || 0
  const noCount = decisionData.responses?.filter(r => r.response === 'no').length || 0
  const laterCount = decisionData.responses?.filter(r => r.response === 'later').length || 0

  return (
    <div className='bg-white rounded-lg shadow p-4 max-w-sm'>
      <div className='mb-3'>
        <span className='font-semibold text-slate-800'>{decisionData.question || 'Quick Decision'}</span>
      </div>
      <div className='flex gap-2 mb-3'>
        <button
          onClick={() => handleResponse('yes')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-2 transition-all ${
            userResponse === 'yes'
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-700'
          }`}
        >
          <CheckCircle2 className='w-4 h-4'/>
          <span className='text-sm font-medium'>Yes</span>
        </button>
        <button
          onClick={() => handleResponse('no')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-2 transition-all ${
            userResponse === 'no'
              ? 'border-red-500 bg-red-50 text-red-700'
              : 'border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700'
          }`}
        >
          <XCircle className='w-4 h-4'/>
          <span className='text-sm font-medium'>No</span>
        </button>
        <button
          onClick={() => handleResponse('later')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-2 transition-all ${
            userResponse === 'later'
              ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
              : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 text-gray-700'
          }`}
        >
          <Clock className='w-4 h-4'/>
          <span className='text-sm font-medium'>Later</span>
        </button>
      </div>
      {(yesCount > 0 || noCount > 0 || laterCount > 0) && (
        <div className='flex gap-4 text-xs text-gray-500 pt-2 border-t border-gray-200'>
          <span>✓ {yesCount}</span>
          <span>✗ {noCount}</span>
          <span>⏰ {laterCount}</span>
        </div>
      )}
    </div>
  )
}

export default QuickDecisionMessage

