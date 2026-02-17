# Lanari Tech — API Documentation

**Base URL:** `http://localhost:5000/api`

All responses follow the format:
```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:
```json
{
  "error": "Error message here"
}
```

---

## Table of Contents

- [Authentication](#authentication)
- [Contact](#contact)
- [Careers](#careers)
- [Partners](#partners)
- [Investors](#investors)
- [Notifications](#notifications)
- [Calendar Events](#calendar-events)
- [AI Chat](#ai-chat)
- [Search](#search)
- [Analytics Tracking](#analytics-tracking)
- [Admin](#admin)
- [Health Check](#health-check)

---

## Authentication

All protected endpoints require the header:
```
Authorization: Bearer <jwt_token>
```

### POST `/api/auth/register`

Register a new user account.

**Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+250 700 000 000",
  "password": "securepassword",
  "confirmPassword": "securepassword"
}
```

**Validation:**
- `fullName` — required, min 2 characters
- `email` — required, valid email format, must be unique
- `password` — required, min 8 characters
- `confirmPassword` — must match password

**Response** `201`:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+250 700 000 000"
  }
}
```

**Side effects:**
- Sends welcome email to user
- Sends registration notification email to admin
- Creates a welcome notification for the user
- Logs `register` activity event

**Errors:**
- `400` — Validation failure (missing fields, short password, mismatch)
- `409` — Email already registered

---

### POST `/api/auth/login`

Authenticate a user and receive a JWT token.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response** `200`:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Side effects:**
- Sends login alert email to the user
- Logs `login` activity event

**Errors:**
- `400` — Missing email or password
- `401` — Invalid email or password

---

### GET `/api/auth/me`

Get the current authenticated user's profile.

**Auth:** Required

**Response** `200`:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### GET `/api/auth/dashboard`

Get the user's dashboard data (profile, notifications, applications).

**Auth:** Required

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+250 700 000 000",
      "role": "user",
      "memberSince": "2025-01-15T10:30:00.000Z"
    },
    "notifications": [
      {
        "id": 1,
        "title": "Welcome to Lanari Tech",
        "description": "Hi John, welcome...",
        "type": "success",
        "is_read": false,
        "created_at": "2025-01-15T10:30:00.000Z"
      }
    ],
    "unreadNotifications": 3,
    "applications": [
      {
        "id": 1,
        "created_at": "2025-01-20T14:00:00.000Z",
        "cover_letter": "I am excited...",
        "job_title": "Frontend Developer",
        "department": "Engineering",
        "type": "Full-time",
        "location": "Kigali, Rwanda"
      }
    ]
  }
}
```

---

### POST `/api/auth/mail-login`

Login for Lanari Mail (restricted to `employee` and `admin` roles).

**Body:**
```json
{
  "email": "employee@example.com",
  "password": "securepassword"
}
```

**Response** `200`:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 2,
    "fullName": "Employee Name",
    "email": "employee@example.com"
  }
}
```

**Errors:**
- `401` — Access restricted to authorized personnel (non-employee/admin users)

---

## Contact

### POST `/api/contact`

Submit a contact message. **No auth required.**

**Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "message": "I'd like to learn more about your services."
}
```

**Response** `201`:
```json
{
  "success": true,
  "message": "Message received",
  "id": 5
}
```

**Side effects:**
- Sends confirmation email to the visitor
- Sends notification email to admin
- Logs `contact_submit` activity event

---

### GET `/api/contact`

Get all contact messages. **Admin only.**

**Auth:** Required (Admin)

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane@example.com",
      "message": "I'd like to learn more...",
      "is_read": false,
      "created_at": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### PATCH `/api/contact/:id/read`

Mark a contact message as read. **Admin only.**

**Auth:** Required (Admin)

**Response** `200`:
```json
{
  "success": true,
  "message": "Marked as read"
}
```

---

## Careers

### GET `/api/careers/jobs`

List all active job listings. **No auth required.**

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Frontend Developer",
      "department": "Engineering",
      "type": "Full-time",
      "location": "Kigali, Rwanda",
      "description": "We're looking for...",
      "is_active": true,
      "created_at": "2025-01-10T08:00:00.000Z"
    }
  ]
}
```

---

### GET `/api/careers/jobs/:id`

Get a single job listing by ID. **No auth required.**

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Frontend Developer",
    "department": "Engineering",
    "type": "Full-time",
    "location": "Kigali, Rwanda",
    "description": "We're looking for..."
  }
}
```

---

### POST `/api/careers/jobs/:id/apply`

Apply to a job listing. **No auth required.**

**Body:**
```json
{
  "applicantName": "John Doe",
  "applicantEmail": "john@example.com",
  "coverLetter": "I am excited to apply..."
}
```

**Required fields:** `applicantName`, `applicantEmail`

