import mongoose from 'mongoose';

const inboxItemSchema = new mongoose.Schema({
    user_id: {type: String, ref: 'User', required: true},
    item_type: {
        type: String,
        enum: ['connection_request', 'connection_accepted', 'message_state_update', 'post_like', 'post_comment', 'mention', 'follow'],
        required: true
    },
    reference_id: {type: String, required: true}, // ID of related item (message, connection, post, user)
    reference_type: {type: String, enum: ['message', 'connection', 'post', 'user'], required: true},
    actor_id: {type: String, ref: 'User'}, // User who triggered the event
    read: {type: Boolean, default: false},
    dismissed: {type: Boolean, default: false},
    metadata: {type: mongoose.Schema.Types.Mixed, default: {}} // Flexible data storage
}, {timestamps: true, minimize: false})

// Index for efficient queries
inboxItemSchema.index({ user_id: 1, read: 1, dismissed: 1, createdAt: -1 });
inboxItemSchema.index({ user_id: 1, item_type: 1 });

const InboxItem = mongoose.model('InboxItem', inboxItemSchema)

export default InboxItem


