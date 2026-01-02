# How to Add Social Signals Test Data

Since you don't want to change the code, here are ways to add Social Signals data to existing users so you can see them in action:

## Method 1: Using the API (Recommended - No Code Changes)

Use your browser's console or Postman/Thunder Client to call the existing update API endpoint.

### Step 1: Get your Auth Token
1. Log in to your app at http://localhost:5173
2. Open browser DevTools (F12)
3. Go to Console tab
4. Run this to get your Clerk token:
```javascript
// This will get your token from Clerk
const token = await window.Clerk.session.getToken();
console.log('Your token:', token);
```

### Step 2: Update Your Profile with Social Signals

In the same browser console, run:

```javascript
const token = await window.Clerk.session.getToken();
const userId = window.Clerk.user.id;

// Update with Social Signals
const response = await fetch('http://localhost:4000/api/user/update', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    interaction_style_badges: ['early-bird', 'quick-replier', 'night-owl'],
    message_comfort_level: 'selective',
    request_openness: 'connections_only',
    energy_mode: 'focus',
    energy_mode_expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
  })
});

const data = await response.json();
console.log('Updated user:', data);
```

### Step 3: Refresh the Page
After running the API call, refresh your profile page to see:
- ✅ Interaction Style Badges below your bio
- ✅ Message Comfort Indicator next to username
- ✅ Energy Mode Badge next to your name

## Method 2: Update via Profile Edit Form (If Available)

If your ProfileModal already has fields for these, use the edit button on your profile page.

## Method 3: Direct MongoDB Update (Advanced)

If you have MongoDB Compass or mongo shell access:

```javascript
// Connect to your database
use vibeconnect // or your database name

// Update your user document
db.users.updateOne(
  { _id: "YOUR_USER_ID_HERE" }, // Replace with actual user ID
  {
    $set: {
      interaction_style_badges: ["early-bird", "quick-replier", "night-owl"],
      message_comfort_level: "selective",
      request_openness: "connections_only",
      energy_mode: "focus",
      energy_mode_expires_at: new Date(Date.now() + 3600000) // 1 hour from now
    }
  }
)
```

## Method 4: Update Multiple Users for Testing

To see Social Signals on different users (for testing chat headers, user cards, etc.):

### In Browser Console (for each user):
```javascript
// Run this while logged in as different users
const token = await window.Clerk.session.getToken();

await fetch('http://localhost:4000/api/user/update', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    // Example 1: High energy user
    energy_mode: 'high',
    message_comfort_level: 'open',
    interaction_style_badges: ['energetic', 'always-available'],
    
    // Example 2: Focused user
    energy_mode: 'focus',
    energy_mode_expires_at: new Date(Date.now() + 7200000).toISOString(), // 2 hours
    message_comfort_level: 'selective',
    
    // Example 3: Away mode
    energy_mode: 'away',
    request_openness: 'closed',
    message_comfort_level: 'closed'
  })
});
```

## Quick Test Scenarios

### Test Case 1: Profile Page
1. Update your own profile with all Social Signals
2. Go to `/profile`
3. Should see: Badges, Message Comfort, Energy Mode

### Test Case 2: Chat Header
1. Update another user's profile with energy_mode: 'focus'
2. Start a chat with that user
3. Should see: Energy mode dot and message comfort icon in header

### Test Case 3: User Cards
1. Update user profiles with different request_openness settings
2. Go to `/discover` or `/connections`
3. Should see: Energy mode dots on avatars, request openness badges

### Test Case 4: Connections Page
1. Update connections with various Social Signals
2. Go to `/connections`
3. Should see: Different indicators per user

## Social Signals Field Values

### interaction_style_badges
- Array of strings: `["early-bird", "quick-replier", "night-owl", "energetic", "always-available"]`

### message_comfort_level
- Options: `"open"` (default, won't show), `"selective"`, `"closed"`

### request_openness
- Options: `"open"` (default, won't show), `"connections_only"`, `"closed"`

### energy_mode
- Options: `"normal"` (default, won't show), `"high"`, `"low"`, `"focus"`, `"away"`

### energy_mode_expires_at
- ISO Date string or null
- Example: `new Date(Date.now() + 3600000).toISOString()` (1 hour from now)

## Troubleshooting

- **Not seeing indicators?** Make sure the values are not the defaults (open/normal/empty)
- **Energy mode not showing?** Check if expires_at has passed (it auto-hides expired modes)
- **API not working?** Ensure server is running on port 4000 and you're authenticated