**Response** `201`:
```json
{
  "success": true,
  "message": "Application submitted",
  "id": 3
}
```

**Side effects:**
- Sends confirmation email to applicant
- Sends notification email to admin
- Logs `job_apply` activity event

**Errors:**
- `404` — Job not found or no longer active

---

### POST `/api/careers/jobs`

Create a new job listing. **Admin only.**

**Auth:** Required (Admin)

**Body:**
```json
{
  "title": "Backend Developer",
  "department": "Engineering",
  "type": "Full-time",
  "location": "Remote",
  "description": "Job description here..."
}
```

**Required fields:** `title`, `department`, `type`, `location`

**Response** `201`:
```json
{
  "success": true,
  "message": "Job listing created",
  "id": 2
}
```

---

### PUT `/api/careers/jobs/:id`

Update a job listing. **Admin only.**

**Auth:** Required (Admin)

**Body** (all fields optional):
```json
{
  "title": "Updated Title",
  "department": "Design",
  "type": "Part-time",
  "location": "Kigali",
  "description": "Updated description",
  "isActive": false
}
```

**Response** `200`:
```json
{
  "success": true,
  "message": "Job listing updated"
}
```

---

### DELETE `/api/careers/jobs/:id`

Deactivate a job listing (soft delete). **Admin only.**

**Auth:** Required (Admin)

**Response** `200`:
```json
{
  "success": true,
  "message": "Job listing deactivated"
}
```

---

### GET `/api/careers/applications`

Get all job applications. **Admin only.**

**Auth:** Required (Admin)

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "job_id": 1,
      "applicant_name": "John Doe",
      "applicant_email": "john@example.com",
      "cover_letter": "I am excited...",
      "status": "received",
      "created_at": "2025-01-20T14:00:00.000Z",
      "job_title": "Frontend Developer",
      "department": "Engineering"
    }
  ]
}
```

---

## Partners

### POST `/api/partners`

Submit a partnership request. **No auth required.**

**Body:**
```json
{
  "organizationName": "Tech Corp",
  "contactEmail": "partner@techcorp.com",
  "partnershipProposal": "We'd like to collaborate on..."
}
```

**Response** `201`:
```json
{
  "success": true,
  "message": "Partnership request received",
  "id": 2
}
```

**Side effects:**
- Sends confirmation email to partner
- Sends notification email to admin
- Logs `partner_request` activity event

---

### GET `/api/partners`

Get all partnership requests. **Admin only.**

**Auth:** Required (Admin)

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "organization_name": "Tech Corp",
      "contact_email": "partner@techcorp.com",
      "partnership_proposal": "We'd like to...",
      "status": "pending",
      "created_at": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### PATCH `/api/partners/:id/status`

Update the status of a partnership request. **Admin only.**

**Auth:** Required (Admin)

**Body:**
```json
{
  "status": "accepted"
}
```

**Valid statuses:** `pending`, `reviewed`, `accepted`, `rejected`

**Response** `200`:
```json
{
  "success": true,
  "message": "Status updated"
}
```

---

## Investors

### POST `/api/investors`

Submit an investment inquiry. **No auth required.**

**Body:**
```json
{
  "fullName": "Sarah Investor",
  "email": "sarah@fund.com",
  "phone": "+250 700 111 222",
  "organization": "Growth Fund LLC",
  "investmentRange": "$50,000 - $100,000",
  "message": "Interested in Series A..."
}
```

**Required fields:** `fullName`, `email`

**Response** `201`:
```json
{
  "success": true,
  "message": "Investment inquiry received",
  "id": 1
}
```

**Side effects:**
- Sends confirmation email to investor
- Sends notification email to admin

---

### GET `/api/investors`

Get all investor inquiries. **Admin only.**

**Auth:** Required (Admin)

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "full_name": "Sarah Investor",
      "email": "sarah@fund.com",
      "phone": "+250 700 111 222",
      "organization": "Growth Fund LLC",
      "investment_range": "$50,000 - $100,000",
      "message": "Interested in Series A...",
      "status": "pending",
      "created_at": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### PATCH `/api/investors/:id/status`

Update the status of an investor inquiry. **Admin only.**

**Auth:** Required (Admin)

**Body:**
```json
{
  "status": "contacted"
}
```

**Valid statuses:** `pending`, `contacted`, `in_discussion`, `closed`

**Response** `200`:
```json
{
  "success": true,
  "message": "Status updated"
}
```

---

## Notifications

All notification endpoints require authentication.

### GET `/api/notifications`

Get all notifications for the authenticated user.

**Auth:** Required

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Welcome to Lanari Tech",
      "description": "Hi John, welcome to the Lanari Tech ecosystem!",
      "type": "success",
      "is_read": false,
      "created_at": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### PATCH `/api/notifications/:id/read`

Mark a single notification as read.

**Auth:** Required

**Response** `200`:
```json
{
  "success": true,
  "message": "Marked as read"
}
```

---

### PATCH `/api/notifications/read-all`

Mark all unread notifications as read.

**Auth:** Required

**Response** `200`:
```json
{
  "success": true,
  "message": "5 notifications marked as read"
}
```

---

## Calendar Events

All calendar endpoints require authentication. Events are scoped to the authenticated user.

### GET `/api/events`

Get user's calendar events. Optionally filter by month.

**Auth:** Required

**Query params:**
| Param | Type | Description |
|---|---|---|
| `year` | number | Filter by year (e.g., 2025) |
| `month` | number | Filter by month (1-12) |

**Example:** `GET /api/events?year=2025&month=6`

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Team Meeting",
      "description": "Weekly sync",
      "event_date": "2025-06-15",
      "start_time": "10:00:00",
      "end_time": "11:00:00",
      "color": "blue",
      "created_at": "2025-06-10T08:00:00.000Z"
    }
  ]
}
```

