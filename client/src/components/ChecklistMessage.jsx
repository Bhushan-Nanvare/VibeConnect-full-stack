import React, { useState } from 'react'
import { CheckSquare, Square } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const ChecklistMessage = ({ message, currentUserId }) => {
  const getChecklistData = () => {
    if (message.checklist_data) return message.checklist_data;
    if (message.text) {
      try {
        return JSON.parse(message.text);
      } catch (e) {
        return { title: 'Checklist', items: [] };
      }
    }
    return { title: 'Checklist', items: [] };
  }

  const [checklistData, setChecklistData] = useState(getChecklistData())
  const { getToken } = useAuth()

  const handleToggleItem = async (itemIndex) => {
    try {
      const token = await getToken()
      const updatedItems = checklistData.items.map((item, index) => 
        index === itemIndex 
          ? { ...item, completed: !item.completed, completed_by: !item.completed ? currentUserId : null }
          : item
      )

      const updatedChecklist = {
        ...checklistData,
        items: updatedItems
      }

      const { data } = await api.put(`/api/message/${message._id}/checklist`, {
        checklist_data: updatedChecklist
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setChecklistData(updatedChecklist)
      }
    } catch (error) {
      toast.error('Failed to update checklist')
    }
  }

  const completedCount = checklistData.items?.filter(item => item.completed).length || 0
  const totalCount = checklistData.items?.length || 0

  return (
    <div className='bg-white rounded-lg shadow p-4 max-w-sm'>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-2'>
          <CheckSquare className='w-4 h-4 text-indigo-500'/>
          <span className='font-semibold text-slate-800'>{checklistData.title || 'Shared Checklist'}</span>
        </div>
        <span className='text-xs text-gray-500'>{completedCount}/{totalCount}</span>
      </div>
      <div className='space-y-2'>
        {checklistData.items?.map((item, index) => (
          <div
            key={index}
            className='flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer'
            onClick={() => handleToggleItem(index)}
          >
            {item.completed ? (
              <CheckSquare className='w-5 h-5 text-indigo-500'/>
            ) : (
              <Square className='w-5 h-5 text-gray-400'/>
            )}
            <span className={`text-sm flex-1 ${item.completed ? 'line-through text-gray-500' : 'text-slate-700'}`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChecklistMessage

