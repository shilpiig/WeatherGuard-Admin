# WeatherGuard Admin - Architecture Documentation

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │   React Admin Dashboard (Port 3000)                      │  │
│  │   - Login pages (Google/GitHub OAuth)                    │  │
│  │   - User management interface                            │  │
│  │   - Weather alert system                                 │  │
│  │   - State management (Zustand)                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕️ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │      NestJS API Server (Port 3001)                       │  │
│  │                                                          │  │
│  │  ┌─── AUTH MODULE ────────────────────────────────────┐ │  │
│  │  │  • Google OAuth Strategy                           │ │  │
│  │  │  • GitHub OAuth Strategy                           │ │  │
│  │  │  • JWT Strategy                                    │ │  │
│  │  │  • Auth Controller & Service                       │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ┌─── USERS MODULE ───────────────────────────────────┐ │  │
│  │  │  • User Controller (endpoints)                     │ │  │
│  │  │  • User Service (business logic)                   │ │  │
│  │  │  • User DTOs (validation)                          │ │  │
│  │  │  • Role-based authorization                        │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ┌─── WEATHER MODULE ─────────────────────────────────┐ │  │
│  │  │  • Weather Service                                 │ │  │
│  │  │  • Weather Controller                              │ │  │
│  │  │  • Cron scheduler (every 30 min)                   │ │  │
│  │  │  • Alert distribution logic                        │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ┌─── TELEGRAM MODULE ────────────────────────────────┐ │  │
│  │  │  • Telegram Service                                │ │  │
│  │  │  • Bot initialization                              │ │  │
│  │  │  • Message sending                                 │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ┌─── DATABASE SCHEMAS ───────────────────────────────┐ │  │
│  │  │  • User Schema (with status & role)                │ │  │
│  │  │  • WeatherAlert Schema                             │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕️ Driver
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  MongoDB (Port 27017)                                    │  │
│  │  ├── users (documents with status: pending|approved)     │  │
│  │  └── weatheralerts (sent & pending alerts)               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕️ HTTP
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│  ├── Google OAuth API                                            │
│  ├── GitHub OAuth API                                            │
│  ├── Telegram Bot API                                            │
│  └── OpenWeather API (optional)                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### User Registration & Approval Flow

```
USER SIGNUP
    ↓
┌─────────────────────────────────────────────────┐
│ 1. Click OAuth Button                           │
│    - Navigate to /auth/google or /auth/github   │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 2. OAuth Provider                               │
│    - User authenticates with Google/GitHub      │
│    - Provider returns authorization code        │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 3. Backend OAuth Callback                       │
│    - Exchange code for access token             │
│    - Fetch user profile (email, name, avatar)   │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 4. User Service                                 │
│    - Check if user exists by email              │
│    - If NO: Create new user with status:        │
│      "pending" and role: "user"                 │
│    - If YES: Return existing user               │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 5. Generate JWT Token                           │
│    - Sign token with user ID, email, role       │
│    - Token expires in 7 days                    │
│    - Return token & user data to frontend       │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 6. Frontend                                     │
│    - Store token in cookies                     │
│    - Redirect based on user status:             │
│      * If pending → /pending-approval           │
│      * If approved & admin → /dashboard         │
│      * If approved & user → /pending-approval   │
└─────────────────────────────────────────────────┘
    ↓
[WAITING FOR ADMIN APPROVAL]

ADMIN APPROVAL
    ↓
┌─────────────────────────────────────────────────┐
│ 1. Admin Login                                  │
│    - Admin user already has status: "approved"  │
│    - Admin user already has role: "admin"       │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 2. Admin Dashboard                              │
│    - Fetch GET /users/pending                   │
│    - Display all pending users                  │
│    - Admin sees user details & photos           │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 3. Admin Clicks Approve                         │
│    - Send POST /users/approve/:userId           │
│    - Backend updates user in MongoDB:           │
│      {status: "approved", approvedAt: now,      │
│       approvedBy: admin_id}                     │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 4. Telegram Notification (Optional)             │
│    - If user has telegramChatId:                │
│    - Send approval message via Telegram bot     │
│    - User receives: ✅ "Access Approved"        │
└─────────────────────────────────────────────────┘
    ↓
[USER CAN NOW RECEIVE WEATHER ALERTS]
```

### Weather Alert Distribution Flow

```
ALERT GENERATION
    ↓
┌─────────────────────────────────────────────────┐
│ 1. Create Alert (Admin or Automatic)            │
│    - POST /weather/simulate-alert               │
│    - Insert document into WeatherAlert:         │
│      {userId, city, alertType, temperature,     │
│       sent: false, active: true}                │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 2. Scheduler Runs (Every 30 minutes)            │
│    - @Cron decorator triggers checkWeather()    │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 3. Find Pending Alerts                          │
│    - Query: {sent: false, active: true}         │
│    - Returns unsent weather alerts              │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 4. For Each Alert (CRITICAL FILTERS)            │
│    - Fetch User by userId                       │
│    - FILTER 1: Check user.status === "approved" │
│      If false → Skip, alert stays pending       │
│    - FILTER 2: Check user.receiveAlerts === true│
│      If false → Skip, alert stays pending       │
│    - FILTER 3: Check user.telegramChatId exists │
│      If false → Skip, alert stays pending       │
│    - ALL FILTERS PASS → Proceed to send         │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 5. Send Telegram Message                        │
│    - Call telegraf.telegram.sendMessage()       │
│    - Message: "⚠️ Weather Alert for {city}"     │
│    - Include: type, temp, description           │
│    - Receive: Telegram message ID               │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 6. Update Alert Status                          │
│    - MongoDB update:                            │
│      {sent: true, sentAt: now,                  │
│       telegramMessageId: msg_id}                │
│    - Alert will NOT be sent again               │
└─────────────────────────────────────────────────┘
    ↓
[ALERT DELIVERY COMPLETE]

NOTE: If user status changes to "rejected" or
"pending" AFTER alert was queued, the alert
distribution will skip them due to filters.
```

### API Request Flow (Authentication)

```
CLIENT REQUEST
    ↓
┌─────────────────────────────────────────────────┐
│ 1. Client Sends Request with JWT               │
│    - Header: Authorization: Bearer {JWT_TOKEN}  │
│    - Example: GET /users/pending                │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 2. @UseGuards(AuthGuard('jwt'))                 │
│    - NestJS middleware intercepts request       │
│    - Extracts token from Authorization header   │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 3. JWT Strategy Validates Token                 │
│    - Verify token signature using JWT_SECRET    │
│    - Check token expiration (7 days)            │
│    - Extract payload: {sub, email, role}        │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 4. User Service Fetches User                    │
│    - Query MongoDB: db.users.findById(sub)      │
│    - Attach user to req.user                    │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 5. Controller Check (Optional)                  │
│    - if (req.user.role !== 'admin') 403        │
│    - Only admins access certain endpoints       │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ 6. Execute Service Logic                        │
│    - Perform requested operation                │
│    - Return response data                       │
└─────────────────────────────────────────────────┘
    ↓
[RESPONSE SENT TO CLIENT]
```

---

## 📊 Database Schema Relationships

```
USERS Collection
┌────────────────────────────────────────┐
│ _id: ObjectId (Primary Key)            │
│ email: string (Unique)                 │
│ firstName: string                      │
│ lastName: string                       │
│ provider: 'google' | 'github'          │
│ providerId: string (Unique)            │
│ status: 'pending'|'approved'|'rejected'│ ← KEY FOR ACCESS
│ role: 'user' | 'admin'                 │ ← KEY FOR AUTHORIZATION
│ profilePicture: string (optional)      │
│ telegramChatId: string (optional)      │ ← REQUIRED FOR ALERTS
│ telegramUsername: string (optional)    │
│ receiveAlerts: boolean (default: true) │ ← FILTER FOR DISTRIBUTION
│ preferences: {                         │
│   cities: string[],                    │
│   alertTypes: string[],                │
│   language: string                     │
│ }                                      │
│ approvedAt: Date (optional)            │
│ approvedBy: string (admin_id)          │
│ rejectedAt: Date (optional)            │
│ rejectedBy: string (admin_id)          │
│ createdAt: Date                        │
│ updatedAt: Date                        │
└────────────────────────────────────────┘
         │
         │ References
         ↓
WEATHER_ALERTS Collection
┌────────────────────────────────────────┐
│ _id: ObjectId (Primary Key)            │
│ userId: ObjectId (Foreign Key) → Users │ ← LINKS TO USER
│ city: string                           │
│ alertType: string                      │
│ temperature: number                    │
│ description: string                    │
│ severity: 'low'|'medium'|'high'        │
│ sent: boolean                          │ ← DISTRIBUTION FLAG
│ sentAt: Date (optional)                │
│ telegramMessageId: string (optional)   │
│ active: boolean (default: true)        │
│ createdAt: Date                        │
│ updatedAt: Date                        │
└────────────────────────────────────────┘
```

