# AI Powered Quiz Application

A full-stack web application that allows users to generate AI-powered quizzes on any topic, attempt them with a timer, and track their performance over time.

The application is built using **Next.js, Django REST Framework, and PostgreSQL**, and integrates with an AI service to dynamically generate quiz questions.

---

# Features

### Authentication

* User Registration
* User Login
* Secure Token-based authentication

### AI Quiz Generation

* Generate quizzes based on:

  * Topic
  * Difficulty level
  * Number of questions
* Questions are generated using **Google Gemini AI**

### Quiz Attempt System

* Interactive quiz interface
* Quiz timer for each attempt
* Submit answers and calculate score
* Review correct answers after submission

### Quiz History

* View previously attempted quizzes
* Retake quizzes anytime

### Quiz Sharing

* Generate a shareable quiz link
* Other users can attempt the same quiz through the shared link

### Quiz Categories

* Predefined categories available
* Users can also create custom categories

### Analytics

* View overall performance
* Track number of quizzes attempted
* Category based performance insights

---

# Tech Stack

### Frontend

* Next.js
* Tailwind CSS

### Backend

* Django
* Django REST Framework

### Database

* PostgreSQL (SQLite used for local development)

### AI Service

* Google Gemini API (can be replaced with OpenAI or other providers)

---

# Project Structure

```
AI-Quiz-App
│
├── frontend
│   ├── pages
│   ├── components
│   └── styles
│
├── backend
│   ├── authentication
│   ├── quizzes
│   ├── attempts
│   └── analytics
│
├── README.md
└── .gitignore
```

---

# System Architecture

The application follows a standard **client-server architecture**.

```
User
  │
  ▼
Frontend (Next.js)
  │
  │ API Requests
  ▼
Backend (Django REST API)
  │
  │ Database Queries
  ▼
PostgreSQL Database
  │
  ▼
AI Service (Gemini API)
```

### Flow

1. User logs in or registers
2. User creates a quiz
3. Backend calls AI API to generate questions
4. Questions are stored in the database
5. User attempts the quiz
6. Score is calculated and stored
7. User can review answers and view history

---

# Database Design

Main entities used in the system:

### User

Stores user authentication details.

### Quiz

Stores quiz information:

* Topic
* Difficulty
* Category
* Number of questions
* Creator

### Question

Stores AI generated questions with:

* Options
* Correct answer
* Quiz reference

### Attempt

Stores each quiz attempt:

* User
* Quiz
* Score
* Timestamp

### Category

Stores quiz categories.

### Relationships

```
User → creates → Quiz

Quiz → contains → Questions

User → attempts → Quiz

Attempt → stores → score and answers
```

---

# API Structure

### Authentication

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### Quiz APIs

```
POST /api/quizzes
GET /api/quizzes/{quiz_id}
GET /api/quizzes/{quiz_id}/questions
GET /api/quizzes/user
```

### Quiz Attempts

```
POST /api/quizzes/{quiz_id}/start
POST /api/attempts/{attempt_id}/submit
```

### Quiz Sharing

```
POST /api/quizzes/{quiz_id}/share
GET /api/shared/{share_code}
```

### Analytics

```
GET /api/analytics/user
```

---

# Getting Started

## Backend Setup

Navigate to the backend folder

```
cd backend
```

Activate the virtual environment

```
.\venv\Scripts\Activate.ps1
```

Install dependencies

```
pip install -r requirements.txt
```

Create `.env` file and add your Gemini API key

```
GEMINI_API_KEY=your_api_key_here
```

Run migrations

```
python manage.py makemigrations
python manage.py migrate
```

Start the backend server

```
python manage.py runserver
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

## Frontend Setup

Open a new terminal and navigate to frontend

```
cd frontend
```

Install dependencies

```
npm install
```

Start the development server

```
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

# Deployment

### Frontend (Next.js)

Deployed using **Vercel**
- **Root Directory**: `frontend`
- **Environment Variable**: `NEXT_PUBLIC_API_URL` set to your Render backend URL.

### Backend (Django)

Deployed using **Render**
- **Root Directory**: `backend`
- **Build Command**: `./build.sh`
- **Start Command**: `gunicorn ai_quiz.wsgi:application`
- **Environment Variables**: `DATABASE_URL`, `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`.

### Database

PostgreSQL database used in production.

---

# Challenges Faced

Handling AI generated responses and converting them into structured quiz questions.

Maintaining a minimal and consistent UI across all pages.

Fixing incorrect timestamps in quiz history.

Ensuring the quiz timer functions correctly during the quiz attempt.

---

# Features Implemented

* User authentication
* AI quiz generation
* Quiz timer
* Quiz attempt tracking
* Quiz history and retake
* Quiz sharing through link
* Custom categories
* Quiz analytics dashboard

---

# Features Skipped

Leaderboard functionality was removed to keep the application simple and focused on core quiz generation and tracking features.

---

# Author

Developed as part of a Full Stack Developer assignment.
