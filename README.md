Ring — Kickboxing Gym Management System

A full-stack gym management platform built for real-world use at a kickboxing gym — member management, class scheduling, attendance tracking, payment records, training progress logs, and an AI-powered coaching assistant.
Originally built to bring a Java/Spring Boot project into my portfolio and to create real automation for a kickboxing gym I train at, with an eye toward a gym I plan to open myself in the future.

🔗 Live demo: kickbox-gym-management.vercel.app (Backend runs on a free-tier instance and may take ~30-60s to wake up on first request.)

Demo login: admin@salon.com / 12345678

Features
JWT Authentication — secure login for gym admins/trainers
Member Management — full member profiles (contact info, emergency contacts, physical stats, skill level, membership dates/package type)
Class Scheduling — weekly class timetable management
Attendance / Check-in — per-class, per-day attendance tracking
Payments — manual payment recording, architected to plug in a real payment gateway (iyzico/Stripe) later without schema changes
Training Logs — chronological progress notes per member (technique, conditioning, discipline) with trainer-set goals
AI Coaching Assistant — Gemini-powered chat widget for training/business questions, plus one-click AI summarization of a member's training history

Tech Stack
Backend: Java 17, Spring Boot 3, Spring Security (JWT), Spring Data JPA, PostgreSQL, Maven, Docker
Frontend: React 18, Vite, Tailwind CSS, React Router, Axios
AI: Google Gemini API (gemini-3.6-flash)
Infrastructure: Render (backend), Vercel (frontend), Neon (managed PostgreSQL)

Architecture
├── backend/     Spring Boot REST API (JWT auth, JPA entities, Gemini integration)
└── frontend/    React SPA (Vite + Tailwind, consumes the REST API)

Six core entities: User, Member, GymClass, Attendance, Payment, TrainingLog — designed with a provider_reference field on payments specifically to support a future online payment gateway integration without breaking the existing data model.

Running Locally
Backend:
cd backend
# create a PostgreSQL database, then set your credentials in
# src/main/resources/application.properties
mvn spring-boot:run

Frontend:
cd frontend
npm install
npm run dev

The frontend expects the API at http://localhost:8080/api by default (configurable via VITE_API_URL).
You'll need a free Gemini API key for the AI chatbot to work.

Roadmap
 Online payment integration (iyzico/Stripe)
 Mobile-friendly PWA
 Multi-trainer support with role-based class assignment

Author
Umut Ekin Karaslan — Backend/Full Stack Developer GitHub · LinkedIn

Infrastructure: Render (backend), Vercel (frontend), Neon (managed PostgreSQL)
Architecture
