# Deployment Guide

## Development (Local)

Run the app locally with Socket.io server bundled:
```bash
pnpm dev
```

The app will be available at `http://localhost:3000` and Socket.io will work automatically.

## Production Deployment

### Option 1: Vercel (Frontend) + Separate Backend Server (Socket.io)

**Recommended approach**: Deploy the frontend to Vercel and run `server.js` on a separate platform.

#### Step 1: Deploy Frontend to Vercel

1. Push your code to GitHub
2. Connect to Vercel and deploy
3. In Vercel project settings, add environment variable:
   ```
   NEXT_PUBLIC_SOCKET_URL = https://your-backend-server.com
   ```

#### Step 2: Host Backend Server

Deploy `server.js` to one of these platforms:

**Option A: Railway (Recommended)**
- Push code to GitHub
- Create Railway project from GitHub
- Set `NODE_ENV=production`
- Railway will auto-detect and run the server

**Option B: Render**
- Create Web Service from GitHub repo
- Build Command: `pnpm build`
- Start Command: `pnpm start`
- Set `NODE_ENV=production`

**Option C: Self-hosted (AWS, DigitalOcean, etc.)**
```bash
# Install dependencies
pnpm install

# Build Next.js
pnpm build

# Start server
NODE_ENV=production node server.js
```

#### Step 3: Configure CORS and Socket.io

The `server.js` is already configured with CORS enabled for all origins. The frontend will automatically connect to `NEXT_PUBLIC_SOCKET_URL` if set.

### Option 2: Full Vercel Deployment (No Socket.io)

If you need everything on Vercel without a separate backend:

1. Remove `server.js`
2. Update `package.json` scripts back to:
   ```json
   "dev": "next dev",
   "start": "next start"
   ```
3. Replace Socket.io with Firebase Realtime Database or another serverless solution

## Environment Variables

Create `.env.local` in the project root:

```
# Only needed for production when using separate backend
NEXT_PUBLIC_SOCKET_URL=https://your-backend-server.com
```

The `NEXT_PUBLIC_` prefix makes it available in the browser.

## Troubleshooting

**Socket.io not connecting:**
- Check that `NEXT_PUBLIC_SOCKET_URL` is set correctly
- Ensure backend server is running
- Check CORS settings in `server.js`
- Check browser console for connection errors

**Devices not staying in sync:**
- Verify Socket.io connections in browser DevTools (Network tab)
- Check server logs for connection messages
- Ensure all clients connect to the same backend URL

**CORS errors:**
- Update `cors.origin` in `server.js` to match your domain
- Or keep it as `"*"` for development (not recommended for production)
