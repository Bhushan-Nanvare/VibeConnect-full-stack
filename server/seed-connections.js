import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from './configs/db.js';
import User from './models/User.js';
import Message from './models/Message.js';
import Connection from './models/Connection.js';

/**
 * This script creates connections and messages between your logged-in user and test users
 * 
 * Usage: node seed-connections.js you@example.com
 */

const YOUR_EMAIL = process.argv[2];
if (!YOUR_EMAIL) {
  console.error('❌ Pass your account email: node seed-connections.js you@example.com');
  process.exit(1);
}
await connectDB();
const YOUR_USER_ID = (await User.findOne({ email: YOUR_EMAIL.toLowerCase() }))?._id;
if (!YOUR_USER_ID) {
  console.error('❌ No account with that email. Sign up in the app first.');
  process.exit(1);
}

const testUserIds = [
  'test_user_1',
  'test_user_2',
  'test_user_3',
  'test_user_4',
  'test_user_5',
  'test_user_6',
  'test_user_7',
  'test_user_8'
];

const sampleMessages = [
  {
    from_user_id: 'test_user_1',
    to_user_id: YOUR_USER_ID,
    text: 'Hey! Love your recent posts. Want to connect?',
    message_type: 'text',
    seen: false,
    createdAt: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    from_user_id: 'test_user_2',
    to_user_id: YOUR_USER_ID,
    text: 'Great to see you here! How are things?',
    message_type: 'text',
    seen: false,
    createdAt: new Date(Date.now() - 7200000) // 2 hours ago
  },
  {
    from_user_id: 'test_user_3',
    to_user_id: YOUR_USER_ID,
    text: 'Would love to chat about your interests!',
    message_type: 'text',
    seen: true,
    createdAt: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    from_user_id: 'test_user_5',
    to_user_id: YOUR_USER_ID,
    text: 'Morning! Ready for a great day? 💪',
    message_type: 'text',
    seen: false,
    createdAt: new Date(Date.now() - 1800000) // 30 min ago
  },
  {
    from_user_id: YOUR_USER_ID,
    to_user_id: 'test_user_1',
    text: 'Thanks! I\'d love to connect too!',
    message_type: 'text',
    seen: true,
    createdAt: new Date(Date.now() - 3300000) // 55 min ago
  },
  {
    from_user_id: YOUR_USER_ID,
    to_user_id: 'test_user_6',
    text: 'Hey, saw you\'re in deep work mode. Respect! 🔧',
    message_type: 'text',
    seen: false,
    createdAt: new Date(Date.now() - 3600000)
  }
];

const createConnectionsAndMessages = async () => {
  try {
    console.log('🌱 Starting connections and messages seed...');
    console.log(`👤 Your User ID: ${YOUR_USER_ID}`);
    
    // Connect to database
    await connectDB();
    
    // Verify your user exists
    const yourUser = await User.findById(YOUR_USER_ID);
    if (!yourUser) {
      console.error('❌ Your user not found in database. Please log in first!');
      process.exit(1);
    }
    
    console.log(`✅ Found your user: ${yourUser.full_name}`);
    
    // Verify test users exist
    const testUsers = await User.find({ _id: { $in: testUserIds } });
    if (testUsers.length === 0) {
      console.error('❌ No test users found. Please run seed-social-signals.js first!');
      process.exit(1);
    }
    console.log(`✅ Found ${testUsers.length} test users`);
    
    // Create connections (mutual)
    console.log('🔗 Creating connections...');
    const connections = [];
    
    // Connect with first 5 test users (accepted connections)
    for (let i = 0; i < 5; i++) {
      const testUserId = testUserIds[i];
      
      // Add to your connections array
      await User.findByIdAndUpdate(YOUR_USER_ID, {
        $addToSet: { connections: testUserId }
      });
      
      // Add you to their connections array
      await User.findByIdAndUpdate(testUserId, {
        $addToSet: { connections: YOUR_USER_ID }
      });
      
      // Create connection record
      const connection = await Connection.findOneAndUpdate(
        {
          $or: [
            { from_user_id: YOUR_USER_ID, to_user_id: testUserId },
            { from_user_id: testUserId, to_user_id: YOUR_USER_ID }
          ]
        },
        {
          from_user_id: YOUR_USER_ID,
          to_user_id: testUserId,
          status: 'accepted'
        },
        { upsert: true, new: true }
      );
      
      connections.push(connection);
    }
    
    // Create pending connection request from test_user_6
    await Connection.findOneAndUpdate(
      { from_user_id: 'test_user_6', to_user_id: YOUR_USER_ID },
      {
        from_user_id: 'test_user_6',
        to_user_id: YOUR_USER_ID,
        status: 'pending'
      },
      { upsert: true, new: true }
    );
    
    console.log(`✅ Created ${connections.length + 1} connections`);
    
    // Clean up old messages
    console.log('🧹 Cleaning up old test messages...');
    await Message.deleteMany({
      $or: [
        { from_user_id: YOUR_USER_ID, to_user_id: { $in: testUserIds } },
        { from_user_id: { $in: testUserIds }, to_user_id: YOUR_USER_ID }
      ]
    });
    
    // Create messages
    console.log('💬 Creating sample messages...');
    await Message.insertMany(sampleMessages);
    console.log(`✅ Created ${sampleMessages.length} messages`);
    
    // Follow some test users
    console.log('👀 Creating follow relationships...');
    const followTestUsers = testUserIds.slice(0, 4);
    
    await User.findByIdAndUpdate(YOUR_USER_ID, {
      $addToSet: { following: { $each: followTestUsers } }
    });
    
    for (const testUserId of followTestUsers) {
      await User.findByIdAndUpdate(testUserId, {
        $addToSet: { followers: YOUR_USER_ID }
      });
    }
    
    console.log(`✅ Following ${followTestUsers.length} test users`);
    
    console.log('');
    console.log('✨ Connections and messages seeded successfully!');
    console.log('');
    console.log('🎯 What you should see now:');
    console.log('   - Test users in Messages page');
    console.log('   - Test users in Suggestions');
    console.log('   - Test users in Connections page');
    console.log('   - Test users in Discover page');
    console.log('   - All Social Signals visible everywhere!');
    console.log('');
    console.log('🚀 Refresh your app to see the changes!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding connections:', error);
    process.exit(1);
  }
};

createConnectionsAndMessages();


