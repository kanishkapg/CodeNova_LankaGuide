# LankaGuide Backend

This is a small Express + MongoDB backend for the LankaGuide client app.

Quick start

1. Copy `.env.example` to `.env` and update `MONGO_URI` if needed.
2. Install deps: `npm install`
3. Start: `npm run dev` (requires nodemon) or `npm start`

APIs

- GET /api/departments
- POST /api/users { name, email } -> creates/returns user
- GET /api/users/:id
- GET /api/appointments?userId=
- POST /api/appointments { userId, departmentId, serviceId, datetime, meta }
- PUT /api/appointments/:id
- GET /api/notifications?target=
- POST /api/notifications { msg, target }

Next steps

- Wire frontend to call these endpoints instead of localStorage.
- Add input validation, auth, and pagination as needed.
