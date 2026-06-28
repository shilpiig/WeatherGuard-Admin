# WeatherGuard Admin - Demo Video Script

Create a 2-minute Loom/YouTube video following this script. This demonstrates the complete workflow.

## 📹 Video Structure (2 Minutes)

### Scene 1: Introduction (0:00-0:15)
**What to show:**
- Open terminal showing both servers running
- Show WeatherGuard login page

**Script:**
> "Hello, I'm demonstrating WeatherGuard Admin, a secure weather alert service. This application allows admins to manage user access and send weather alerts through Telegram."

---

### Scene 2: Social Login & Access Request (0:15-0:45)
**What to do:**
1. Click "Sign in with Google" button
2. Complete Google OAuth login
3. Show the "Pending Approval" screen
4. Take a screenshot of your email/chat ID

**Script:**
> "First, I'll sign up using my Google account. This creates a new user record in the system with a 'Pending' status. Notice that the app displays my email and status, and explains that admin approval is required to access the system. The user receives no special privileges until they're approved."

**Show on screen:**
- Login page with OAuth buttons
- Google authentication flow
- Pending Approval message with user details

---

### Scene 3: Admin Dashboard - Viewing Pending Requests (0:45-1:15)
**What to do:**
1. In MongoDB, update the first user to admin + approved
2. Log out and login again
3. Show admin dashboard
4. Click "📋 Pending Requests" tab
5. Show the recently created user in pending list

**MongoDB Update Command:**
```javascript
db.users.updateOne(
  { email: "your-admin-email@gmail.com" },
  { $set: { status: "approved", role: "admin" } }
)
```

**Script:**
> "Now I'll log in as an admin who has already been approved. Here's the admin dashboard showing pending access requests. I can see the user who just signed up. The dashboard displays their name, email, and profile picture from their OAuth provider. As an admin, I can approve or reject this user."

**Show on screen:**
- Admin dashboard header with user info
- "Pending Requests" tab
- List of pending users with approve/reject buttons
- User details from OAuth

---

### Scene 4: Admin Approval Action (1:15-1:35)
**What to do:**
1. Click the "✅ Approve" button on the pending user
2. Show the success message
3. Switch to the "✅ Approved Users" tab to show user was moved

**Script:**
> "When I click Approve, the system immediately updates the user's status. The user will receive a Telegram notification confirming their approval. They can now access full features and receive weather alerts. Here I can see the user has been moved to the Approved Users list."

**Show on screen:**
- Click approve action
- Success notification
- Switch to "Approved Users" tab
- Show the approved user in the list

---

### Scene 5: Telegram Notification & Weather Alert (1:35-2:00)
**What to do:**
1. Go to the "🌦️ Weather Alerts" tab
2. Click "📨 Send Test Weather Alert" button
3. Show success message
4. Show your Telegram chat with the alert notification (if possible)

**Script:**
> "Now, let's test the weather alert system. When I click 'Send Test Weather Alert', the system sends a notification to all approved users who have linked their Telegram accounts. The alert includes the city, alert type, temperature, and description. This system runs on a schedule and automatically sends weather updates to users based on their preferences."

**Show on screen:**
- Weather Alerts tab
- Send Test Alert button click
- Success notification
- Telegram message received (screenshot if needed)
- Show the alert message content

**Sample Telegram Alert Message:**
```
⚠️ Weather Alert for London

Type: Heavy Rain
Temperature: 12°C
Description: Heavy rainfall expected in the next 2 hours
```

---

### Scene 6: Summary (1:55-2:00)
**Script:**
> "That's a complete demonstration of WeatherGuard Admin. The system securely manages user access through social login, provides an intuitive admin interface for approval workflow, and delivers real-time weather alerts via Telegram. The architecture is modular, type-safe with TypeScript, and ready for production deployment."

**Show on screen:**
- Dashboard overview
- Fade to logo/end screen

---

## 🎥 Video Recording Tips

### Technical Setup
- **Tool**: Loom, OBS, or ScreenFlow
- **Resolution**: 1920x1080 (1080p) minimum
- **FPS**: 30 FPS
- **Mic**: Clear, no background noise

### Before Recording
1. Set up two terminals (API + Admin running)
2. Have MongoDB running
3. Test all OAuth flows beforehand
4. Have Telegram app open to receive notifications
5. Create 2-3 test user accounts in advance

### Recording Best Practices
- Slow down mouse movements so viewers can follow
- Pause briefly on important screens
- Use keyboard shortcuts where possible
- Speak clearly and at moderate pace
- Keep zoom level at 100% for readability

### Post-Recording
1. Edit to exactly 2 minutes
2. Add title card (0:00-0:03)
3. Add captions/subtitles
4. Highlight important UI elements with annotations
5. Add background music (optional, keep low volume)
6. Upload to YouTube or Loom

---

## 📝 Key Points to Emphasize

1. **Security**: Social login, JWT tokens, approval gates
2. **Modular Architecture**: Separate controllers, services, schemas
3. **Type Safety**: TypeScript throughout
4. **Integration**: Seamless OAuth + Telegram + MongoDB
5. **User Experience**: Clean, intuitive admin interface
6. **Automation**: Scheduled weather alert system

---

## 🎯 Alternative Demo Scenarios

### Scenario: User Rejection
After showing approval:
1. Show another pending user
2. Click "❌ Reject" button
3. "The user will receive a rejection notification on Telegram"
4. Show rejection message

### Scenario: Multiple Users
1. Create 3-4 test accounts beforehand
2. Show filtering by status
3. Approve some, reject others
4. Show the approved/rejected counts

### Scenario: Error Handling
1. Try to access dashboard without login
2. Show redirect to login
3. Demonstrate missing Telegram ID handling
4. Show proper error messages

---

## 📊 Demo Checklist

- [ ] Both servers running (API + Admin)
- [ ] MongoDB connected and working
- [ ] OAuth credentials configured
- [ ] Telegram bot token set and working
- [ ] Test user account ready
- [ ] Admin account created and set up
- [ ] Recording software configured
- [ ] Microphone tested and working
- [ ] Screen brightness/contrast good
- [ ] No sensitive info visible (API keys, tokens hidden)

---

## 🎬 Example Loom Settings

- **Video format**: MP4
- **Quality**: 1080p HD
- **Duration**: ~2 minutes
- **Captions**: Enabled
- **Comments**: Disabled for final video
- **Sharing**: Public link

---

## 📤 After Recording

1. **Edit** - Trim to exactly 2 minutes
2. **Upload** - To YouTube or Loom
3. **Add metadata**:
   - Title: "WeatherGuard Admin - Demo"
   - Description: Links to GitHub repo + setup guide
   - Tags: admin, weather, alerts, telegram, nestjs, react
4. **Share link** in reply to the assessment email

---

## 🔗 Links to Include in Video Description

- GitHub Repo: `https://github.com/your-username/weatherguard-admin`
- README: Setup instructions and architecture docs
- Live Demo (if deployed): Production URL
- Tech Stack: NestJS, React, MongoDB, Telegram

---

## 💡 Pro Tips

- Practice once before final recording
- Record at least 2-3 takes for the best result
- Speak with confidence and enthusiasm
- Pause dramatically when showing important features
- End with clear call-to-action or summary

---

Created for: **AI47 Labs Assessment**
Demo System: **WeatherGuard Admin**
Duration: **~2 minutes**

Good luck! 🎥✨
