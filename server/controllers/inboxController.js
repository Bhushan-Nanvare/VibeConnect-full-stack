import InboxItem from '../models/Inbox.js';
import User from '../models/User.js';
import Message from '../models/Message.js';
import Connection from '../models/Connection.js';

// Get user's inbox items
export const getInboxItems = async (req, res) => {
    try {
        const { userId } = req;
        
        // Get non-dismissed items, ordered by relevance (unread first, then by time)
        const inboxItems = await InboxItem.find({
            user_id: userId,
            dismissed: false
        })
        .sort({ read: 1, createdAt: -1 })
        .limit(50);

        // Populate actor_id manually (since User._id is String, not ObjectId)
        const populatedItems = await Promise.all(inboxItems.map(async (item) => {
            const itemObj = item.toObject();
            if (itemObj.actor_id) {
                const actor = await User.findById(itemObj.actor_id).select('full_name username profile_picture');
                if (actor) {
                    itemObj.actor_id = actor;
                } else {
                    itemObj.actor_id = null;
                }
            }
            return itemObj;
        }));

        res.json({ success: true, items: populatedItems });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Mark inbox item as read
export const markInboxItemRead = async (req, res) => {
    try {
        const { userId } = req;
        const { itemId } = req.params;

        const item = await InboxItem.findOne({ _id: itemId, user_id: userId });
        if (!item) {
            return res.json({ success: false, message: 'Item not found' });
        }

        item.read = true;
        await item.save();

        res.json({ success: true, item });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Dismiss inbox item
export const dismissInboxItem = async (req, res) => {
    try {
        const { userId } = req;
        const { itemId } = req.params;

        const item = await InboxItem.findOne({ _id: itemId, user_id: userId });
        if (!item) {
            return res.json({ success: false, message: 'Item not found' });
        }

        item.dismissed = true;
        await item.save();

        res.json({ success: true, item });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Helper: Create inbox item (called from other controllers)
export const createInboxItem = async (userId, itemType, referenceId, referenceType, actorId, metadata = {}) => {
    try {
        // Check if similar item already exists (avoid duplicates)
        const existing = await InboxItem.findOne({
            user_id: userId,
            item_type: itemType,
            reference_id: referenceId,
            dismissed: false
        });

        if (existing) {
            // Update existing item timestamp
            existing.createdAt = new Date();
            existing.read = false; // Reset read status for new activity
            await existing.save();
            return existing;
        }

        const item = await InboxItem.create({
            user_id: userId,
            item_type: itemType,
            reference_id: referenceId,
            reference_type: referenceType,
            actor_id: actorId,
            metadata
        });

        return item;
    } catch (error) {
        console.error('Error creating inbox item:', error);
        return null;
    }
}

