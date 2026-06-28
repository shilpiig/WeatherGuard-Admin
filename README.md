# WeatherGuard Admin - Secure Weather Alert Service

A full-stack application for managing weather alerts through a secure, invite-only Telegram bot integration with a web-based admin dashboard.

## 🎯 Overview

WeatherGuard is a modular, type-safe application that enables admins to:
- Manage user access through a social login system (Google & GitHub OAuth)
- Approve/reject user access requests
- Send real-time weather alerts to approved users via Telegram
- Simulate weather alerts for testing

## 🏗️ System Architecture

### Database Schema

#### User Collection
```typescript
{
  _id: ObjectId,
  email: string (unique),
  firstName: string,
  lastName: string,
  provider: 'google' | 'github',
  providerId: string (unique),
  status: 'pending' | 'approved' | 'rejected',
  role: 'user' | 'admin',
  profilePicture?: string,
  telegramChatId?: string,
  telegramUsername?: string,
  requestMessage?: string,
  approvedAt?: Date,
  approvedBy?: string (admin ID),
  rejectedAt?: Date,
  rejectedBy?: string (admin ID),
  receiveAlerts: boolean,
  preferences: {
    cities?: string[],
    alertTypes?: string[],
    language?: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### WeatherAlert Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  city: string,
  alertType: string ('rain' | 'storm' | 'cold' | 'heat'),
  temperature: number,
  description: string,
  severity: 'low' | 'medium' | 'high',
  sent: boolean,
  sentAt?: Date,
  telegramMessageId?: string,
  active: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Data Flow Architecture

#### 1. **User Registration & Approval Workflow**

```
User Login (Google/GitHub OAuth)
    ↓
→ User record created in DB with status='pending'
    ↓
→ Telegram notification sent (optional)
    ↓
[Admin Dashboard]
→ Admin views pending requests
    ↓
→ Admin clicks "Approve" or "Reject"
    ↓
→ User status updated in MongoDB
    ↓
→ Telegram approval/rejection message sent to user
    ↓
→ User receives Telegram notification
```

**Key Security Feature**: Only users with `status='approved'` AND `role='admin'` can access the admin dashboard.

#### 2. **Weather Alert Distribution System**

```
Weather Alert Created
    ↓
→ Alert stored in WeatherAlert collection
    ↓
→ Scheduled job runs every 30 minutes (@Cron decorator)
    ↓
→ Query all pending alerts: { sent: false, active: true }
    ↓
For each alert:
  → Fetch associated User from MongoDB
  → Check: status == 'approved' AND receiveAlerts == true
  → If TRUE:
    → Send Telegram message to user.telegramChatId
    → Mark alert as sent with timestamp
  → If FALSE:
    → Alert remains pending (queued for when user is approved)
```

**Data Integrity**: Alerts only reach approved users through this filter mechanism.

#### 3. **Telegram Bot Integration**

```
/start command
    ↓
→ Bot sends welcome message with Telegram Chat ID
    ↓
User links ID in web app
    ↓
→ telegramChatId stored in User record
    ↓
Later: Admin approves user
    ↓
→ Bot sends approval notification
    ↓
→ Weather alerts automatically flow to user
```

---

## 🚀 Tech Stack

### Backend (API)
- **NestJS**: Modular TypeScript framework
- **MongoDB + Mongoose**: NoSQL database with schema validation
- **Passport.js**: OAuth 2.0 authentication
- **JWT**: Secure token-based API authentication
- **Telegraf**: Telegram Bot API wrapper
- **node-cron**: Task scheduling for weather alerts
- **Axios**: HTTP client for weather data

### Frontend (Admin Dashboard)
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Zustand**: Lightweight state management
- **React Router**: Client-side routing
- **Axios**: API communication

### Infrastructure
- **Vite**: Fast build tool & dev server
- **Docker** (optional): Containerization

---

## 📋 Prerequisites

- Node.js 18+ & npm 9+
- MongoDB 5+ (local or MongoDB Atlas)
- Google OAuth Credentials (Google Cloud Console)
- GitHub OAuth Credentials (GitHub Developer Settings)
- Telegram Bot Token (BotFather on Telegram)
- OpenWeather API Key (optional, for real weather data)

---

## 🔧 Setup Instructions

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/weatherguard-admin.git
cd weatherguard-admin

# Install API dependencies
cd api
npm install

# Install Admin dashboard dependencies
cd ../admin
npm install

cd ..
```

### 2. Configure Environment Variables

#### Backend (api/.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weatherguard

JWT_SECRET=your-super-secure-secret-key-change-this

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3001/auth/github/callback

TELEGRAM_BOT_TOKEN=your-telegram-bot-token
OPENWEATHER_API_KEY=your-openweather-api-key

FRONTEND_URL=http://localhost:3000
PORT=3001
```

#### Frontend (admin/.env)
```env
VITE_API_URL=http://localhost:3001
```

### 3. Configure OAuth Credentials

#### Google OAuth Setup
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:3001/auth/google/callback`
   - `https://your-production-url.com/auth/google/callback`

