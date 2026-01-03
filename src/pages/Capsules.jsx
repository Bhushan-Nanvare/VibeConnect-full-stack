import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCapsules, createCapsule, checkUnlockedCapsules } from '../features/capsules/capsuleSlice'
import { useAuth } from '@clerk/clerk-react'
import { Clock, Lock, Unlock, Plus, Calendar, User, Users } from 'lucide-react'
import CreateCapsuleModal from '../components/CreateCapsuleModal'
import CapsuleCard from '../components/CapsuleCard'

const Capsules = () => {
    const dispatch = useDispatch()
    const { getToken } = useAuth()
    const { capsules, loading } = useSelector(state => state.capsules)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        const loadCapsules = async () => {
            const token = await getToken()
            if (token) {
                dispatch(fetchCapsules(token))
                dispatch(checkUnlockedCapsules(token))
            }
        }
        loadCapsules()
    }, [dispatch, getToken])

    useEffect(() => {
        const interval = setInterval(async () => {
            const token = await getToken()
            if (token) {
                dispatch(checkUnlockedCapsules(token))
            }
        }, 60000)

        return () => clearInterval(interval)
    }, [dispatch, getToken])

    const filteredCapsules = capsules.filter(capsule => {
        if (filter === 'all') return true
        return capsule.status === filter
    })

    const lockedCapsules = filteredCapsules.filter(c => c.status === 'locked')
    const unlockedCapsules = filteredCapsules.filter(c => c.status === 'unlocked')

    return (
        <div className='max-w-4xl mx-auto p-4'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
                <div className='p-6 border-b border-gray-200'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center gap-3'>
                            <Clock className='w-6 h-6 text-indigo-600' />
                            <h1 className='text-2xl font-bold text-gray-900'>Time Capsules</h1>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className='flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                        >
                            <Plus className='w-4 h-4' />
                            Create Capsule
                        </button>
                    </div>

                    <div className='flex gap-2'>
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'all' 
                                    ? 'bg-indigo-100 text-indigo-700' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            All ({capsules.length})
                        </button>
                        <button
                            onClick={() => setFilter('locked')}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'locked' 
                                    ? 'bg-indigo-100 text-indigo-700' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            Locked ({lockedCapsules.length})
                        </button>
                        <button
                            onClick={() => setFilter('unlocked')}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'unlocked' 
                                    ? 'bg-indigo-100 text-indigo-700' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            Unlocked ({unlockedCapsules.length})
                        </button>
                    </div>
                </div>

                <div className='p-6'>
                    {loading ? (
                        <div className='text-center py-8'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto'></div>
                            <p className='mt-2 text-gray-500'>Loading capsules...</p>
                        </div>
                    ) : filteredCapsules.length === 0 ? (
                        <div className='text-center py-12'>
                            <Clock className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                            <h3 className='text-lg font-medium text-gray-900 mb-2'>
                                {filter === 'all' ? 'No capsules yet' : `No ${filter} capsules`}
                            </h3>
                            <p className='text-gray-500 mb-4'>
                                {filter === 'all' 
                                    ? 'Create your first time capsule to preserve memories for the future'
                                    : `You have no ${filter} capsules`
                                }
                            </p>
                            {filter === 'all' && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className='inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                                >
                                    <Plus className='w-4 h-4' />
                                    Create Your First Capsule
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            {lockedCapsules.length > 0 && (
                                <div>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <Lock className='w-4 h-4 text-gray-500' />
                                        <h3 className='text-sm font-medium text-gray-700'>Locked Capsules</h3>
                                    </div>
                                    <div className='space-y-3'>
                                        {lockedCapsules.map(capsule => (
                                            <CapsuleCard key={capsule._id} capsule={capsule} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {unlockedCapsules.length > 0 && (
                                <div>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <Unlock className='w-4 h-4 text-green-600' />
                                        <h3 className='text-sm font-medium text-green-700'>Unlocked Capsules</h3>
                                    </div>
                                    <div className='space-y-3'>
                                        {unlockedCapsules.map(capsule => (
                                            <CapsuleCard key={capsule._id} capsule={capsule} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showCreateModal && (
                <CreateCapsuleModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false)
                        const loadCapsules = async () => {
                            const token = await getToken()
                            if (token) {
                                dispatch(fetchCapsules(token))
                            }
                        }
                        loadCapsules()
                    }}
                />
            )}
        </div>
    )
}

export default Capsules
