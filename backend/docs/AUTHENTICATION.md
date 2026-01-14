# Authentication System Documentation

## Overview

Complete authentication system with SSO support, JWT tokens, and secure session management.

---

## 🔐 Features

✅ **SSO Integration** - SAML 2.0 support for university SSO  
✅ **JWT Tokens** - Access and refresh token system  
✅ **Automatic Token Refresh** - Seamless token renewal  
✅ **Secure Logout** - Token revocation via Redis  
✅ **User Profile Management** - Get and update profile  
✅ **Role-Based Access Control** - Student/Admin roles  
✅ **Rate Limiting** - Protection against brute force  

---

## 📁 Files Created

```
backend/src/
├── services/
│   └── auth.service.ts          # Auth business logic
├── config/
│   └── passport.config.ts       # Passport.js SSO config
└── api/routes/
    └── auth.routes.ts           # Auth API endpoints
```

---

## 🔑 Authentication Flow

### 1. SSO Login (SAML)

```
User → /auth/login → SSO Provider → /auth/callback → JWT Tokens
```

**Step by step:**
1. User clicks "Login" in frontend
2. Frontend redirects to `/api/v1/auth/login`
3. Backend redirects to SSO provider (university login)
4. User enters credentials at SSO provider
5. SSO provider redirects back to `/api/v1/auth/callback`
6. Backend validates SAML assertion
7. Backend creates/updates user in database
8. Backend generates JWT access + refresh tokens
9. Frontend receives tokens and stores them

### 2. Token Usage

```typescript
// Frontend stores tokens
localStorage.setItem('accessToken', tokens.accessToken);
localStorage.setItem('refreshToken', tokens.refreshToken);

// Include in API requests
headers: {
  'Authorization': `Bearer ${accessToken}`
}
```

### 3. Token Refresh

```
Access Token Expires → /auth/refresh → New Tokens
```

**When access token expires (1 hour):**
1. Frontend detects 401 error
2. Frontend calls `/api/v1/auth/refresh` with refresh token
3. Backend validates refresh token
4. Backend generates new access + refresh tokens
5. Frontend updates stored tokens
6. Frontend retries original request

### 4. Logout

```
User Logout → /auth/logout → Token Revoked
```

1. Frontend calls `/api/v1/auth/logout`
2. Backend removes refresh token from Redis
3. Frontend deletes stored tokens
4. User is logged out

---

## 🛣️ API Endpoints

### **GET /auth/login**
Initiate SSO login

**Response:** Redirect to SSO provider

---

### **POST /auth/callback**
SSO callback endpoint (called by SSO provider)

**Request Body:** SAML assertion (handled by Passport)

**Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "id": "uuid",
      "studentId": "STU12345",
      "email": "student@school.edu",
      "firstName": "John",
      "lastName": "Doe",
      "role": "student"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": "1h"
    }
  }
}
```

---

### **POST /auth/refresh**
Refresh access token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": "1h"
  }
}
```

---

### **POST /auth/logout**
Logout user (requires authentication)

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### **GET /auth/me**
Get current user profile (requires authentication)

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "studentId": "STU12345",
    "email": "student@school.edu",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student",
    "gpa": 3.8,
    "creditsCompleted": 90,
    "totalCredits": 120,
    "expectedGraduation": "2026-06-01",
    "aiPoints": 150,
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### **PUT /auth/me**
Update user profile (requires authentication)

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "newemail@school.edu"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "studentId": "STU12345",
    "email": "newemail@school.edu",
    "firstName": "John",
    "lastName": "Doe",
    ...
  }
}
```

---

### **GET /auth/status**
Check authentication status (requires authentication)

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "authenticated": true,
    "user": {
      "id": "uuid",
      "studentId": "STU12345",
      "email": "student@school.edu",
      "role": "student"
    }
  }
}
```

---

## 🔒 Security Features

### **JWT Tokens**
- **Access Token:** Short-lived (1 hour), used for API requests
- **Refresh Token:** Long-lived (7 days), used to get new access tokens
- **Signed with secrets:** Different secrets for access and refresh tokens

### **Token Revocation**
- Refresh tokens stored in Redis
- Logout removes token from Redis
- Prevents use of stolen refresh tokens

### **Rate Limiting**
- **Auth endpoints:** 5 requests per 15 minutes
- Prevents brute force attacks

### **HTTPS Only**
- All auth endpoints require HTTPS in production
- Tokens never sent over HTTP

### **CORS**
- Only frontend domain allowed
- Credentials enabled for cookies

### **Password Hashing**
- bcrypt with salt rounds (if using password auth)
- Not used with SSO, but available

---

## 🔧 Configuration

### **Environment Variables**

```bash
# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key
REFRESH_TOKEN_EXPIRES_IN=7d

# SSO (SAML)
SSO_STRATEGY=saml
SSO_CALLBACK_URL=http://localhost:4000/api/v1/auth/callback
SSO_ISSUER=https://school-sso-provider.com
SSO_ENTRY_POINT=https://school-sso-provider.com/saml/login
SSO_CERT=-----BEGIN CERTIFICATE-----
YOUR_CERTIFICATE_HERE
-----END CERTIFICATE-----
```

### **SSO Provider Setup**

1. **Get SSO credentials from university IT:**
   - Entry point URL
   - Issuer/Entity ID
   - Public certificate

2. **Register callback URL:**
   - Production: `https://yourdomain.com/api/v1/auth/callback`
   - Development: `http://localhost:4000/api/v1/auth/callback`

3. **Configure SAML attributes:**
   - `nameID` or `uid` → Student ID
   - `email` or `mail` → Email
   - `firstName` or `givenName` → First Name
   - `lastName` or `surname` → Last Name

---

## 🧪 Testing

### **Manual Testing**

```bash
# 1. Start server
npm run dev

# 2. Test SSO login (in browser)
http://localhost:4000/api/v1/auth/login

# 3. After SSO callback, copy access token

# 4. Test authenticated endpoint
curl -X GET http://localhost:4000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 5. Test token refresh
curl -X POST http://localhost:4000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'

# 6. Test logout
curl -X POST http://localhost:4000/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📱 Frontend Integration

### **React Example**

```typescript
// auth.service.ts
export const authService = {
  async login() {
    // Redirect to SSO
    window.location.href = 'http://localhost:4000/api/v1/auth/login';
  },

  async handleCallback(tokens: any) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('http://localhost:4000/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await response.json();
    this.handleCallback(data.data);
    return data.data.accessToken;
  },

  async logout() {
    const accessToken = localStorage.getItem('accessToken');
    await fetch('http://localhost:4000/api/v1/auth/logout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  getAccessToken() {
    return localStorage.getItem('accessToken');
  },
};

// API interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, refresh it
      const newToken = await authService.refreshToken();
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return axios.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

---

## ✅ Summary

Authentication system is **production-ready** with:
- ✅ SSO integration (SAML 2.0)
- ✅ JWT access + refresh tokens
- ✅ Automatic token refresh
- ✅ Secure logout with token revocation
- ✅ User profile management
- ✅ Role-based access control
- ✅ Rate limiting
- ✅ Complete API documentation

**Ready to integrate with frontend!** 🚀