#### GitHub OAuth Setup
1. Visit [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL:
   - `http://localhost:3001/auth/github/callback`
   - `https://your-production-url.com/auth/github/callback`

#### Telegram Bot Setup
1. Open Telegram, search for @BotFather
2. Send `/newbot` and follow instructions
3. Copy the bot token provided

### 4. Start MongoDB

```bash
# Using MongoDB local
mongod

# OR using MongoDB Atlas (set MONGODB_URI in .env)
```

### 5. Run Development Servers

**Terminal 1 - API Server:**
```bash
cd api
npm run dev
# Server starts at http://localhost:3001
```

**Terminal 2 - Admin Dashboard:**
```bash
cd admin
npm run dev
# Dashboard opens at http://localhost:3000
```

---

## 📚 API Endpoints

### Authentication Routes
```
GET    /auth/google               Start Google OAuth flow
GET    /auth/google/callback      Google OAuth callback
GET    /auth/github               Start GitHub OAuth flow
GET    /auth/github/callback      GitHub OAuth callback
POST   /auth/logout               Logout user
GET    /auth/me                   Get current user (JWT required)
```

### User Management Routes (Protected)
```
GET    /users/pending             Get pending approval requests (Admin only)
GET    /users/approved            Get approved users (Admin only)
GET    /users/all                 Get all users (Admin only)
POST   /users/approve/:userId     Approve user (Admin only)
POST   /users/reject/:userId      Reject user (Admin only)
GET    /users/profile             Get current user profile
POST   /users/update              Update user profile
GET    /users/:id                 Get user by ID
```

### Weather Routes (Protected)
```
GET    /weather/alerts            Get user's weather alerts
POST   /weather/simulate-alert    Send test alert (Demo purpose)
GET    /weather/data/:city        Get weather data for city
```

---

## 🔐 Security Features

### Authentication & Authorization
- ✅ OAuth 2.0 (Google & GitHub) - No password storage
- ✅ JWT tokens - Secure API authentication
- ✅ Role-based access control (RBAC)
- ✅ Status validation - Only approved users get features

### Data Protection
- ✅ CORS enabled - Prevents unauthorized cross-origin requests
- ✅ Environment variables - Secrets not exposed
- ✅ Input validation - Class validators on all DTOs
- ✅ Mongoose indexes - Efficient & secure queries

### Alert Distribution
- ✅ Status filtering - Alerts only sent to `status='approved'`
- ✅ User preferences - Respects `receiveAlerts` flag
- ✅ Telegram ID verification - Chat ID required before alerts
- ✅ Admin approval gate - No automatic access granted

---

## 🎮 Demo Usage

### 1. **Social Login Flow**
- Navigate to http://localhost:3000
- Click "Sign in with Google" or "Sign in with GitHub"
- Authenticate with your account
- User record created with `status='pending'`

### 2. **Admin Approval Workflow**
- Use a pre-configured admin account (set in database)
- Log in as admin
- View "Pending Requests" tab
- Click "✅ Approve" to approve a user
- User receives Telegram approval notification

### 3. **Weather Alert System**
- Go to "Weather Alerts" tab
- Click "📨 Send Test Weather Alert"
- All approved users receive Telegram notification
- Alert marked as sent in database

---

## 🚀 Deployment

### Deploy API to Render/Railway

```bash
# Create account and connect GitHub repo
# Set environment variables in dashboard
# Deploy main/production branch
```

### Deploy Frontend to Vercel

```bash
# Connect GitHub repo to Vercel
# Vercel auto-detects Vite config
# Set VITE_API_URL to production API URL
```

---

## 📁 Project Structure

```
weatherguard-admin/
├── api/                          # NestJS Backend
│   ├── src/
│   │   ├── auth/                # Authentication module
│   │   ├── users/               # User management
│   │   ├── weather/             # Weather alerts
│   │   ├── telegram/            # Telegram integration
│   │   ├── schemas/             # MongoDB schemas
│   │   └── app.module.ts        # Root module
│   ├── .env                     # Environment variables
│   └── package.json
│
├── admin/                        # React Admin Dashboard
│   ├── src/
│   │   ├── api/                 # API client
│   │   ├── stores/              # Zustand stores
│   │   ├── pages/               # Page components
│   │   ├── components/          # Reusable components
│   │   └── App.tsx              # Main app
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## 🧪 Testing

### Test Pending User Approval
1. Create account via Google/GitHub
2. Log in as admin
3. Verify user in "Pending Requests"
4. Click approve
5. Original user should receive Telegram notification

### Test Weather Alert
1. Ensure user is approved with Telegram linked
2. Go to admin dashboard → Weather Alerts
3. Click "Send Test Alert"
4. Check user's Telegram for notification

---

## 🐛 Troubleshooting

### "Connection refused" on localhost:3001
- Ensure API server is running: `npm run dev` in `api/` folder

### OAuth login not working
- Verify callback URLs match exactly in Google/GitHub settings
- Check environment variables are set correctly
- Ensure frontend FRONTEND_URL matches admin port

### Telegram alerts not sending
- Verify TELEGRAM_BOT_TOKEN is correct
- Ensure user has `/start`'d bot and linked Telegram ID
- Check user status is 'approved' in database

### MongoDB connection error
- Verify MONGODB_URI is correct
- Ensure MongoDB is running (local or Atlas accessible)
- Check IP whitelist in MongoDB Atlas if using cloud

---

## 📝 Notes for Assessment

### Clean Architecture Highlights
- **Separation of Concerns**: Controllers, Services, Schemas clearly separated
- **Modular Design**: Auth, Users, Weather, Telegram as independent modules
- **Type Safety**: Full TypeScript with strict mode enabled
- **DTOs**: Input validation with class-validators
- **State Management**: Zustand for predictable React state

### Data Flow Integrity
- Users only receive alerts if `status='approved'`
- Comprehensive authorization checks on all admin routes
- Telegram integration ensures user consent before alerts

### Startup Pragmatism
- Minimal dependencies - only what's needed
- Easy local setup without Docker
- Simulated weather alerts for quick testing
- Clear error handling and logging

---

## 📄 License

MIT License - Feel free to use for assessment and learning purposes.

---

## 🤝 Support

For questions or issues during setup, please create a GitHub issue or reach out directly.

**Built with ❤️ for AI47 Labs Assessment**
