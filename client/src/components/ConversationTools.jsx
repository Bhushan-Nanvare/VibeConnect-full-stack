import React, { useState } from 'react'
import { BarChart3, CheckSquare, MessageSquare, X } from 'lucide-react'

const ConversationTools = ({ onClose, onSend }) => {
  const [activeTool, setActiveTool] = useState(null)
  const [pollQuestion, setPollQuestion] = useState('')
  const [pollOptions, setPollOptions] = useState(['', ''])
  const [checklistTitle, setChecklistTitle] = useState('')
  const [checklistItems, setChecklistItems] = useState([''])
  const [decisionQuestion, setDecisionQuestion] = useState('')

  const handleAddPollOption = () => {
    setPollOptions([...pollOptions, ''])
  }

  const handleRemovePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index))
    }
  }

  const handleAddChecklistItem = () => {
    setChecklistItems([...checklistItems, ''])
  }

  const handleRemoveChecklistItem = (index) => {
    if (checklistItems.length > 1) {
      setChecklistItems(checklistItems.filter((_, i) => i !== index))
    }
  }

  const handleCreatePoll = () => {
    if (!pollQuestion || pollOptions.some(opt => !opt.trim())) {
      return
    }
    const pollData = {
      question: pollQuestion,
      options: pollOptions.filter(opt => opt.trim())
    }
    onSend('poll', JSON.stringify(pollData))
    setActiveTool(null)
    resetForms()
  }

  const handleCreateChecklist = () => {
    if (!checklistTitle || checklistItems.some(item => !item.trim())) {
      return
    }
    const checklistData = {
      title: checklistTitle,
      items: checklistItems.filter(item => item.trim()).map(item => ({
        text: item,
        completed: false
      }))
    }
    onSend('checklist', JSON.stringify(checklistData))
    setActiveTool(null)
    resetForms()
  }

  const handleCreateDecision = () => {
    if (!decisionQuestion.trim()) {
      return
    }
    const decisionData = {
      question: decisionQuestion
    }
    onSend('decision', JSON.stringify(decisionData))
    setActiveTool(null)
    resetForms()
  }

  const resetForms = () => {
    setPollQuestion('')
    setPollOptions(['', ''])
    setChecklistTitle('')
    setChecklistItems([''])
    setDecisionQuestion('')
  }

  if (!activeTool) {
    return (
      <div className='bg-white rounded-lg shadow-lg p-4 border border-gray-200'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='font-semibold text-slate-800'>Conversation Tools</h3>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600'>
            <X className='w-5 h-5'/>
          </button>
        </div>
        <div className='grid grid-cols-3 gap-3'>
          <button
            onClick={() => setActiveTool('poll')}
            className='flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all'
          >
            <BarChart3 className='w-6 h-6 text-indigo-500'/>
            <span className='text-sm font-medium text-slate-700'>Poll</span>
          </button>
          <button
            onClick={() => setActiveTool('checklist')}
            className='flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all'
          >
            <CheckSquare className='w-6 h-6 text-indigo-500'/>
            <span className='text-sm font-medium text-slate-700'>Checklist</span>
          </button>
          <button
            onClick={() => setActiveTool('decision')}
            className='flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all'
          >
            <MessageSquare className='w-6 h-6 text-indigo-500'/>
            <span className='text-sm font-medium text-slate-700'>Decision</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-md'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='font-semibold text-slate-800'>
          {activeTool === 'poll' && 'Create Poll'}
          {activeTool === 'checklist' && 'Create Checklist'}
          {activeTool === 'decision' && 'Quick Decision'}
        </h3>
        <button onClick={() => setActiveTool(null)} className='text-gray-400 hover:text-gray-600'>
          <X className='w-5 h-5'/>
        </button>
      </div>

      {activeTool === 'poll' && (
        <div className='space-y-3'>
          <input
            type='text'
            placeholder='Poll question...'
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
          <div className='space-y-2'>
            {pollOptions.map((option, index) => (
              <div key={index} className='flex gap-2'>
                <input
                  type='text'
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...pollOptions]
                    newOptions[index] = e.target.value
                    setPollOptions(newOptions)
                  }}
                  className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                />
                {pollOptions.length > 2 && (
                  <button
                    onClick={() => handleRemovePollOption(index)}
                    className='px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg'
                  >
                    <X className='w-4 h-4'/>
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddPollOption}
              className='w-full py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200'
            >
              + Add Option
            </button>
          </div>
          <button
            onClick={handleCreatePoll}
            className='w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium'
          >
            Create Poll
          </button>
        </div>
      )}

      {activeTool === 'checklist' && (
        <div className='space-y-3'>
          <input
            type='text'
            placeholder='Checklist title...'
            value={checklistTitle}
            onChange={(e) => setChecklistTitle(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
          <div className='space-y-2'>
            {checklistItems.map((item, index) => (
              <div key={index} className='flex gap-2'>
                <input
                  type='text'
                  placeholder={`Item ${index + 1}`}
                  value={item}
                  onChange={(e) => {
                    const newItems = [...checklistItems]
                    newItems[index] = e.target.value
                    setChecklistItems(newItems)
                  }}
                  className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                />
                {checklistItems.length > 1 && (
                  <button
                    onClick={() => handleRemoveChecklistItem(index)}
                    className='px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg'
                  >
                    <X className='w-4 h-4'/>
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddChecklistItem}
              className='w-full py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200'
            >
              + Add Item
            </button>
          </div>
          <button
            onClick={handleCreateChecklist}
            className='w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium'
          >
            Create Checklist
          </button>
        </div>
      )}

      {activeTool === 'decision' && (
        <div className='space-y-3'>
          <input
            type='text'
            placeholder='Decision question (e.g., "Should we meet tomorrow?")'
            value={decisionQuestion}
            onChange={(e) => setDecisionQuestion(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
          <button
            onClick={handleCreateDecision}
            className='w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium'
          >
            Create Decision
          </button>
        </div>
      )}
    </div>
  )
}

export default ConversationTools