---

## 🔐 Security Layers

### Layer 1: Authentication
- OAuth 2.0 (Google/GitHub) - No passwords stored
- JWT tokens - Secure API authentication
- Token expiration - 7 days

### Layer 2: Authorization
```typescript
// Endpoint protection example
@Post('approve/:userId')
@UseGuards(AuthGuard('jwt'))  // Layer 1: Must be logged in
async approveUser(@Req() req) {
  if (req.user.role !== 'admin')  // Layer 2: Must be admin
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  // ... continue
}
```

### Layer 3: Data Access Control
```typescript
// Only approved users receive alerts
const pendingAlerts = await this.weatherAlertModel
  .find({ sent: false, active: true });

for (const alert of pendingAlerts) {
  const user = await this.userModel.findById(alert.userId);
  
  // CRITICAL CHECKS:
  if (user.status !== 'approved') continue;      // Only approved
  if (!user.receiveAlerts) continue;             // Consent check
  if (!user.telegramChatId) continue;            // Chat ID required
  
  // Send alert only if all checks pass
  await this.telegramService.sendWeatherAlert(...);
}
```

### Layer 4: Input Validation
```typescript
// DTO validation example
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;
  
  @IsOptional()
  @IsArray()
  cities?: string[];
  // Validates before reaching controller
}
```

---

## 🎯 Key Architecture Decisions

### 1. **Modular Design**
- Each feature (Auth, Users, Weather, Telegram) is a separate module
- Easy to test, maintain, and extend
- Follows NestJS best practices

### 2. **Type Safety**
- Full TypeScript with strict mode
- DTOs for request validation
- Mongoose schemas with TypeScript classes

### 3. **Separation of Concerns**
- Controllers handle HTTP
- Services handle business logic
- Schemas handle data structure
- Strategies handle authentication

### 4. **Two-Stage Approval**
- User creates account (status: pending)
- Admin must explicitly approve (status: approved)
- This prevents unauthorized access

### 5. **Scheduled Tasks**
- Cron job every 30 minutes
- Checks for pending alerts
- Only sends to approved users
- Maintains data consistency

### 6. **External Integration**
- OAuth through Passport.js
- Telegram through Telegraf
- Extensible for weather APIs

---

## 📈 Scalability Considerations

### Current Implementation
- Single-threaded Node.js
- Local MongoDB
- No caching layer

### For Production Scaling
- Add Redis for caching
- Use Bull/BullMQ for job queues
- Horizontal scaling with load balancer
- Database replication and sharding
- CDN for frontend assets

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// Example: User service approval logic
describe('UsersService.approveUser', () => {
  it('should update user status to approved', async () => {
    // Arrange
    const userId = '123';
    const adminId = '456';
    
    // Act
    const result = await usersService.approveUser(userId, adminId);
    
    // Assert
    expect(result.status).toBe('approved');
    expect(result.approvedBy).toBe(adminId);
  });
});
```

### Integration Tests
```typescript
// Example: Full approval flow
describe('User Approval Flow', () => {
  it('should send Telegram notification on approval', async () => {
    // 1. Create pending user
    // 2. Approve user
    // 3. Verify Telegram message sent
    // 4. Verify database updated
  });
});
```

---

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [Passport.js Strategies](http://www.passportjs.org/)
- [Telegraf Documentation](https://telegraf.js.org/)
- [React Best Practices](https://react.dev/)

---

This architecture prioritizes security, maintainability, and scalability while remaining pragmatic for a startup environment.
