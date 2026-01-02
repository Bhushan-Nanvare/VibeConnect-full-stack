import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from './configs/db.js';
import User from './models/User.js';
import Message from './models/Message.js';
import Connection from './models/Connection.js';
import Post from './models/Post.js';

// Sample users with different Social Signals configurations
const sampleUsers = [
  {
    _id: 'test_user_1',
    email: 'alice.johnson@test.com',
    full_name: 'Alice Johnson',
    username: 'alice_j',
    bio: 'Creative designer and night owl. Always up for a good conversation! 🎨',
    profile_picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    cover_photo: '',
    location: 'San Francisco, CA',
    followers: [],
    following: [],
    connections: [],
    // Social Signals - Focused user
    interaction_style_badges: ['early-bird', 'quick-replier', 'creative'],
    message_comfort_level: 'selective',
    request_openness: 'open',
    energy_mode: 'focus',
    energy_mode_expires_at: new Date(Date.now() + 7200000) // 2 hours
  },
  {
    _id: 'test_user_2',
    email: 'bob.smith@test.com',
    full_name: 'Bob Smith',
    username: 'bob_smith',
    bio: 'Tech enthusiast. Available most of the time! 💻',
    profile_picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    cover_photo: '',
    location: 'New York, NY',
    followers: [],
    following: [],
    connections: [],
    // Social Signals - High energy
    interaction_style_badges: ['energetic', 'always-available', 'tech-lover'],
    message_comfort_level: 'open',
    request_openness: 'open',
    energy_mode: 'high',
    energy_mode_expires_at: null
  },
  {
    _id: 'test_user_3',
    email: 'carol.williams@test.com',
    full_name: 'Carol Williams',
    username: 'carol_w',
    bio: 'Coffee lover and deep thinker. Connections only please. ☕',
    profile_picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
    cover_photo: '',
    location: 'Seattle, WA',
    followers: [],
    following: [],
    connections: [],
    // Social Signals - Selective
    interaction_style_badges: ['night-owl', 'thoughtful', 'selective'],
    message_comfort_level: 'selective',
    request_openness: 'connections_only',
    energy_mode: 'normal',
    energy_mode_expires_at: null
  },
  {
    _id: 'test_user_4',
    email: 'david.brown@test.com',
    full_name: 'David Brown',
    username: 'david_b',
    bio: 'Currently away. Back soon! 🏖️',
    profile_picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    cover_photo: '',
    location: 'Miami, FL',
    followers: [],
    following: [],
    connections: [],
    // Social Signals - Away mode
    interaction_style_badges: ['traveler', 'outdoor'],
    message_comfort_level: 'closed',
    request_openness: 'closed',
    energy_mode: 'away',
    energy_mode_expires_at: new Date(Date.now() + 86400000) // 24 hours
  },
  {
    _id: 'test_user_5',
    email: 'emma.davis@test.com',
    full_name: 'Emma Davis',
    username: 'emma_d',
    bio: 'Fitness coach and morning person. Energized and ready! 💪',
    profile_picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    cover_photo: '',
    location: 'Los Angeles, CA',
    followers: [],
    following: [],
    connections: [],
    // Social Signals - High energy with badges
    interaction_style_badges: ['early-bird', 'energetic', 'motivational'],
    message_comfort_level: 'open',
    request_openness: 'open',
    energy_mode: 'high',
    energy_mode_expires_at: null
  },
  {
    _id: 'test_user_6',
    email: 'frank.miller@test.com',
    full_name: 'Frank Miller',
    username: 'frank_m',
    bio: 'Developer in deep work mode. Limited availability. 🔧',
    profile_picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frank',
    cover_photo: '',
    location: 'Austin, TX',
    followers: [],
    following: [],
    connections: [],
    // Social Signals - Focus mode
    interaction_style_badges: ['focused', 'technical', 'deep-work'],
    message_comfort_level: 'closed',
    request_openness: 'connections_only',
    energy_mode: 'focus',
    energy_mode_expires_at: new Date(Date.now() + 10800000) // 3 hours
  },
  {
    _id: 'test_user_7',
    email: 'grace.lee@test.com',
    full_name: 'Grace Lee',
    username: 'grace_l',
    bio: 'Artist and creative soul. Selective about connections. 🎨',
    profile_picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace',
    cover_photo: '',
    location: 'Portland, OR',
    followers: [],
    following: [],
    connections: [],
    // Social Signals - Low energy
    interaction_style_badges: ['creative', 'introverted', 'thoughtful'],
    message_comfort_level: 'selective',
    request_openness: 'connections_only',
    energy_mode: 'low',
    energy_mode_expires_at: new Date(Date.now() + 3600000) // 1 hour
  },
  {
    _id: 'test_user_8',
    email: 'henry.wilson@test.com',
    full_name: 'Henry Wilson',
    username: 'henry_w',
    bio: 'Entrepreneur. Always building something new! 🚀',
    profile_picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=henry',
    cover_photo: '',
    location: 'Boston, MA',
    followers: [],
    following: [],
    connections: [],
    // Social Signals - Open user
    interaction_style_badges: ['entrepreneur', 'networking', 'always-on'],
    message_comfort_level: 'open',
    request_openness: 'open',
    energy_mode: 'normal',
    energy_mode_expires_at: null
  }
];

