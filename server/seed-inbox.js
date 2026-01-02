import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from './configs/db.js';
import InboxItem from './models/Inbox.js';
import User from './models/User.js';

/**
 * Seed script to create inbox items for testing
 * 
 * IMPORTANT: Replace 'YOUR_USER_ID' with your actual Clerk user ID
 * You can find it in the browser console: window.Clerk.user.id
 */

const YOUR_USER_ID = 'user_37cbK4GgDzS5yksojzaZkqXSR3e'; // Replace with your user ID

const seedInbox = async () => {
  try {
    console.log('🌱 Seeding inbox items...');
    
    await connectDB();
    
    // Find your user (User._id is the Clerk user ID)
    const yourUser = await User.findById(YOUR_USER_ID);
    if (!yourUser) {
      console.error('❌ Your user not found. Make sure seed-social-signals.js ran first.');
      process.exit(1);
    }

    // Find test users (User._id starts with 'test_user_')
    const testUsers = await User.find({ _id: /^test_user_/ });
    console.log(`✅ Found ${testUsers.length} test users`);

    // Clean up old test inbox items
    await InboxItem.deleteMany({
      user_id: yourUser._id,
      reference_id: { $regex: /\[TEST.*\]/ }
    });

    // Create inbox items with different types
    const inboxItems = [];

    // Connection requests
    if (testUsers[0]) {
      inboxItems.push({
        user_id: yourUser._id,
        item_type: 'connection_request',
        reference_id: `[TEST] connection_${testUsers[0]._id}`,
        reference_type: 'connection',
        actor_id: testUsers[0]._id,
        read: false,
        dismissed: false,
        createdAt: new Date(Date.now() - 3600000) // 1 hour ago
      });
    }

    // Connection accepted
    if (testUsers[1]) {
      inboxItems.push({
        user_id: yourUser._id,
        item_type: 'connection_accepted',
        reference_id: `[TEST] connection_${testUsers[1]._id}`,
        reference_type: 'connection',
        actor_id: testUsers[1]._id,
        read: false,
        dismissed: false,
        createdAt: new Date(Date.now() - 1800000) // 30 min ago
      });
    }

    // Message state updates
    if (testUsers[2]) {
      inboxItems.push({
        user_id: yourUser._id,
        item_type: 'message_state_update',
        reference_id: `[TEST] message_${testUsers[2]._id}`,
        reference_type: 'message',
        actor_id: testUsers[2]._id,
        read: false,
        dismissed: false,
        metadata: { message_state: 'will_reply_later' },
        createdAt: new Date(Date.now() - 900000) // 15 min ago
      });

      inboxItems.push({
        user_id: yourUser._id,
        item_type: 'message_state_update',
        reference_id: `[TEST] message_${testUsers[3]?._id || testUsers[2]._id}`,
        reference_type: 'message',
        actor_id: testUsers[3] || testUsers[2],
        read: true,
        dismissed: false,
        metadata: { message_state: 'no_reply_needed' },
        createdAt: new Date(Date.now() - 7200000) // 2 hours ago
      });
    }

    // Post likes
    if (testUsers[4]) {
      inboxItems.push({
        user_id: yourUser._id,
        item_type: 'post_like',
        reference_id: `[TEST] post_${testUsers[4]._id}`,
        reference_type: 'post',
        actor_id: testUsers[4]._id,
        read: false,
        dismissed: false,
        createdAt: new Date(Date.now() - 300000) // 5 min ago
      });
    }

    // Follows
    if (testUsers[5]) {
      inboxItems.push({
        user_id: yourUser._id,
        item_type: 'follow',
        reference_id: `[TEST] user_${testUsers[5]._id}`,
        reference_type: 'user',
        actor_id: testUsers[5]._id,
        read: false,
        dismissed: false,
        createdAt: new Date(Date.now() - 600000) // 10 min ago
      });
    }

    await InboxItem.insertMany(inboxItems);
    
    console.log(`✅ Created ${inboxItems.length} inbox items`);
    console.log('');
    console.log('📋 Inbox Items Created:');
    console.log('   - Connection request (unread)');
    console.log('   - Connection accepted (unread)');
    console.log('   - Message state: will reply later (unread)');
    console.log('   - Message state: no reply needed (read)');
    console.log('   - Post like (unread)');
    console.log('   - Follow (unread)');
    console.log('');
    console.log('🎯 Test the feature:');
    console.log('   1. Navigate to /inbox in your app');
    console.log('   2. See different inbox item types');
    console.log('   3. Click items to navigate');
    console.log('   4. Dismiss items with X button');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding inbox:', error);
    process.exit(1);
  }
};

seedInbox();

