import Capsule from '../models/Capsule.js';
import User from '../models/User.js';

export const createCapsule = async (req, res) => {
    try {
        const { content, unlockTime, recipientType, recipientId, timezone } = req.body;
        const userId = req.auth.userId;

        if (!content || !unlockTime || !recipientType) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const unlockDate = new Date(unlockTime);
        if (unlockDate <= new Date()) {
            return res.status(400).json({ success: false, message: 'Unlock time must be in the future' });
        }

        if (unlockDate > new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000)) {
            return res.status(400).json({ success: false, message: 'Unlock time cannot be more than 10 years in the future' });
        }

        if (recipientType === 'connection') {
            if (!recipientId) {
                return res.status(400).json({ success: false, message: 'Recipient ID required for connection capsules' });
            }

            if (recipientId === userId) {
                return res.status(400).json({ success: false, message: 'Cannot send capsule to yourself' });
            }

            const recipient = await User.findById(recipientId);
            if (!recipient) {
                return res.status(404).json({ success: false, message: 'Recipient not found' });
            }

            const currentUser = await User.findById(userId);
            if (!currentUser.connections.includes(recipientId)) {
                return res.status(403).json({ success: false, message: 'Can only send capsules to connections' });
            }

            if (recipient.interaction_style_badges?.includes('advanced_blocking')) {
                const isBlocked = recipient.blocked_users?.includes(userId);
                if (isBlocked) {
                    return res.status(403).json({ success: false, message: 'Cannot send capsule to this user' });
                }
            }

            if (recipient.message_comfort_level === 'closed') {
                return res.status(403).json({ success: false, message: 'Recipient is not accepting messages' });
            }
        }

        const capsule = new Capsule({
            author: userId,
            content: content.trim(),
            unlockTime: unlockDate,
            recipientType,
            recipientId: recipientType === 'self' ? undefined : recipientId,
            timezone: timezone || 'UTC'
        });

        await capsule.save();

        const populatedCapsule = await Capsule.findById(capsule._id)
            .populate('author', 'full_name username profile_picture')
            .populate('recipientId', 'full_name username profile_picture');

        res.status(201).json({ 
            success: true, 
            message: 'Capsule created successfully',
            capsule: populatedCapsule
        });

    } catch (error) {
        console.error('Error creating capsule:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getCapsules = async (req, res) => {
    try {
        const userId = req.auth.userId;

        const capsules = await Capsule.find({
            $or: [
                { author: userId },
                { recipientId: userId }
            ]
        })
        .populate('author', 'full_name username profile_picture')
        .populate('recipientId', 'full_name username profile_picture')
        .sort({ createdAt: -1 });

        const filteredCapsules = capsules.filter(capsule => {
            if (capsule.author._id.toString() === userId) {
                return true;
            }
            
            if (capsule.recipientId && capsule.recipientId._id.toString() === userId) {
                return ['unlocked', 'failed', 'blocked'].includes(capsule.status);
            }
            
            return false;
        });

        res.status(200).json({ 
            success: true, 
            capsules: filteredCapsules
        });

    } catch (error) {
        console.error('Error fetching capsules:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const checkUnlockedCapsules = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const now = new Date();

        const capsulesToUnlock = await Capsule.find({
            status: 'locked',
            unlockTime: { $lte: now },
            $or: [
                { author: userId },
                { recipientId: userId }
            ]
        });

        const unlockedCapsules = [];
        for (const capsule of capsulesToUnlock) {
            if (capsule.recipientId) {
                const recipient = await User.findById(capsule.recipientId);
                if (!recipient) {
                    capsule.status = 'failed';
                    await capsule.save();
                    continue;
                }

                if (recipient.interaction_style_badges?.includes('advanced_blocking')) {
                    const isBlocked = recipient.blocked_users?.includes(capsule.author);
                    if (isBlocked) {
                        capsule.status = 'blocked';
                        await capsule.save();
                        continue;
                    }
                }

                if (recipient.energy_mode === 'ghost' && recipient.energy_mode_expires_at > now) {
                    return;
                }
            }

            capsule.status = 'unlocked';
            await capsule.save();
            
            const populatedCapsule = await Capsule.findById(capsule._id)
                .populate('author', 'full_name username profile_picture')
                .populate('recipientId', 'full_name username profile_picture');
            
            unlockedCapsules.push(populatedCapsule);
        }

        res.status(200).json({ 
            success: true, 
            unlockedCapsules
        });

    } catch (error) {
        console.error('Error checking unlocked capsules:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