---

### POST `/api/events`

Create a new calendar event.

**Auth:** Required

**Body:**
```json
{
  "title": "Team Meeting",
  "description": "Weekly sync",
  "eventDate": "2025-06-15",
  "startTime": "10:00",
  "endTime": "11:00",
  "color": "blue"
}
```

**Required fields:** `title`, `eventDate`

**Response** `201`:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Team Meeting",
    "event_date": "2025-06-15",
    "start_time": "10:00:00",
    "end_time": "11:00:00",
    "color": "blue"
  }
}
```

---

### PUT `/api/events/:id`

Update a calendar event.

**Auth:** Required

**Body** (all fields optional):
```json
{
  "title": "Updated Meeting",
  "eventDate": "2025-06-16",
  "color": "red"
}
```

**Response** `200`:
```json
{
  "success": true,
  "data": { ... }
}
```

---

### DELETE `/api/events/:id`

Delete a calendar event.

**Auth:** Required

**Response** `200`:
```json
{
  "success": true,
  "message": "Event deleted"
}
```

---

## AI Chat

The AI chat system supports multi-session conversations with an intelligent assistant.

### GET `/api/ai/knowledge`

Get the full AI knowledge base. **No auth required.**

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "question": "What is Siri Market?",
      "answer": "**Siri Market** is Lanari Tech's e-commerce platform...",
      "link": "/siri"
    }
  ]
}
```

---

### POST `/api/ai/chat`

Send a message and receive an AI response.

**Auth:** Required

**Body:**
```json
{
  "message": "What products does Lanari offer?",
  "sessionId": null
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `message` | string | Yes | The user's message |
| `sessionId` | number | No | Existing session ID. If null, creates a new session |

**Response** `200`:
```json
{
  "success": true,
  "sessionId": 5,
  "data": {
    "text": "Lanari Tech has a complete ecosystem of digital products:\n\n- **Siri Market** — E-commerce and reselling platform\n- **Rise Network** — Jobs, freelancing...",
    "link": null
  }
}
```

**Response strategy (in order):**
1. AI provider (Gemini/Claude) if configured and available
2. NLP engine — TF-IDF cosine similarity matching against knowledge base
3. Intent detection — greetings, thanks, farewells, help requests
4. Fallback — helpful menu of available topics

---

### GET `/api/ai/sessions`

Get all chat sessions for the authenticated user.

**Auth:** Required

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "user_id": 1,
      "title": "What products does Lanari offer?",
      "created_at": "2025-06-15T10:00:00.000Z",
      "updated_at": "2025-06-15T10:05:00.000Z",
      "message_count": 4
    }
  ]
}
```

---

### GET `/api/ai/sessions/:id`

Get a specific chat session with all its messages.

**Auth:** Required

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "session": {
      "id": 5,
      "user_id": 1,
      "title": "What products does Lanari offer?",
      "created_at": "2025-06-15T10:00:00.000Z",
      "updated_at": "2025-06-15T10:05:00.000Z"
    },
    "messages": [
      {
        "id": 10,
        "session_id": 5,
        "role": "user",
        "content": "What products does Lanari offer?",
        "link": null,
        "created_at": "2025-06-15T10:00:00.000Z"
      },
      {
        "id": 11,
        "session_id": 5,
        "role": "ai",
        "content": "Lanari Tech has a complete ecosystem...",
        "link": null,
        "created_at": "2025-06-15T10:00:01.000Z"
      }
    ]
  }
}
```

---

### DELETE `/api/ai/sessions/:id`

Delete a chat session and all its messages.

**Auth:** Required

**Response** `200`:
```json
{
  "success": true,
  "message": "Session deleted"
}
```

---

## Search

### GET `/api/search`

Search across all site content (pages + job listings). **No auth required.**

**Query params:**
| Param | Type | Description |
|---|---|---|
| `q` | string | Search query. If empty, returns all content |

**Example:** `GET /api/search?q=coding`

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "title": "Coding Academy",
      "description": "Practical coding and digital skills training...",
      "category": "Product",
      "icon": "🎓",
      "color": "from-emerald-500 to-teal-400",
      "url": "/academy",
      "tags": ["learn", "code", "course", "training"],
      "score": 75
    }
  ]
}
```

