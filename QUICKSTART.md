# WeatherGuard Admin - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Prerequisites
- **Node.js 18+** ([Download](https://nodejs.org/))
- **MongoDB Local** or **MongoDB Atlas** account
- **Git**

### Step 2: Clone & Install
```bash
cd Project-Assesment
npm install
cd api && npm install && cd ..
cd admin && npm install && cd ..
```

### Step 3: Get OAuth Credentials

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials → Web application
5. Add authorized redirect URI: `http://localhost:3001/auth/google/callback`
6. Copy Client ID and Secret

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create New OAuth App
3. Set Authorization callback URL: `http://localhost:3001/auth/github/callback`
4. Copy Client ID and Secret

#### Telegram Bot
1. Open Telegram, find @BotFather
2. Send `/newbot` and follow instructions
3. Copy the token

### Step 4: Configure Environment
Edit `api/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/weatherguard
JWT_SECRET=super-secret-key-12345
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
FRONTEND_URL=http://localhost:3000
PORT=3001
```

### Step 5: Start MongoDB
**Option A: Docker**
```bash
docker-compose up -d mongodb
```

**Option B: Local MongoDB**
```bash
mongod
```

### Step 6: Run Applications

**Terminal 1 - Backend:**
```bash
cd api
npm run dev
# API starts at http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd admin
npm run dev
# Opens at http://localhost:3000
```

### Step 7: Test the Application
1. Open http://localhost:3000
2. Click "Sign in with Google" or "GitHub"
3. You'll see a "Pending Approval" message
4. Create an admin user in MongoDB:
   ```bash
   mongosh
   use weatherguard
   db.users.updateOne(
     { email: "your-email@gmail.com" },
     { $set: { status: "approved", role: "admin" } }
   )
   ```
5. Login again → You should see the admin dashboard

---

## 📋 Admin Dashboard Usage

### View Pending Requests
1. Click "📋 Pending Requests" tab
2. See all users waiting approval
3. Click ✅ Approve or ❌ Reject

### Send Test Alert
1. Click "🌦️ Weather Alerts" tab
2. Click "📨 Send Test Weather Alert"
3. Check approved users' Telegram for notifications

---

## 🔧 API Endpoints (with JWT Token)

Add header: `Authorization: Bearer YOUR_JWT_TOKEN`

```bash
# Get current user
curl http://localhost:3001/auth/me \
  -H "Authorization: Bearer TOKEN"

# Get pending users (admin only)
curl http://localhost:3001/users/pending \
  -H "Authorization: Bearer TOKEN"

# Approve user
curl -X POST http://localhost:3001/users/approve/USER_ID \
  -H "Authorization: Bearer TOKEN"

# Send test alert
curl -X POST http://localhost:3001/weather/simulate-alert \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"city":"London"}'
```

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Verify MongoDB is running: `mongosh`
- Check MONGODB_URI in `.env`
- If using Atlas: whitelist your IP

### "OAuth login not working"
- Verify callback URLs match exactly in OAuth app settings
- Check environment variables are correct
- Clear browser cookies and try again

### "Telegram alerts not sending"
- Verify TELEGRAM_BOT_TOKEN is correct
- Ensure you've /start'd the Telegram bot
- Check user has valid Telegram chat ID

### Build errors
- Delete `node_modules` and `.package-lock.json`
- Run `npm install` again
- Clear cache: `npm cache clean --force`

---

## 📚 Full Documentation

- **[README.md](./README.md)** - Complete project overview
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **API Docs** - See [api/src/](./api/src/) for endpoint details

---

## 🎯 Next Steps

1. **Customize the dashboard** - Edit components in `admin/src/pages/`
2. **Add more weather alerts** - Modify `api/src/weather/`
3. **Deploy** - See [DEPLOYMENT.md](./DEPLOYMENT.md)
4. **Create demo video** - Show the workflow for Loom/YouTube

---

## 💡 Pro Tips

- Use MongoDB Compass GUI: `mongosh://localhost:27017`
- Test API endpoints with Postman or Insomnia
- Enable hot reload for faster development
- Use Telegram BotFather to test webhook setup

---

Need help? Check the [README.md](./README.md) for detailed documentation!
