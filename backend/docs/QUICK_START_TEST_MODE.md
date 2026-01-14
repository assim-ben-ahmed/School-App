# Quick Start Guide - Test Mode

## 🚀 Get Started in 5 Minutes

This guide will get you running the app in **TEST MODE** without any real API keys.

---

## Prerequisites

- Node.js 20+
- PostgreSQL 15+ (or use SQLite for testing)
- Redis 7+

---

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

---

## Step 2: Configure Environment

```bash
# Copy test environment
cp .env.test .env

# Verify MOCK_MODE is enabled
cat .env | grep MOCK_MODE
# Should show: MOCK_MODE=true
```

---

## Step 3: Set Up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

---

## Step 4: Start Server

```bash
npm run dev
```

You should see:
```
🚀 Server is running on port 4000
📝 Environment: development
🔗 API: http://localhost:4000/api/v1
Database connected successfully
Redis connected successfully
```

---

## Step 5: Test the API

### Health Check
```bash
curl http://localhost:4000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-12T12:00:00.000Z"
}
```

### Get Mock Courses
```bash
# First, you need an access token
# For testing, create a mock user and generate token
# Or use the test endpoints below
```

---

## 🧪 Test Endpoints (No Auth Required in Mock Mode)

### Option 1: Use Postman/Insomnia

Import this collection:
- Base URL: `http://localhost:4000/api/v1`
- All endpoints documented in `docs/TEST_CHECKLIST.md`

### Option 2: Use cURL

```bash
# Example: Get courses (requires auth token)
# First, mock login to get token
curl -X POST http://localhost:4000/api/v1/auth/callback \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STU2024001",
    "email": "john.doe@aivancity.edu",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Save the accessToken from response

# Then use it:
curl -X GET http://localhost:4000/api/v1/courses \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📊 Mock Data Available

The following mock data is pre-configured:

- **3 Students** (STU2024001, STU2024002, STU2024003)
- **5 Courses** (CS301, DS201, AI401, CS202, DS301)
- **6 Schedule items** (Monday-Friday classes)
- **5 Events** (Symposium, Hackathon, Career Fair, etc.)
- **3 Assignments** with due dates
- **4 Grades** (A, A-, B+)
- **3 Announcements**
- **4 Notifications**
- **3 AI Points Activities**
- **4 Rewards** (Coffee, Priority Registration, etc.)

---

## 🤖 Test AI Chat (No OpenAI Key Needed)

```bash
# Create chat session
curl -X POST http://localhost:4000/api/v1/ai-chat/sessions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"botType": "campus"}'

# Send message
curl -X POST http://localhost:4000/api/v1/ai-chat/sessions/SESSION_ID/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Where is the library?"}'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "role": "assistant",
    "content": "The library is located in the main building, open from 8 AM to 10 PM daily..."
  }
}
```

---

## ⚙️ Configuration Options

### Adjust Mock Delay
```bash
# In .env
MOCK_DELAY_MS=500  # Default: 500ms
```

### Simulate Failures
```bash
# In .env
MOCK_FAILURE_RATE=0.1  # 10% of requests will fail
```

### Disable Mock Mode (Use Real APIs)
```bash
# In .env
MOCK_MODE=false

# Then add real API keys:
OPENAI_API_KEY=sk-...
BLACKBOARD_API_URL=https://...
# etc.
```

---

## 🐛 Troubleshooting

### Server won't start
- Check PostgreSQL is running: `psql -U user -d studentapp_test`
- Check Redis is running: `redis-cli ping`
- Check port 4000 is available: `lsof -i :4000`

### Database errors
```bash
# Reset database
npm run prisma:migrate reset

# Regenerate client
npm run prisma:generate
```

### Redis connection failed
```bash
# Start Redis
redis-server

# Or use Docker
docker run -d -p 6379:6379 redis:7-alpine
```

---

## 📚 Next Steps

1. **Run Test Checklist**: See `docs/TEST_CHECKLIST.md`
2. **Explore API**: See `docs/AUTHENTICATION.md`, `docs/ADAPTERS.md`
3. **Build Frontend**: Connect your React/Next.js app
4. **Deploy**: See main README for deployment guide

---

## 🎯 Demo Mode

For stakeholder demos:

```bash
# Set realistic delays
MOCK_DELAY_MS=300

# No failures
MOCK_FAILURE_RATE=0.0

# Debug logging
LOG_LEVEL=info
```

---

## ✅ Verification

Run this command to verify everything works:

```bash
# Test all endpoints
npm test  # (when tests are implemented)

# Or manually test key endpoints:
curl http://localhost:4000/health
curl http://localhost:4000/api/v1/schedule/weekly -H "Authorization: Bearer TOKEN"
curl http://localhost:4000/api/v1/courses -H "Authorization: Bearer TOKEN"
```

---

## 🚀 You're Ready!

The app is now running in **TEST MODE** with:
- ✅ No real API keys needed
- ✅ Realistic mock data
- ✅ All features functional
- ✅ Ready for demo

**Happy testing!** 🎉
