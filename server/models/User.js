import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: {type: String, default: () => new mongoose.Types.ObjectId().toString() },
    email: {type: String, required: true, unique: true },
    password: {type: String, select: false },
    email_verified: {type: Boolean, default: false },
    full_name: {type: String, required: true },
    username: {type: String, unique: true },
    bio: {type: String, default: 'Hey there! I am using VibeConnect.' },
    profile_picture: {type: String, default: '' },
    cover_photo: {type: String, default: '' },
    location: {type: String, default: '' },
    followers: [{type: String, ref: 'User' }],
    following: [{type: String, ref: 'User' }],
    connections: [{type: String, ref: 'User' }],
    interaction_style_badges: {type: [String], default: []},
    message_comfort_level: {type: String, enum: ['open', 'selective', 'closed'], default: 'open'},
    request_openness: {type: String, enum: ['open', 'connections_only', 'closed'], default: 'open'},
    energy_mode: {type: String, enum: ['normal', 'high', 'low', 'focus', 'away'], default: 'normal'},
    energy_mode_expires_at: {type: Date, default: null},
},{timestamps: true, minimize: false})

const User = mongoose.model('User', userSchema)

export default User