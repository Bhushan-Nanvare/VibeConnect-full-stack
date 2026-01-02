import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from './configs/db.js';
import Message from './models/Message.js';

/**
 * Seed script to add test messages with different message states
 * for testing "Unread Without Guilt" feature
 * 
 * Run after seed-connections.js
 */

const YOUR_USER_ID = 'user_37cbK4GgDzS5yksojzaZkqXSR3e'; // Replace with your user ID

const testUserIds = [
  'test_user_1',
  'test_user_2',
  'test_user_3',
  'test_user_4',
  'test_user_5',
];

const seedMessageStates = async () => {
  try {
    console.log('🌱 Seeding message states for Unread Without Guilt...');
    
    await connectDB();
    
    // Clean up old test messages with states
    await Message.deleteMany({
      $or: [
        { from_user_id: { $in: testUserIds }, to_user_id: YOUR_USER_ID },
        { from_user_id: YOUR_USER_ID, to_user_id: { $in: testUserIds } }
      ],
      text: { $regex: /\[TEST.*\]/ }
    });
    
    // Create messages with different states
    const testMessages = [
      {
        from_user_id: 'test_user_1',
        to_user_id: YOUR_USER_ID,
        text: '[TEST] This message should be unread',
        message_type: 'text',
        seen: false,
        message_state: 'unread',
        createdAt: new Date(Date.now() - 60000) // 1 minute ago
      },
      {
        from_user_id: 'test_user_2',
        to_user_id: YOUR_USER_ID,
        text: '[TEST] This message is seen but not ready',
        message_type: 'text',
        seen: true,
        message_state: 'seen_not_ready',
        state_changed_at: new Date(Date.now() - 1800000), // 30 min ago
        createdAt: new Date(Date.now() - 3600000) // 1 hour ago
      },
      {
        from_user_id: 'test_user_3',
        to_user_id: YOUR_USER_ID,
        text: '[TEST] This message will be replied to later',
        message_type: 'text',
        seen: true,
        message_state: 'will_reply_later',
        state_changed_at: new Date(Date.now() - 3600000), // 1 hour ago
        createdAt: new Date(Date.now() - 7200000) // 2 hours ago
      },
      {
        from_user_id: 'test_user_4',
        to_user_id: YOUR_USER_ID,
        text: '[TEST] This message needs no reply',
        message_type: 'text',
        seen: true,
        message_state: 'no_reply_needed',
        state_changed_at: new Date(Date.now() - 5400000), // 1.5 hours ago
        createdAt: new Date(Date.now() - 10800000) // 3 hours ago
      },
      {
        from_user_id: 'test_user_5',
        to_user_id: YOUR_USER_ID,
        text: '[TEST] Normal message with image',
        message_type: 'image',
        media_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
        seen: false,
        message_state: 'unread',
        createdAt: new Date(Date.now() - 300000) // 5 min ago
      },
      // Your messages to test users (outgoing)
      {
        from_user_id: YOUR_USER_ID,
        to_user_id: 'test_user_1',
        text: '[TEST] Your message to test user 1',
        message_type: 'text',
        seen: true,
        message_state: 'unread', // Outgoing messages default to unread state
        createdAt: new Date(Date.now() - 900000) // 15 min ago
      }
    ];
    
    await Message.insertMany(testMessages);
    
    console.log(`✅ Created ${testMessages.length} test messages with different states`);
    console.log('');
    console.log('📋 Test Messages Created:');
    console.log('   - Unread message (test_user_1)');
    console.log('   - Seen but not ready (test_user_2)');
    console.log('   - Will reply later (test_user_3)');
    console.log('   - No reply needed (test_user_4)');
    console.log('   - Unread image message (test_user_5)');
    console.log('');
    console.log('🎯 Test the feature:');
    console.log('   1. Open Messages page - see different states');
    console.log('   2. Open chat with test users - tap/long-press to change states');
    console.log('   3. Check state indicators on messages');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding message states:', error);
    process.exit(1);
  }
};

seedMessageStates();


