# Student App Backend

Production-ready backend for university student companion app built with Node.js, Express, TypeScript, and PostgreSQL.

## 🚀 Features

- **RESTful API** with Express.js and TypeScript
- **PostgreSQL Database** with Prisma ORM
- **JWT Authentication** with SSO support (SAML, OAuth2, Azure AD)
- **Redis Caching** for performance optimization
- **AI Chatbots** powered by OpenAI GPT-4 (6 specialized bots)
- **Rate Limiting** to prevent abuse
- **Comprehensive Error Handling** with custom error classes
- **Request Validation** with Zod schemas
- **Logging** with Winston
- **Security** with Helmet and CORS

## 📋 Prerequisites

- Node.js 20+ and npm 10+
- PostgreSQL 15+
- Redis 7+
- OpenAI API key (for AI chat features)

## 🛠️ Installation

1. **Clone the repository** (if not already done)

2. **Install dependencies:**
```bash
cd backend
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and configure:
- Database URL
- Redis URL
- JWT secrets
- SSO configuration
- External API credentials (Intranet, Blackboard)
- OpenAI API key

4. **Set up the database:**
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view/edit data
npm run prisma:studio
```

## 🏃 Running the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:4000` (or the port specified in `.env`).

## 📚 API Documentation

### Base URL
```
http://localhost:4000/api/v1
```

### Authentication
All endpoints (except `/health`) require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Schedule
- `GET /schedule/weekly` - Get weekly schedule
- `GET /schedule/today` - Get today's schedule

#### Courses
- `GET /courses` - Get user's enrolled courses
- `GET /courses/:courseId` - Get course details

#### Events
- `GET /events` - Get all upcoming events
- `GET /events/:eventId` - Get event details
- `POST /events/:eventId/register` - Register for an event
- `GET /events/my/registrations` - Get user's event registrations

#### AI Chat
- `POST /ai-chat/sessions` - Create new chat session
  - Body: `{ "botType": "campus" | "email" | "wellness" | "interview" | "study" | "career" }`
- `POST /ai-chat/sessions/:sessionId/messages` - Send message
  - Body: `{ "message": "your message" }`
- `GET /ai-chat/sessions/:sessionId/messages` - Get chat history
- `GET /ai-chat/sessions` - Get user's chat sessions

#### Tools
- `POST /tools/room-booking` - Book a room
  - Body: `{ "roomName": "Study Room A", "bookingDate": "2025-01-15", "startTime": "14:00", "endTime": "16:00" }`
- `GET /tools/room-booking` - Get user's bookings
- `POST /tools/print-jobs` - Submit print job
  - Body: `{ "fileName": "document.pdf", "location": "Library", "copies": 1, "pages": 5, "color": false, "duplex": true }`
- `GET /tools/print-jobs` - Get user's print jobs

#### Rewards (AI Points)
- `GET /rewards/activities` - Get all AI Points activities
- `GET /rewards/points` - Get user's AI Points
- `POST /rewards/activities/:activityId/register` - Register for activity
- `GET /rewards/rewards` - Get available rewards
- `POST /rewards/rewards/:rewardId/redeem` - Redeem reward

## 🗄️ Database Schema

The database includes the following main tables:
- **users** - Student accounts
- **courses** - Course catalog
- **user_courses** - Course enrollments
- **schedules** - Class schedules
- **events** - Campus events
- **event_registrations** - Event registrations
- **conversations** & **messages** - Messaging system
- **notifications** - User notifications
- **ai_chat_sessions** & **ai_chat_messages** - AI chat history
- **room_bookings** - Room reservations
- **print_jobs** - Print job submissions
- **ai_points_activities** - Activities for earning points
- **rewards** & **reward_redemptions** - Rewards system

## 🔒 Security Features

- **Helmet.js** - Sets security HTTP headers
- **CORS** - Configured for frontend domain only
- **Rate Limiting** - 100 requests/minute (general), 5 requests/15min (auth), 20 messages/minute (AI chat)
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Zod schemas for all inputs
- **SQL Injection Prevention** - Prisma ORM with parameterized queries
- **Error Handling** - No sensitive data in error responses

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Project Structure

```
backend/
├── src/
│   ├── api/
│   │   ├── middleware/      # Auth, validation, rate limiting, error handling
│   │   └── routes/          # API route definitions
│   ├── config/              # Configuration files
│   ├── database/            # Prisma client
│   ├── services/            # Business logic
│   ├── utils/               # Utilities (logger, cache, errors)
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
├── prisma/
│   └── schema.prisma        # Database schema
├── logs/                    # Log files
├── .env                     # Environment variables
├── package.json
└── tsconfig.json
```

## 🚢 Deployment

See the main project README for Docker deployment instructions.

## 📝 License

MIT
