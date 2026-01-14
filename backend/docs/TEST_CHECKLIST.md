# End-to-End Test Checklist

## Test Environment Setup

- [ ] Copy `.env.test` to `.env`
- [ ] Verify `MOCK_MODE=true` is set
- [ ] Start PostgreSQL database
- [ ] Start Redis server
- [ ] Run `npm install`
- [ ] Run `npm run prisma:generate`
- [ ] Run `npm run prisma:migrate`
- [ ] Start server with `npm run dev`
- [ ] Verify server starts on port 4000
- [ ] Check logs show `[MOCK]` prefixes

---

## 1️⃣ Authentication Flow

### SSO Login (Mock)

- [ ] Navigate to `http://localhost:4000/api/v1/auth/login`
- [ ] Should redirect (mock SSO)
- [ ] Verify no errors in console

### Token Generation

- [ ] Call `/auth/callback` with mock SAML data
- [ ] Receive `accessToken` and `refreshToken`
- [ ] Tokens are valid JWT format
- [ ] User created in database

### Token Refresh

- [ ] Call `/auth/refresh` with refresh token
- [ ] Receive new access token
- [ ] Old token still works until expiry

### Logout

- [ ] Call `/auth/logout` with access token
- [ ] Refresh token removed from Redis
- [ ] Subsequent refresh attempts fail

---

## 2️⃣ User Profile

### Get Profile

- [ ] Call `/auth/me` with access token
- [ ] Receive user profile with GPA, credits, AI points
- [ ] Data matches mock student data

### Update Profile

- [ ] Call `PUT /auth/me` with new firstName/lastName
- [ ] Profile updated successfully
- [ ] Changes reflected in GET request

---

## 3️⃣ Schedule & Timetable

### Weekly Schedule

- [ ] Call `/schedule/weekly`
- [ ] Receive schedule grouped by day (0-6)
- [ ] Each class has: course, time, room, building, professor
- [ ] Response cached (second call faster)

### Today's Schedule

- [ ] Call `/schedule/today`
- [ ] Receive only today's classes
- [ ] Correct day of week

---

## 4️⃣ Courses

### List Courses

- [ ] Call `/courses`
- [ ] Receive 4-5 enrolled courses
- [ ] Each has: code, name, credits, progress, grade
- [ ] Response cached

### Course Details

- [ ] Call `/courses/:courseId`
- [ ] Receive detailed course info
- [ ] Includes schedule times

---

## 5️⃣ Events

### List Events

- [ ] Call `/events`
- [ ] Receive upcoming events only (future dates)
- [ ] Each has: name, date, location, AI points
- [ ] Events sorted by date

### Event Details

- [ ] Call `/events/:eventId`
- [ ] Receive event with registration list
- [ ] Shows max attendees

### Register for Event

- [ ] Call `POST /events/:eventId/register`
- [ ] Registration successful
- [ ] Cannot register twice (409 error)
- [ ] Cannot register if event full

### My Registrations

- [ ] Call `/events/my/registrations`
- [ ] See all registered events
- [ ] Sorted by registration date

---

## 6️⃣ AI Chat (6 Bots)

### Campus Assistant

- [ ] Create session: `POST /ai-chat/sessions` with `botType: "campus"`
- [ ] Receive welcome message
- [ ] Send message: "Where is the library?"
- [ ] Receive relevant response about library location
- [ ] Response time ~1 second (mock delay)

### Email Assistant

- [ ] Create session with `botType: "email"`
- [ ] Ask: "Help me write an email to my professor"
- [ ] Receive email template

### Wellness Bot

- [ ] Create session with `botType: "wellness"`
- [ ] Ask: "I'm feeling stressed"
- [ ] Receive stress management tips
- [ ] Response includes disclaimer about professional help

### Interview Instructor

- [ ] Create session with `botType: "interview"`
- [ ] Ask: "How do I answer 'tell me about yourself'?"
- [ ] Receive STAR method guidance

### Study Buddy

- [ ] Create session with `botType: "study"`
- [ ] Ask: "How should I study for exams?"
- [ ] Receive study techniques (Pomodoro, active recall)

### Career Advisor

- [ ] Create session with `botType: "career"`
- [ ] Ask: "How do I find internships?"
- [ ] Receive career advice

### Chat History

- [ ] Call `/ai-chat/sessions/:sessionId/messages`
- [ ] Receive all messages in order
- [ ] User and assistant messages alternating

### User Sessions

- [ ] Call `/ai-chat/sessions`
- [ ] See all chat sessions
- [ ] Each shows last message preview

---

## 7️⃣ Tools

### Room Booking

- [ ] Call `POST /tools/room-booking`
- [ ] Body: `{ roomName, bookingDate, startTime, endTime }`
- [ ] Booking created successfully
- [ ] Cannot double-book same room/time (409 error)

### Get Bookings

- [ ] Call `GET /tools/room-booking`
- [ ] See all user's bookings
- [ ] Sorted by date

### Print Job Submission

- [ ] Call `POST /tools/print-jobs`
- [ ] Body: `{ fileName, location, copies, pages, color, duplex }`
- [ ] Job created with cost calculation
- [ ] B&W: €0.05/page, Color: €0.20/page
- [ ] Duplex reduces pages by half