const sampleMessages = [
  {
    from_user_id: 'test_user_1',
    to_user_id: 'YOUR_USER_ID', // Will be replaced with actual user
    text: 'Hey! Love your recent posts. Want to connect?',
    message_type: 'text',
    seen: false,
    createdAt: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    from_user_id: 'test_user_2',
    to_user_id: 'YOUR_USER_ID',
    text: 'Great to see you here! How are things?',
    message_type: 'text',
    seen: false,
    createdAt: new Date(Date.now() - 7200000) // 2 hours ago
  },
  {
    from_user_id: 'test_user_3',
    to_user_id: 'YOUR_USER_ID',
    text: 'Would love to chat about your interests!',
    message_type: 'text',
    seen: true,
    createdAt: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    from_user_id: 'test_user_5',
    to_user_id: 'YOUR_USER_ID',
    text: 'Morning! Ready for a great day? 💪',
    message_type: 'text',
    seen: false,
    createdAt: new Date(Date.now() - 1800000) // 30 min ago
  }
];

const samplePosts = [
  {
    user: 'test_user_1',
    content: 'Just finished an amazing design project! The creative process never gets old. #design #creative #inspiration',
    image_urls: [],
    post_type: 'text',
    likes_count: ['test_user_2', 'test_user_3']
  },
  {
    user: 'test_user_2',
    content: 'New tech stack I\'m learning: React, Node.js, and MongoDB. Always exciting to dive into new technologies! #coding #webdev',
    image_urls: [],
    post_type: 'text',
    likes_count: ['test_user_1', 'test_user_5']
  },
  {
    user: 'test_user_5',
    content: '5 AM morning run completed! There\'s nothing like starting the day with movement and energy. #fitness #morning #motivation',
    image_urls: [],
    post_type: 'text',
    likes_count: ['test_user_2', 'test_user_8']
  },
  {
    user: 'test_user_6',
    content: 'Deep work session: 4 hours of focused coding. Getting into the flow state is magical. #deepwork #coding #focus',
    image_urls: [],
    post_type: 'text',
    likes_count: ['test_user_1']
  },
  {
    user: 'test_user_8',
    content: 'New startup idea: Building a social platform that connects people through shared interests. Excited about the journey! #entrepreneur #startup',
    image_urls: [],
    post_type: 'text',
    likes_count: ['test_user_2', 'test_user_3', 'test_user_5']
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing test users
    console.log('🧹 Cleaning up existing test data...');
    await User.deleteMany({ _id: { $in: sampleUsers.map(u => u._id) } });
    console.log('✅ Cleaned up test users');
    
    // Create sample users
    console.log('👥 Creating sample users...');
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} sample users`);
    
    // Note: To create messages and connections, we need the actual logged-in user ID
    // These will be created after you log in and run a second script
    
    // Create sample posts
    console.log('📝 Creating sample posts...');
    const postsWithTimestamps = samplePosts.map(post => ({
      ...post,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 3600000) // Random time in last week
    }));
    await Post.insertMany(postsWithTimestamps);
    console.log(`✅ Created ${postsWithTimestamps.length} sample posts`);
    
    console.log('');
    console.log('✨ Database seeded successfully!');
    console.log('');
    console.log('📋 Test Users Created:');
    sampleUsers.forEach(user => {
      console.log(`   - ${user.full_name} (@${user.username})`);
      console.log(`     Badges: ${user.interaction_style_badges.join(', ')}`);
      console.log(`     Energy: ${user.energy_mode}, Comfort: ${user.message_comfort_level}`);
      console.log('');
    });
    
    console.log('💡 Next steps:');
    console.log('   1. Log in to your account');
    console.log('   2. Run: node server/seed-connections.js');
    console.log('      (This will create connections and messages with test users)');
    console.log('');
    console.log('🚀 Refresh your app to see the test users everywhere!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();


