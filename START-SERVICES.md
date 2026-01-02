# How to Start All Services for Testing Social Signals

## Three Terminal Windows Needed

### Terminal 1: Inngest Dev Server
```powershell
npx inngest-cli@latest dev
```
- Runs on port **8288** by default
- Shows Inngest function discovery and execution logs

### Terminal 2: Backend Server
```powershell
cd server
npm run server
```
- Runs on port **4000** by default
- Shows database connection, API endpoints, and server logs

### Terminal 3: React Frontend (Client)
```powershell
cd client
npm run dev
```
- Runs on port **5173** by default (Vite dev server)
- Opens in browser automatically or visit: http://localhost:5173

---

## Quick Verification

Once all services are running, check:

1. **Inngest**: Should show "Inngest dev server running on http://localhost:8288"
2. **Server**: Should show "Server is running on port 4000"
3. **Client**: Should show "Local: http://localhost:5173"

---

## Testing Social Signals Features

### To test the new Social Signals features:

1. **Profile Page** (`/profile`):
   - View your profile to see:
     - Interaction Style Badges (below bio)
     - Message Comfort Indicator (next to username)
     - Energy Mode Badge (next to name, if set)

2. **Chat Header** (`/messages/:userId`):
   - Open a chat to see:
     - Energy Mode Dot indicator
     - Message Comfort icon

3. **User Cards** (Discover, Connections):
   - View user cards to see:
     - Energy Mode Dot on avatar
     - Request Openness Badge

4. **Connections Page** (`/connections`):
   - View connection cards to see:
     - Energy Mode indicators
     - Request Openness text

### To Update Social Signals (via API or Profile Edit):

Currently, Social Signals can be updated via:
- API endpoint: `POST /api/user/update` with Social Signals fields
- Profile edit modal (if you add form fields - not yet implemented)

**Example API call to test:**
```javascript
// Update Social Signals via API
const formData = {
  interaction_style_badges: ["early-bird", "quick-replier"],
  message_comfort_level: "selective",
  request_openness: "connections_only",
  energy_mode: "focus",
  energy_mode_expires_at: new Date(Date.now() + 3600000) // 1 hour from now
}
```

---

## Troubleshooting

If services don't start:
1. Ensure `.env` files are configured (server and client)
2. Check MongoDB connection string
3. Verify Node.js and npm are installed
4. Run `npm install` in both `server` and `client` directories if needed


