# Seed Database with Test Users and Social Signals

This will populate your database with 8 test users that have different Social Signals configurations, so you can see all features working throughout the app.

## Step 1: Create Test Users with Social Signals

Run this command from the project root:

```bash
node server/seed-social-signals.js
```

This creates:
- ✅ 8 test users with various Social Signals
- ✅ Sample posts from test users
- ✅ Different energy modes, badges, and comfort levels

## Step 2: Get Your User ID

1. Make sure your app is running and you're logged in
2. Open browser console (F12)
3. Run: `window.Clerk.user.id`
4. Copy the ID (looks like: `user_2abc123xyz...`)

## Step 3: Update seed-connections.js

1. Open `server/seed-connections.js`
2. Find this line: `const YOUR_USER_ID = 'YOUR_USER_ID';`
3. Replace `'YOUR_USER_ID'` with your actual user ID from Step 2
4. Save the file

## Step 4: Create Connections and Messages

Run this command:

```bash
node server/seed-connections.js
```

This creates:
- ✅ Connections between you and test users
- ✅ Sample messages in your inbox
- ✅ Follow relationships
- ✅ Pending connection requests

## Step 5: Refresh Your App!

After running both scripts, refresh your app and you'll see:

### 📱 Messages Page (`/messages`)
- Multiple conversation threads
- Users with different energy modes and comfort levels
- Unread message indicators

### 👥 Connections Page (`/connections`)
- Connected users with Social Signals
- Pending connection requests
- Energy mode dots on avatars
- Request openness badges

### 🔍 Discover Page (`/discover`)
- Test users with various Social Signals
- Energy mode indicators
- Interaction style badges visible

### 📄 Profile Pages (`/profile/:userId`)
- Click on any test user profile to see:
  - Interaction Style Badges
  - Message Comfort Indicators
  - Energy Mode Badges
  - All Social Signals in action!

### 💬 Chat Headers
- Open chats with test users to see:
  - Energy mode dots in header
  - Message comfort icons

### 📰 Feed Page
- Posts from test users
- Click on their profiles to see Social Signals

## Test Users Created

1. **Alice Johnson** - Focus mode, selective messages
2. **Bob Smith** - High energy, open to all
3. **Carol Williams** - Connections only, selective
4. **David Brown** - Away mode, closed
5. **Emma Davis** - High energy, open
6. **Frank Miller** - Focus mode, closed messages
7. **Grace Lee** - Low energy, selective
8. **Henry Wilson** - Normal mode, open

Each has different Social Signals so you can test all features!

## Reset/Re-run

To reset and re-seed:
```bash
# Just run the seed scripts again - they clean up old test data automatically
node server/seed-social-signals.js
node server/seed-connections.js
```

## Troubleshooting

- **"User not found"**: Make sure you're logged in first and got your user ID correctly
- **"No test users found"**: Run seed-social-signals.js first
- **Database connection error**: Make sure MongoDB is running and MONGO_URI is set in .env