### Get Print Jobs

- [ ] Call `GET /tools/print-jobs`
- [ ] See all user's print jobs
- [ ] Each has job ID, status, cost

---

## 8️⃣ AI Points & Rewards

### List Activities

- [ ] Call `/rewards/activities`
- [ ] Receive upcoming and completed activities
- [ ] Each has: name, points, date, category

### Get User Points

- [ ] Call `/rewards/points`
- [ ] Receive total AI points
- [ ] See earned points history

### Register for Activity

- [ ] Call `POST /rewards/activities/:activityId/register`
- [ ] Registration successful
- [ ] Cannot register twice

### List Rewards

- [ ] Call `/rewards/rewards`
- [ ] See available rewards
- [ ] Each has: name, cost, icon

### Redeem Reward

- [ ] Call `POST /rewards/rewards/:rewardId/redeem`
- [ ] Redemption successful if enough points
- [ ] Points deducted from user
- [ ] Fails if insufficient points (400 error)

---

## 9️⃣ Error Handling

### 401 Unauthorized

- [ ] Call protected endpoint without token
- [ ] Receive 401 error
- [ ] Error message: "No token provided"

### 401 Invalid Token

- [ ] Call with invalid/expired token
- [ ] Receive 401 error
- [ ] Error message: "Invalid or expired token"

### 403 Forbidden

- [ ] Call admin endpoint as student
- [ ] Receive 403 error
- [ ] Error message: "Insufficient permissions"

### 404 Not Found

- [ ] Call `/api/v1/nonexistent`
- [ ] Receive 404 error
- [ ] Error message shows route not found

### 429 Rate Limit

- [ ] Make 1000+ requests in 1 minute
- [ ] Receive 429 error
- [ ] Error message: "Too many requests"

### 500 Server Error (Simulated)

- [ ] Set `MOCK_FAILURE_RATE=0.5` in `.env`
- [ ] Call any endpoint multiple times
- [ ] Some requests fail with 500 error
- [ ] Error logged in console

---

## 🔟 Performance & Caching

### Cache Hit

- [ ] Call `/courses` first time (cache miss)
- [ ] Call `/courses` second time (cache hit)
- [ ] Second call faster (<50ms)
- [ ] Check logs for cache hit message

### Cache Invalidation

- [ ] Call `/courses` (cached)
- [ ] Update course enrollment
- [ ] Call `/courses` again
- [ ] Receive updated data (cache invalidated)

### Response Times

- [ ] All endpoints respond in <2 seconds
- [ ] Mock delay configurable via `MOCK_DELAY_MS`
- [ ] AI chat responses ~1 second

---

## 1️⃣1️⃣ Edge Cases

### Empty States

- [ ] New user with no courses
- [ ] No events registered
- [ ] No chat sessions
- [ ] All return empty arrays `[]`

### Invalid Data

- [ ] Send invalid courseId
- [ ] Receive 404 error
- [ ] Send malformed JSON
- [ ] Receive 400 validation error

### Concurrent Requests

- [ ] Make 10 simultaneous requests
- [ ] All succeed
- [ ] No race conditions

### Large Payloads

- [ ] Send very long chat message (1000+ chars)
- [ ] Message saved and processed
- [ ] Response generated

---

## 1️⃣2️⃣ Logging & Monitoring

### Log Levels

- [ ] Set `LOG_LEVEL=debug`
- [ ] See detailed logs with SQL queries
- [ ] Set `LOG_LEVEL=error`
- [ ] See only errors

### Mock Mode Indicators

- [ ] All mock API calls show `[MOCK]` prefix
- [ ] Easy to identify mock vs real calls

### Error Logging

- [ ] Trigger 500 error
- [ ] Error logged with stack trace
- [ ] Error details in `logs/error.log`

---

## 1️⃣3️⃣ Database

### Data Persistence

- [ ] Create user via SSO
- [ ] Restart server
- [ ] User still exists in database

### Transactions

- [ ] Redeem reward (deducts points)
- [ ] If error occurs, points not deducted
- [ ] Transaction rolled back

---

## 1️⃣4️⃣ Security

### CORS

- [ ] Request from `http://localhost:3000` - allowed
- [ ] Request from `http://evil.com` - blocked

### SQL Injection

- [ ] Try SQL injection in courseId: `'; DROP TABLE users--`
- [ ] Request fails safely
- [ ] No database damage

### XSS Prevention

- [ ] Send message with `<script>alert('xss')</script>`
- [ ] Stored safely
- [ ] Not executed

---

## ✅ Success Criteria

- [ ] All 100+ test cases pass
- [ ] No API keys required (MOCK_MODE)
- [ ] App fully functional end-to-end
- [ ] Response times acceptable
- [ ] No crashes or unhandled errors
- [ ] Logs are clean and informative
- [ ] Ready for stakeholder demo

---

## 🚀 Demo Readiness

- [ ] Server starts without errors
- [ ] All endpoints respond
- [ ] Mock data looks realistic
- [ ] AI chat responses make sense
- [ ] No "Lorem ipsum" or placeholder text
- [ ] UI would show proper loading states
- [ ] Error messages are user-friendly
