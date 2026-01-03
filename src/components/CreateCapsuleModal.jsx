import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createCapsule } from '../features/capsules/capsuleSlice'
import { useAuth } from '@clerk/clerk-react'
import { X, Calendar, User, Users, Lock } from 'lucide-react'
import { useSelector } from 'react-redux'

const CreateCapsuleModal = ({ onClose, onSuccess }) => {
    const dispatch = useDispatch()
    const { getToken } = useAuth()
    const { connections } = useSelector(state => state.connections)
    const [formData, setFormData] = useState({
        content: '',
        unlockTime: '',
        recipientType: 'self',
        recipientId: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!formData.content.trim()) {
            return
        }

        if (!formData.unlockTime) {
            return
        }

        const unlockDate = new Date(formData.unlockTime)
        if (unlockDate <= new Date()) {
            return
        }

        setIsSubmitting(true)
        try {
            const token = await getToken()
            const capsuleData = {
                content: formData.content.trim(),
                unlockTime: unlockDate.toISOString(),
                recipientType: formData.recipientType,
                recipientId: formData.recipientType === 'self' ? undefined : formData.recipientId,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }

            await dispatch(createCapsule({ capsuleData, token })).unwrap()
            onSuccess()
        } catch (error) {
            console.error('Failed to create capsule:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const getMinDateTime = () => {
        const now = new Date()
        now.setMinutes(now.getMinutes() + 1)
        return now.toISOString().slice(0, 16)
    }

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto'>
                <div className='p-6 border-b border-gray-200'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-xl font-semibold text-gray-900'>Create Time Capsule</h2>
                        <button
                            onClick={onClose}
                            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                        >
                            <X className='w-5 h-5 text-gray-500' />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className='p-6 space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Message
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            placeholder='Write your message to the future...'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none'
                            rows={4}
                            maxLength={1000}
                        />
                        <p className='text-xs text-gray-500 mt-1'>
                            {formData.content.length}/1000 characters
                        </p>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            <Calendar className='w-4 h-4 inline mr-1' />
                            Unlock Time
                        </label>
                        <input
                            type='datetime-local'
                            value={formData.unlockTime}
                            onChange={(e) => setFormData(prev => ({ ...prev, unlockTime: e.target.value }))}
                            min={getMinDateTime()}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Recipient
                        </label>
                        <div className='space-y-2'>
                            <label className='flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'>
                                <input
                                    type='radio'
                                    name='recipientType'
                                    value='self'
                                    checked={formData.recipientType === 'self'}
                                    onChange={(e) => setFormData(prev => ({ ...prev, recipientType: e.target.value, recipientId: '' }))}
                                    className='mr-3'
                                />
                                <User className='w-4 h-4 mr-2 text-gray-600' />
                                <div>
                                    <div className='font-medium text-gray-900'>Myself</div>
                                    <div className='text-sm text-gray-500'>Only I can see this capsule</div>
                                </div>
                            </label>

                            <label className='flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'>
                                <input
                                    type='radio'
                                    name='recipientType'
                                    value='connection'
                                    checked={formData.recipientType === 'connection'}
                                    onChange={(e) => setFormData(prev => ({ ...prev, recipientType: e.target.value }))}
                                    className='mr-3'
                                />
                                <Users className='w-4 h-4 mr-2 text-gray-600' />
                                <div className='flex-1'>
                                    <div className='font-medium text-gray-900'>A Connection</div>
                                    <div className='text-sm text-gray-500'>Send to a specific person</div>
                                </div>
                            </label>

                            {formData.recipientType === 'connection' && (
                                <div className='ml-9'>
                                    <select
                                        value={formData.recipientId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, recipientId: e.target.value }))}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                        required
                                    >
                                        <option value=''>Select a connection</option>
                                        {connections?.map(connection => (
                                            <option key={connection._id} value={connection._id}>
                                                {connection.full_name} (@{connection.username})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg'>
                        <Lock className='w-4 h-4 text-amber-600' />
                        <p className='text-sm text-amber-800'>
                            This capsule will remain locked until the specified time. Only the intended recipient can view it when unlocked.
                        </p>
                    </div>

                    <div className='flex gap-3 pt-4'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={isSubmitting || !formData.content.trim() || !formData.unlockTime || (formData.recipientType === 'connection' && !formData.recipientId)}
                            className='flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                        >
                            {isSubmitting ? 'Creating...' : 'Create Capsule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateCapsuleModal
