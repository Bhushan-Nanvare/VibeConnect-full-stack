import React from 'react'
import { Lock, Unlock, Calendar, User, Users } from 'lucide-react'

const CapsuleCard = ({ capsule }) => {
    const isLocked = capsule.status === 'locked';
    const isFailed = capsule.status === 'failed';
    const isBlocked = capsule.status === 'blocked';
    const unlockDate = new Date(capsule.unlockTime);
    const now = new Date();
    
    const formatUnlockTime = (date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRecipientDisplay = () => {
        if (capsule.recipientType === 'self') {
            return {
                icon: User,
                text: 'Myself',
                color: 'text-blue-600'
            }
        } else if (capsule.recipientType === 'connection' && capsule.recipient) {
            return {
                icon: Users,
                text: capsule.recipient.full_name,
                color: 'text-purple-600'
            }
        }
        return {
            icon: User,
            text: 'Unknown',
            color: 'text-gray-600'
        }
    };

    const getStatusDisplay = () => {
        if (isLocked) {
            return {
                icon: Lock,
                text: 'Locked',
                color: 'text-gray-600'
            }
        } else if (isFailed) {
            return {
                icon: Lock,
                text: 'Failed',
                color: 'text-red-600'
            }
        } else if (isBlocked) {
            return {
                icon: Lock,
                text: 'Blocked',
                color: 'text-red-600'
            }
        } else {
            return {
                icon: Unlock,
                text: 'Unlocked',
                color: 'text-green-600'
            }
        }
    };

    const recipientInfo = getRecipientDisplay();
    const statusInfo = getStatusDisplay();
    const RecipientIcon = recipientInfo.icon;
    const StatusIcon = statusInfo.icon;

    return (
        <div className={`border rounded-lg p-4 transition-all ${
            isLocked 
                ? 'border-gray-200 bg-gray-50 opacity-75' 
                : isFailed || isBlocked
                ? 'border-red-200 bg-red-50 opacity-75'
                : 'border-green-200 bg-green-50'
        }`}>
            <div className='flex items-start justify-between mb-3'>
                <div className='flex items-center gap-2'>
                    <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                    <span className={`text-sm font-medium ${statusInfo.color}`}>
                        {statusInfo.text}
                    </span>
                </div>
                
                <div className='flex items-center gap-1 text-xs text-gray-500'>
                    <RecipientIcon className={`w-3 h-3 ${recipientInfo.color}`} />
                    <span className={recipientInfo.color}>{recipientInfo.text}</span>
                </div>
            </div>

            <div className='mb-3'>
                {isLocked ? (
                    <div className='text-gray-500 italic'>
                        <div className='flex items-center gap-2 mb-1'>
                            <div className='w-2 h-2 bg-gray-400 rounded-full'></div>
                            <span className='text-sm'>Content locked until</span>
                        </div>
                        <div className='text-sm font-medium text-gray-600'>
                            {formatUnlockTime(unlockDate)}
                        </div>
                    </div>
                ) : isFailed ? (
                    <div className='text-red-600 italic text-sm'>
                        Could not deliver - recipient account no longer exists
                    </div>
                ) : isBlocked ? (
                    <div className='text-red-600 italic text-sm'>
                        Could not deliver - delivery blocked by recipient preferences
                    </div>
                ) : (
                    <div className='text-gray-900'>
                        <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                            {capsule.content}
                        </p>
                    </div>
                )}
            </div>

            <div className='flex items-center justify-between text-xs text-gray-500'>
                <div className='flex items-center gap-1'>
                    <Calendar className='w-3 h-3' />
                    <span>
                        Created {new Date(capsule.createdAt).toLocaleDateString()}
                    </span>
                </div>
                
                {isLocked && (
                    <div className='text-gray-400'>
                        {unlockDate > now ? (
                            <span>
                                Opens in {Math.ceil((unlockDate - now) / (1000 * 60 * 60 * 24))} days
                            </span>
                        ) : (
                            <span className='text-green-600 font-medium'>
                                Ready to unlock
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CapsuleCard
