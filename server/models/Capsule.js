import mongoose from 'mongoose';

const capsuleSchema = new mongoose.Schema({
    author: { type: String, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 1000 },
    unlockTime: { type: Date, required: true },
    recipientType: { type: String, enum: ['self', 'connection'], required: true },
    recipientId: { type: String, ref: 'User' },
    status: { type: String, enum: ['locked', 'unlocked', 'failed', 'blocked'], default: 'locked' },
    timezone: { type: String, default: 'UTC' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true, minimize: false });

capsuleSchema.index({ unlockTime: 1 });
capsuleSchema.index({ author: 1 });
capsuleSchema.index({ recipientId: 1 });
capsuleSchema.index({ status: 1 });

const Capsule = mongoose.model('Capsule', capsuleSchema);

export default Capsule;
