# VibeConnect

A full-stack social app built on the MERN stack: posts, 24-hour stories, connections, real-time chat and an inbox designed for low-pressure messaging.

## Features

- Email and password accounts with email verification and password reset
- Posts, stories that delete themselves after 24 hours, and connection requests
- Real-time one-to-one chat over Server-Sent Events, delivered through Redis Pub/Sub
- Inbox and chat tools with zero-typing replies (polls, checklists, quick decisions)
- **Social Signals**: interaction style badges, message comfort level, request openness and energy mode on each profile
- **Unread without guilt**: message states that take the pressure off replying
- Background jobs with Inngest: connection reminders, story cleanup and a daily unseen-messages email

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React 19, Vite, Redux Toolkit, Tailwind CSS 4 |
| Backend | Node.js, Express 5, MongoDB with Mongoose, Redis, ImageKit, Inngest, Nodemailer |
| Auth | bcrypt, JWT, Redis-backed rate limiting, email verification |

## Authentication

- Passwords are hashed with bcrypt. Logging in returns a JWT (valid 7 days) that the client sends as a `Bearer` header.
- New accounts must verify their email. Verification (24 h) and password reset (1 h) links use random tokens stored in Redis with an expiry.
- `/api/auth` routes allow 20 attempts per 15 minutes per IP, counted in Redis.
- The live chat stream can't send headers, so the client first gets a one-time ticket (valid 60 s) and opens the stream with it.

## Project structure

```
client/              React frontend (Vite)
server/              Express API
docker-compose.yml   Runs the whole stack locally
.env.example         Keys needed to run the app
```

## Getting started

You need Docker Desktop and a free [ImageKit](https://imagekit.io) account (for image uploads).

1. Copy the example env file and fill in your keys:

   ```bash
   cp .env.example .env
   ```

2. Start everything:

   ```bash
   docker compose up --build
   ```

3. Open **http://localhost:5173**.

| Service | URL |
| --- | --- |
| App | http://localhost:5173 |
| Backend API | http://localhost:4000 |
| Inngest dashboard | http://localhost:8288 |

Without SMTP keys, verification and password-reset emails are printed in the server logs (`docker compose logs server`) so you can open the link from there.

To stop the app, run `docker compose down`. Add `-v` to also wipe the database.

## Demo data

Seed scripts fill the app with 8 test users, posts, connections, messages and inbox items. Sign up and verify your account first, then run:

```bash
docker compose exec server node seed-social-signals.js
docker compose exec server node seed-connections.js you@example.com
docker compose exec server node seed-inbox.js you@example.com
docker compose exec server node seed-unread-without-guilt.js you@example.com
```
