import fs from "fs";
import crypto from "crypto";
import imagekit from "../configs/imageKit.js";
import redis, { subscriber } from "../configs/redis.js";
import Message from "../models/Message.js";

// Create an empty object to store SS Event connections
const connections = {};

// Every server instance listens for new messages and forwards them to its own connected users
export const subscribeToMessages = () => subscriber.subscribe('messages', (data) => {
    const message = JSON.parse(data)
    connections[message.to_user_id]?.write(`data: ${data}\n\n`)
})

// EventSource can't send headers, so the client first gets a one-time ticket (valid 60s)
export const getStreamToken = async (req, res) => {
    const { userId } = req;
    const token = crypto.randomBytes(32).toString('hex')
    await redis.setEx(`stream:${token}`, 60, userId)
    res.json({ success: true, token })
}

// Controller function for the SSE endpoint
export const sseController = async (req, res)=>{
    const userId = await redis.getDel(`stream:${req.query.token}`)
    if(!userId){
        return res.status(401).end()
    }
    console.log('New client connected : ', userId)

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Add the client's response object to the connections object
    connections[userId] = res

    // Send an initial event to the client
    res.write('log: Connected to SSE stream\n\n');

    // Handle client disconnection
    req.on('close', ()=>{
        // Remove the client's response object from the connections array
        delete connections[userId];
        console.log('Client disconnected');
    })
}

// Send Message
export const sendMessage = async (req, res) => {
    try {
        const { userId } = req;
        const { to_user_id, text, message_type } = req.body;
        const image = req.file;

        let media_url = '';
        let finalMessageType = message_type || (image ? 'image' : 'text');
        
        // Parse special message types
        let poll_data = null;
        let checklist_data = null;
        let decision_data = null;

        if (finalMessageType === 'poll') {
            try {
                poll_data = JSON.parse(text);
            } catch (e) {
                poll_data = { question: text, options: [] };
            }
        } else if (finalMessageType === 'checklist') {
            try {
                checklist_data = JSON.parse(text);
            } catch (e) {
                checklist_data = { title: text, items: [] };
            }
        } else if (finalMessageType === 'decision') {
            try {
                decision_data = JSON.parse(text);
            } catch (e) {
                decision_data = { question: text };
            }
        }

        if(finalMessageType === 'image'){
            const fileBuffer =  fs.readFileSync(image.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: image.originalname,
            });
            media_url = imagekit.url({
                path: response.filePath,
                transformation: [
                    {quality: 'auto'},
                    {format: 'webp'},
                    {width: '1280'}
                ]
            })
        }

        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            text,
            message_type: finalMessageType,
            media_url,
            poll_data,
            checklist_data,
            decision_data
        })

        res.json({ success: true, message });

        // Send message to to_user_id using SSE
        const messageWithUserData = await Message.findById(message._id).populate('from_user_id');

        await redis.publish('messages', JSON.stringify(messageWithUserData))

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get Chat Messages
export const getChatMessages = async (req, res) => {
    try {
        const { userId } = req;
        const { to_user_id } = req.body;

        const messages = await Message.find({
            $or: [
                {from_user_id: userId, to_user_id},
                {from_user_id: to_user_id, to_user_id: userId},
            ]
        }).sort({createdAt: -1})

        // Auto-mark as "seen_not_ready" after viewing (Unread Without Guilt)
        // Only mark as seen, state will transition automatically via frontend
        await Message.updateMany(
            {from_user_id: to_user_id, to_user_id: userId, seen: false, message_state: 'unread'},
            {
                seen: true,
                message_state: 'seen_not_ready',
                state_changed_at: new Date()
            }
        );

        res.json({ success: true, messages });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getUserRecentMessages = async (req, res) => {
    try {
        const { userId } = req;
        const messages = await Message.find({to_user_id: userId}).populate('from_user_id to_user_id').sort({ createdAt: -1 });

        res.json({ success: true, messages });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update Message State (Unread Without Guilt)
export const updateMessageState = async (req, res) => {
    try {
        const { userId } = req;
        const { messageId } = req.params;
        const { message_state } = req.body;

        const message = await Message.findById(messageId);
        
        if (!message) {
            return res.json({ success: false, message: 'Message not found' });
        }

        // Only recipient can update state
        if (message.to_user_id !== userId) {
            return res.json({ success: false, message: 'Unauthorized' });
        }

        // Respect Social Signals - if user is in "away" or "closed" mode, respect it
        const user = await User.findById(userId);
        
        if (user) {
            // If user has closed messages, allow state updates but don't auto-mark as seen
            if (user.message_comfort_level === 'closed' && message_state !== 'no_reply_needed') {
                message.message_state = message_state;
                message.state_changed_at = new Date();
                // Don't mark as seen if messages are closed
            } else {
                message.message_state = message_state;
                message.seen = message_state !== 'unread';
                message.state_changed_at = new Date();
            }
        } else {
            message.message_state = message_state;
            message.seen = message_state !== 'unread';
            message.state_changed_at = new Date();
        }

        await message.save();

        // Create inbox item for message state update (for sender to see, if not unread)
        if (message_state !== 'unread' && message.from_user_id !== userId) {
            await createInboxItem(
                message.from_user_id,
                'message_state_update',
                message._id,
                'message',
                userId,
                { message_state }
            );
        }

        // Create inbox item for message state update (for sender to see)
        if (message_state !== 'unread' && message.from_user_id !== userId) {
            await createInboxItem(
                message.from_user_id,
                'message_state_update',
                message._id,
                'message',
                userId,
                { message_state }
            );
        }

        res.json({ success: true, message });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update Poll
export const updatePoll = async (req, res) => {
    try {
        const { userId } = req;
        const { messageId } = req.params;
        const { poll_data } = req.body;

        const message = await Message.findById(messageId);
        if (!message || (message.from_user_id !== userId && message.to_user_id !== userId)) {
            return res.json({ success: false, message: 'Message not found' });
        }

        message.poll_data = poll_data;
        await message.save();

        res.json({ success: true, message });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update Checklist
export const updateChecklist = async (req, res) => {
    try {
        const { userId } = req;
        const { messageId } = req.params;
        const { checklist_data } = req.body;

        const message = await Message.findById(messageId);
        if (!message || (message.from_user_id !== userId && message.to_user_id !== userId)) {
            return res.json({ success: false, message: 'Message not found' });
        }

        message.checklist_data = checklist_data;
        await message.save();

        res.json({ success: true, message });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update Decision
export const updateDecision = async (req, res) => {
    try {
        const { userId } = req;
        const { messageId } = req.params;
        const { decision_data } = req.body;

        const message = await Message.findById(messageId);
        if (!message || (message.from_user_id !== userId && message.to_user_id !== userId)) {
            return res.json({ success: false, message: 'Message not found' });
        }

        message.decision_data = decision_data;
        await message.save();

        res.json({ success: true, message });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}