Results are sorted by relevance score (highest first). Scoring considers:
- Exact title match: 100 points
- Title contains query: 50 points
- Tag match: 30 points
- Description contains query: 20 points
- Individual word matches: 5-15 points each

---

## Analytics Tracking

### POST `/api/analytics/track`

Track a page visit. **No auth required** (anonymous visits are supported).

**Body:**
```json
{
  "event": "page_visit",
  "page": "/about"
}
```

**Headers** (optional):
```
Authorization: Bearer <token>
```

If a valid token is provided, the visit is linked to the user. Otherwise, it's logged as an anonymous visit. The server also captures the visitor's IP address and user-agent.

**Response** `200`:
```json
{
  "success": true
}
```

---

## Admin

All admin endpoints require authentication with the `admin` role.

**Auth:** Required (Admin) — applied to all routes via `router.use(protect, adminOnly)`

### GET `/api/admin/stats`

Get overview statistics for the admin dashboard.

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "users": 150,
    "messages": 45,
    "unreadMessages": 12,
    "partners": 8,
    "pendingPartners": 3,
    "jobs": 5,
    "applications": 23,
    "newApplications": 7
  }
}
```

---

### GET `/api/admin/analytics`

Get comprehensive analytics data.

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalVisits": 5240,
      "totalLogins": 890,
      "totalRegistrations": 150,
      "totalContacts": 45,
      "totalApplications": 23,
      "totalPartnerRequests": 8
    },
    "uniqueVisitors": 1230,
    "today": {
      "visits": 85,
      "logins": 12,
      "registrations": 3,
      "contacts": 1,
      "applications": 2,
      "partnerRequests": 0
    },
    "week": {
      "visits": 620,
      "logins": 95,
      "registrations": 18
    },
    "month": {
      "visits": 2100,
      "logins": 350,
      "registrations": 65
    },
    "dailyActivity": [
      {
        "date": "2025-06-01",
        "visits": 45,
        "logins": 8,
        "registrations": 2
      }
    ],
    "topPages": [
      { "page": "/", "visits": 1200 },
      { "page": "/about", "visits": 450 },
      { "page": "/siri", "visits": 380 }
    ],
    "recent": [
      {
        "id": 5000,
        "event_type": "page_visit",
        "user_id": null,
        "metadata": "{\"page\":\"/about\",\"ip\":\"127.0.0.1\"}",
        "created_at": "2025-06-15T10:30:00.000Z",
        "full_name": null
      }
    ]
  }
}
```

---

### GET `/api/admin/users`

Get all users with their details.

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone_number": "+250 700 000 000",
      "role": "user",
      "is_active": true,
      "created_at": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### PATCH `/api/admin/users/:id/role`

Update a user's role.

**Body:**
```json
{
  "role": "admin"
}
```

**Valid roles:** `user`, `admin`, `employee`

**Response** `200`:
```json
{
  "success": true,
  "message": "Role updated"
}
```

---

### PATCH `/api/admin/users/:id/toggle`

Toggle a user's active/inactive status.

**Response** `200`:
```json
{
  "success": true,
  "message": "User status toggled"
}
```

---

## Health Check

### GET `/health`

**Note:** This endpoint is at the root, not under `/api`.

**Response** `200`:
```json
{
  "status": "ok",
  "timestamp": "2025-06-15T10:30:00.000Z"
}
```

---

## Error Codes

| Code | Meaning |
|---|---|
| `400` | Bad Request — missing or invalid fields |
| `401` | Unauthorized — missing, invalid, or expired token |
| `403` | Forbidden — insufficient role (admin required) |
| `404` | Not Found — resource doesn't exist |
| `409` | Conflict — resource already exists (e.g., duplicate email) |
| `500` | Internal Server Error — unexpected failure |

In development mode (`NODE_ENV=development`), 500 errors include a stack trace.

---

## Rate Limits & Notes

- No rate limiting is currently implemented
- JWT tokens expire based on `JWT_EXPIRES_IN` (default: 7 days)
- File uploads are not supported (no multipart/form-data endpoints)
- All timestamps are in ISO 8601 format (UTC)
- The `activity_log` table is auto-created on server startup
- AI chat responses may include markdown formatting
