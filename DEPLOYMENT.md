# WeatherGuard Admin - Deployment Guide

Deploy WeatherGuard to production platforms with these step-by-step guides.

## 🚀 Deployment Platforms

### Option 1: Deploy to Render (Recommended)

#### Step 1: Prepare Repository

```bash
git push origin main
```

#### Step 2: Deploy Backend API

1. Visit [Render Dashboard](https://dashboard.render.com/)
2. Click "New+" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: weatherguard-api
   - **Environment**: Docker
   - **Plan**: Free/Paid (Free has limitations)
   - **Auto-Deploy**: Yes (from main branch)

5. Add Environment Variables:
```
MONGODB_URI: mongodb+srv://user:pass@cluster.mongodb.net/weatherguard
JWT_SECRET: your-secure-secret-key
GOOGLE_CLIENT_ID: your-google-id
GOOGLE_CLIENT_SECRET: your-google-secret
GOOGLE_CALLBACK_URL: https://weatherguard-api.onrender.com/auth/google/callback
GITHUB_CLIENT_ID: your-github-id
GITHUB_CLIENT_SECRET: your-github-secret
GITHUB_CALLBACK_URL: https://weatherguard-api.onrender.com/auth/github/callback
TELEGRAM_BOT_TOKEN: your-telegram-token
FRONTEND_URL: https://weatherguard-admin.vercel.app
```

6. Deploy!

#### Step 3: Deploy Frontend to Vercel

1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: ./admin
   - **Build Command**: npm run build
   - **Output Directory**: dist

5. Add Environment Variables:
```
VITE_API_URL: https://weatherguard-api.onrender.com
```

6. Deploy!

---

### Option 2: Deploy to Railway

#### Step 1: Deploy MongoDB

1. Visit [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project" → "Provision MongoDB"
3. MongoDB is now ready with connection string

#### Step 2: Deploy API

1. Create a new service
2. Connect GitHub repository
3. Select `api` as root directory
4. Add environment variables (same as Render)
5. Railway will auto-detect the Dockerfile

#### Step 3: Deploy Frontend

1. Create another service
2. Connect same repository
3. Select `admin` as root directory
4. Set build command: `npm run build`
5. Set start command: `npm run preview`

---

### Option 3: Deploy with Docker Compose

#### Prerequisites
- Server with Docker & Docker Compose
- Domain name (SSL certificate)

#### Steps

1. **Update Production Environment**

Create `.env.prod`:
```
MONGODB_URI=mongodb://mongo:27017/weatherguard
JWT_SECRET=change-this-in-production
GOOGLE_CLIENT_ID=your-google-id
# ... other vars
```

2. **Run Production Stack**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **Setup Nginx Reverse Proxy** (optional)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://admin:80;
    }
    
    location /api/ {
        proxy_pass http://api:3001/;
    }
}
```

---

## 🗄️ MongoDB Atlas Setup

### Create Cluster

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/Login
3. Create a new project
4. Create a M0 cluster (free tier)
5. Create a database user
6. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/weatherguard`

### Setup Collections

Connect with MongoDB Compass or mongosh:

```javascript
// Create users collection
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "firstName", "lastName", "provider", "providerId"],
      properties: {
        email: { bsonType: "string" },
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        status: { enum: ["pending", "approved", "rejected"] },
        role: { enum: ["user", "admin"] }
      }
    }
  }
});

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ providerId: 1 }, { unique: true });
db.users.createIndex({ status: 1 });

// Create weather_alerts collection
db.createCollection("weatheralerts");
db.weatheralerts.createIndex({ userId: 1 });
db.weatheralerts.createIndex({ sent: 1 });
```

---

## 🔐 Production Security Checklist

- [ ] Change all default credentials
- [ ] Enable HTTPS/SSL
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Restrict CORS to domain only
- [ ] Enable rate limiting
- [ ] Monitor logs for suspicious activity
- [ ] Regular backups of MongoDB
- [ ] Update dependencies regularly
- [ ] Enable 2FA on OAuth applications
- [ ] Use environment variables for all secrets

---

## 📊 Monitoring & Logs

### Render
- View logs: Dashboard → Service → Logs

### Railway
- View logs: Dashboard → Service → Logs

### Local Docker
```bash
docker logs weatherguard-api
docker logs weatherguard-admin
```

---

## 🔧 Post-Deployment Steps

### 1. Create Admin User

Connect to MongoDB and insert:
```javascript
db.users.insertOne({
  email: "admin@weatherguard.com",
  firstName: "Admin",
  lastName: "User",
  provider: "google",
  providerId: "admin-provider-id",
  status: "approved",
  role: "admin",
  telegramChatId: "your-telegram-id",
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### 2. Test OAuth Callbacks

1. Update Google/GitHub OAuth URLs to production URLs
2. Test social login flow
3. Verify callback redirects work

### 3. Setup Telegram Bot

1. Get bot token from @BotFather
2. Set webhook (optional for production):
```bash
curl -X POST https://api.telegram.org/bot<TOKEN>/setWebhook \
  -d url=https://yourdomain.com/telegram/webhook
```

---

## 🚨 Troubleshooting

### API won't start
- Check MongoDB connection string
- Verify all environment variables are set
- Check Docker logs for errors

### Frontend not connecting to API
- Verify VITE_API_URL is correct
- Check CORS is enabled in backend
- Verify OAuth callback URLs match

### Telegram bot not sending messages
- Verify TELEGRAM_BOT_TOKEN is correct
- Ensure user has `/start`'d bot
- Check user's Telegram chat ID is stored

---

## 💰 Cost Estimation (Monthly)

| Service | Free Tier | Paid |
|---------|-----------|------|
| Render (API) | $0 | $7+ |
| Vercel (Frontend) | Free | $20+ |
| MongoDB Atlas | 512MB | $10+ |
| Custom Domain | N/A | $10-15 |
| **Total** | **$0** | **$37+** |

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://railway.app/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Docker Documentation](https://docs.docker.com/)

---

Built with ❤️ for WeatherGuard Admin
