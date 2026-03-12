# JobQ - AI-Powered Job Application Tracker

JobQ is a full-stack web application that helps users track their job applications, manage their professional profiles, and prepare for interviews using AI-powered features.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
  - [Authentication & Security](#authentication--security)
  - [Job Management](#job-management)
  - [Application Tracking](#application-tracking)
  - [AI-Powered Features](#ai-powered-features)
  - [Profile Management](#profile-management)
  - [Subscriptions & Billing](#subscriptions--billing)
  - [Blog/Insights](#bloginsights)
  - [Notifications](#notifications)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Development Notes](#development-notes)

---

## Project Overview

JobQ is designed to streamline the job search process by providing:

- **Application Tracking**: Track job applications through various stages (Saved, Applied, Assessment, Interview, Offer, Rejected, Accepted, Withdrawn)
- **Job Discovery**: Browse and search job listings from multiple sources
- **AI Extraction**: Paste job descriptions and automatically extract structured data
- **Interview Preparation**: Generate AI-powered interview questions, skill assessments, and company insights
- **Profile Management**: Store and manage skills, experience, education, certifications, and resumes
- **Analytics**: Visualize application metrics and success rates
- **Content**: Blog/Insights with career advice and industry news

---

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form + Zod** - Form handling and validation
- **Recharts** - Data visualization
- **date-fns** - Date utilities
- **Heroicons** - Icon library

### Backend
- **Django 5.x** - Python web framework
- **Django REST Framework** - REST API framework
- **PostgreSQL** - Primary database
- **OpenAI API** - AI-powered features (GPT-4)
- **JWT Authentication** - Token-based auth
- **CORS Headers** - Cross-origin resource sharing

---

## Project Structure

```
JobQ/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ai/            # AI-related components
│   │   │   ├── applications/ # Application tracking components
│   │   │   ├── common/        # Shared components (Button, Input, Modal, etc.)
│   │   │   ├── dashboard/     # Dashboard widgets
│   │   │   ├── jobs/          # Job listing components
│   │   │   ├── layout/        # Layout components (Header, Sidebar)
│   │   │   └── notifications/ # Notification components
│   │   ├── pages/             # Page-level components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Applications.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── AIPaste.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── InterviewPrep.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Subscription.jsx
│   │   │   ├── Insights.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ...more pages
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/           # API service layer
│   │   ├── store/              # Redux slices and store
│   │   ├── routes/             # Routing configuration
│   │   ├── App.jsx             # Main app entry
│   │   └── main.jsx            # ReactDOM render
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── backend/                     # Django backend application
    ├── jobq_backend/            # Django project settings
    │   ├── settings.py
    │   ├── urls.py
    │   ├── wsgi.py
    │   └── asgi.py
    ├── apps/                   # Django apps
    │   ├── ai/                 # AI services (extraction, interview prep)
    │   ├── applications/       # Job application tracking
    │   ├── blog/               # Blog/Insights system
    │   ├── jobs/               # Job listings
    │   ├── notifications/       # Notifications & messaging
    │   ├── profiles/           # User profiles & resumes
    │   ├── subscriptions/      # Subscription management
    │   └── users/              # User authentication
    ├── media/                  # Uploaded files
    ├── manage.py
    └── requirements.txt
```

---

## Features

### Authentication & Security

- **User Registration & Login**: Email/password authentication
- **JWT Tokens**: Secure token-based authentication with refresh support
- **Two-Factor Authentication (2FA)**: Optional 2FA with 6-digit codes
- **Password Reset**: Email-based password reset flow
- **Account Suspension**: Admin can suspend users
- **OAuth Integration**: Google and LinkedIn OAuth (stubbed)

### Job Management

- **Browse Jobs**: View paginated list of job listings
- **Job Details**: Full job information with description, requirements, skills
- **Job Filtering**: Filter by job type, experience level, location, industry
- **Job Bookmarks**: Save jobs for later
- **Company Information**: Company profiles with descriptions
- **Job Application Links**: Direct links to apply
- **Salary Information**: Min/max salary with currency support
- **Job Types**: Full-time, Part-time, Contract, Internship, Remote
- **Experience Levels**: Entry, Mid-Level, Senior, Lead, Executive

### Application Tracking

- **Application CRUD**: Create, read, update, delete applications
- **Status Tracking**: Track through 8 stages (Saved, Applied, Assessment, Interview, Offer, Rejected, Accepted, Withdrawn)
- **Status History**: Track all status changes with timestamps
- **Application Notes**: Add notes to each application
- **Archive Feature**: Archive old applications
- **Soft Delete**: Recover deleted applications
- **Deadlines**: Set application deadlines
- **Applied Date**: Track when you applied

### AI-Powered Features

#### Job Data Extraction
- **Paste & Extract**: Paste job posting text and extract structured data
- **Auto-Parse**: Extract title, company, location, salary, description, requirements, skills
- **AI Fallback**: Graceful degradation when OpenAI is unavailable

#### Interview Preparation
- **AI Interview Questions**: Generate questions by category (Technical, Behavioral, Situational)
- **Skill Assessments**: Analyze skill gaps based on job requirements
- **Company Insights**: Research company information
- **Personalized Recommendations**: Tailored advice based on user profile
- **Regenerate Content**: Regenerate AI content on demand
- **Application Linking**: Link interview prep to saved applications

### Profile Management

- **User Profiles**: Bio, location, website
- **Skills**: Add and manage skills
- **Work Experience**: Companies, positions, dates, descriptions
- **Education**: Schools, degrees, fields of study
- **Certifications**: Titles, institutions, dates
- **Resumes**: Upload and manage resume files
- **Profile Sharing**: Share profile links

### Subscriptions & Billing

- **Subscription Plans**: Multiple tiers with different limits
- **Plan Limits**: Track max applications, profiles, AI pastes
- **Usage Tracking**: Monitor AI paste usage
- **Plan Upgrade/Downgrade**: Change subscription tiers
- **Cancel/Resume**: Manage subscription status

### Blog/Insights

- **Blog Posts**: Career advice, job search tips, industry news
- **Categories**: Job Search, Career Advice, Technology, Interviews, etc.
- **Featured Posts**: Highlight important articles
- **Comments**: Allow comments on posts
- **Subscribers**: Email subscription for updates
- **SEO**: Meta titles and descriptions

### Notifications

- **In-App Notifications**: Real-time notifications
- **Read Status**: Mark as read/unread
- **Contact Messages**: Contact form submissions
- **Reviews**: User-submitted app reviews
- **Admin Response**: Admin can respond to contact messages

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register/` | Register new user |
| POST | `/api/v1/auth/login/` | Login (username/email + password) |
| POST | `/api/v1/auth/logout/` | Logout |
| POST | `/api/v1/auth/refresh/` | Refresh JWT token |
| GET/PUT | `/api/v1/auth/me/` | Get/update current user |
| POST | `/api/v1/auth/delete/` | Delete account |
| POST | `/api/v1/auth/password-reset/request/` | Request password reset |
| POST | `/api/v1/auth/password-reset/verify/` | Verify reset token |
| POST | `/api/v1/auth/password-reset/` | Reset password |
| POST | `/api/v1/auth/google/` | Google OAuth |
| POST | `/api/v1/auth/linkedin/` | LinkedIn OAuth |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/jobs/` | List jobs (paginated) |
| POST | `/api/v1/jobs/` | Create job listing |
| GET | `/api/v1/jobs/{id}/` | Get job details |
| PUT | `/api/v1/jobs/{id}/` | Update job |
| DELETE | `/api/v1/jobs/{id}/` | Delete job |
| POST | `/api/v1/jobs/extract/` | AI extract job data |
| POST | `/api/v1/jobs/{id}/bookmark/` | Bookmark a job |
| DELETE | `/api/v1/jobs/{id}/bookmark/` | Remove bookmark |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/applications/` | List applications |
| POST | `/api/v1/applications/` | Create application |
| GET | `/api/v1/applications/{id}/` | Get application |
| PUT | `/api/v1/applications/{id}/` | Update application |
| DELETE | `/api/v1/applications/{id}/` | Delete application |
| GET | `/api/v1/applications/stats/` | Get application statistics |
| POST | `/api/v1/applications/{id}/archive/` | Archive application |
| POST | `/api/v1/applications/{id}/restore/` | Restore application |
| POST | `/api/v1/jobs/{id}/save-application/` | Save job as application |

### Profiles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/profiles/` | Get user profile |
| PUT | `/api/v1/profiles/` | Update profile |
| GET | `/api/v1/profiles/skills/` | List skills |
| POST | `/api/v1/profiles/skills/` | Add skill |
| DELETE | `/api/v1/profiles/skills/{id}/` | Delete skill |
| GET | `/api/v1/profiles/experiences/` | List experiences |
| POST | `/api/v1/profiles/experiences/` | Add experience |
| PUT | `/api/v1/profiles/experiences/{id}/` | Update experience |
| DELETE | `/api/v1/profiles/experiences/{id}/` | Delete experience |
| GET | `/api/v1/profiles/education/` | List education |
| POST | `/api/v1/profiles/education/` | Add education |
| DELETE | `/api/v1/profiles/education/{id}/` | Delete education |
| GET | `/api/v1/profiles/certifications/` | List certifications |
| POST | `/api/v1/profiles/certifications/` | Add certification |
| DELETE | `/api/v1/profiles/certifications/{id}/` | Delete certification |
| GET | `/api/v1/profiles/resumes/` | List resumes |
| POST | `/api/v1/profiles/resumes/upload/` | Upload resume |

### Subscriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/subscription/` | Get subscription details |
| POST | `/api/v1/subscription/upgrade/` | Upgrade plan |
| POST | `/api/v1/subscription/cancel/` | Cancel subscription |
| POST | `/api/v1/subscription/resume/` | Resume subscription |
| GET | `/api/v1/subscription/plans/` | List available plans |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/notifications/` | List notifications |
| POST | `/api/v1/notifications/{id}/read/` | Mark as read |
| GET | `/api/v1/notifications/unread-count/` | Get unread count |

### Blog/Insights
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/insights/` | List blog posts |
| GET | `/api/v1/insights/{slug}/` | Get post by slug |
| POST | `/api/v1/insights/{slug}/comments/` | Add comment |
| POST | `/api/v1/insights/subscribe/` | Subscribe to updates |

### AI Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/ai/extract/` | Extract job data from text |
| GET | `/api/v1/ai/interview-prep/` | List interview preps |
| POST | `/api/v1/ai/interview-prep/` | Create interview prep |
| GET | `/api/v1/ai/interview-prep/{prep_id}/` | Get interview prep |
| POST | `/api/v1/ai/interview-prep/{prep_id}/regenerate/` | Regenerate content |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/contact/` | Submit contact message |
| GET | `/api/v1/reviews/` | List reviews |
| POST | `/api/v1/reviews/` | Submit review |

---

## Database Models

### Users App
- **User** - Extended Django user (phone, location, 2FA, suspension)
- **TwoFactorToken** - 2FA verification tokens
- **PasswordResetToken** - Password reset tokens

### Jobs App
- **Company** - Company information
- **Job** - Job listings with full details
- **ExtractionTask** - AI extraction tasks
- **JobBookmark** - User job bookmarks

### Applications App
- **Application** - Job applications with status tracking
- **StatusHistory** - Status change history

### Profiles App
- **Profile** - User profile
- **Skill** - User skills
- **Experience** - Work experience
- **Education** - Education history
- **Certification** - Certifications
- **Resume** - Uploaded resumes

### Subscriptions App
- **SubscriptionPlan** - Subscription tiers
- **Subscription** - User subscriptions

### Notifications App
- **Notification** - User notifications
- **ContactMessage** - Contact form submissions
- **Review** - User reviews

### Blog App
- **BlogPost** - Blog articles (Insights)
- **BlogSubscriber** - Email subscribers
- **BlogComment** - Article comments

### AI App
- **InterviewPrep** - Interview preparation content

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 14+

### Backend Setup

1. **Create virtual environment**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start development server**
   ```bash
   python manage.py runserver 9090
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env - set VITE_API_URL
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

---

## Environment Variables

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_NAME=jobq
DATABASE_USER=postgres
DATABASE_PASSWORD=your-password
DATABASE_HOST=localhost
DATABASE_PORT=5432

# OpenAI (optional)
OPENAI_API_KEY=sk-...

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@jobq.com

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:9090/api/v1
VITE_SKIP_AUTH=false  # Set to true for testing without auth
```

---

## Development Notes

### Skip Authentication for Testing
Create a `.env` file in `frontend/` with:
```
VITE_SKIP_AUTH=true
```
This bypasses login requirements for UI testing.

### AI Features
- Job extraction uses OpenAI GPT-4o-mini
- Interview prep generates questions, assessments, and recommendations
- Falls back to basic extraction when OpenAI is unavailable
- Set `OPENAI_API_KEY` in backend environment to enable AI features

### Database Indexes
The application uses database indexes for:
- Fast status filtering on applications
- Date-based sorting
- User-specific queries
- Full-text search readiness

### API Authentication
- JWT tokens with access/refresh pattern
- Tokens stored in localStorage on frontend
- Auto-refresh on 401 errors
- Logout clears tokens

### File Uploads
- Resumes stored in `media/resumes/`
- Django serves media in development (`DEBUG=True`)
- Production should use cloud storage (AWS S3, Cloudinary, etc.)

---

## License

MIT License

---

Happy coding! 🎉
