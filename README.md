# Job Community Portal

A full-stack job and professional community platform that connects job seekers, companies, recruiters, and administrators through job discovery, applications, company profiles, professional content, notifications, and meeting management.

The platform is built as a separate React frontend and Node.js/Express backend, with Firebase Authentication and Firestore providing identity and application data services.

---

## Features

### 🔐 Authentication & User Management

- Firebase Authentication
- Email/password authentication
- Google-authenticated users supported through Firebase
- Backend Firebase ID-token verification
- Persistent authentication state
- User profile management
- Public user profiles
- Role-based access control
- Company membership and company-specific roles

### 👤 User Roles

The platform supports multiple levels of access:

- **Job Seeker**
- **Company**
- **Recruiter**
- **Admin**
- **Super Admin**

Company users can additionally have company-level roles such as:

- Owner
- Employee
- Recruiter
- HR

---

## 💼 Job Portal

### Job Discovery

- Browse available jobs
- View latest job listings
- Search jobs
- Filter jobs by:
  - Job type
  - Work mode
  - Experience
  - Other job attributes
- View detailed job information
- Track job views

### Job Management

Authorized company and recruiter users can:

- Create jobs
- Edit jobs
- Delete jobs
- Associate jobs with their company
- Define:
  - Job title
  - Location
  - Salary range
  - Job type
  - Work mode
  - Category
  - Description

Company information is derived from the authenticated user's backend profile rather than being trusted directly from the frontend.

### Applications

Job seekers can:

- Apply for jobs
- View application-related information
- Withdraw applications
- Save jobs

Companies can:

- View applications for their jobs
- Update application status
- Manage candidates through the application workflow

Application status changes generate notifications for applicants.

---

## 🏢 Company Management

The platform provides dedicated company functionality for organizations and recruiters.

### Company Profiles

Companies can maintain:

- Company name
- Logo
- Website
- Address
- Description
- Company information

Users can browse companies and view:

- Company profile
- Open positions
- Company information
- Employee/team information where permitted

### Company Dashboard

The company dashboard provides company-level management and analytics, including:

- Company information
- Job listings
- Job performance
- Application statistics
- Profile views
- Employee information
- Team management

### Company Analytics

Analytics include:

- Company profile views
- Total job views
- Total applications
- Top-performing jobs
- Application counts
- Employee growth
- Workforce metrics

The analytics system also tracks workforce information such as:

- Gender distribution
- Experience levels
- Work modes

### Team & Roles

Company owners can:

- View company members
- Manage employee roles
- Assign company roles
- Remove employees
- Maintain company membership information

The backend enforces company ownership before allowing sensitive team-management operations.

---

## 📝 Blog & Community

The platform includes a professional content and community system.

Users with appropriate platform roles can create and manage blog posts.

### Blog Features

- Browse blogs
- View individual blog posts
- Create blog posts
- Edit blog posts
- Delete blog posts
- Like posts
- Dislike posts
- View comments
- Add comments
- Share blog content

Blog creation is restricted to authorized platform roles such as:

- Company
- Recruiter
- Admin
- Super Admin

Blog actions can also generate user notifications.

---

## 🔔 Notifications

The platform includes an application-level notification system.

Notifications are generated for events such as:

- Job updates
- Job deletion
- Application status changes
- Blog creation
- Company approval
- Company rejection
- Role changes
- Meeting requests
- Meeting approvals
- Meeting declines

Users can:

- View notifications
- View unread notification count
- Mark notifications as read

---

## 📅 Meeting Management

The platform provides a meeting-request workflow connecting users and administrators.

### Meeting Request Flow

1. A user submits a meeting request.
2. The request is stored in Firestore.
3. Administrators are notified.
4. The administrator reviews the request.
5. The administrator can approve or decline it.
6. Approved meetings are scheduled through Zoom.
7. The requester receives meeting information through email and in-app notifications.

Meeting requests contain information such as:

- Name
- Email
- Phone
- Purpose
- Message
- Requested date/time information

### Zoom Integration

Approved meetings are created through the Zoom API.

The system stores:

- Zoom meeting ID
- Zoom join URL
- Meeting start time
- Meeting status

### Email Notifications

Nodemailer is used for transactional email communication, including:

- Meeting request confirmation
- Meeting scheduling confirmation
- Meeting decline notifications
- Administrative meeting notifications

---

## 👨‍💼 Administration

Administrators have access to platform-level management functionality.

### Admin Dashboard

Administrators can inspect:

- Users
- Jobs
- Blogs
- Pending companies
- Meeting requests

### Company Approval

Administrators can:

- Review pending companies
- Approve companies
- Reject companies
- Notify associated users about the decision

### Role Management

Super administrators can update platform-level user roles.

Role changes are propagated to the user's profile and associated notifications are generated.

---

## 🔒 Authorization & Security

The backend uses Firebase ID tokens to authenticate API requests.

Protected endpoints use middleware for:

- Firebase token verification
- User-role loading
- Administrator authorization
- Super-administrator authorization
- Company-owner authorization

The authorization flow generally follows:

```text
Firebase Authentication
        │
        ▼
Firebase ID Token
        │
        ▼
Express Middleware
        │
        ├── Token Verification
        │
        ├── User Profile / Role
        │
        └── Permission Check
                │
                ▼
          Protected API
```

The backend also performs ownership and company-membership checks for operations such as:

- Job modification
- Job deletion
- Application management
- Team management
- Company administration

---

## 🏗️ Architecture

The application follows a client-server architecture.

```text
┌───────────────────────────────┐
│          React Client         │
│                               │
│ React + Vite                  │
│ React Router                  │
│ Firebase Authentication       │
│ Axios                         │
│ Socket.IO Client              │
│ Chart.js                      │
└───────────────┬───────────────┘
                │
                │ HTTP / REST
                │
                ▼
┌───────────────────────────────┐
│       Node.js / Express       │
│                               │
│ Authentication               │
│ User Management              │
│ Jobs                         │
│ Applications                │
│ Companies                    │
│ Blogs                        │
│ Meetings                     │
│ Notifications                │
│ Administration               │
└───────────────┬───────────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
┌──────────────┐   ┌──────────────┐
│   Firebase   │   │ External APIs│
│              │   │              │
│ Auth         │   │ Zoom         │
│ Firestore    │   │ Gmail/SMTP   │
│ Storage      │   │              │
└──────────────┘   └──────────────┘
```

---

## 🧰 Technology Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Firebase
- Socket.IO Client
- Chart.js
- React Chart.js 2
- Lucide React
- Tailwind CSS
- PostCSS

### Backend

- Node.js
- Express 5
- Firebase Admin SDK
- Firestore
- Socket.IO
- Axios
- Nodemailer
- Multer
- CORS
- dotenv
- node-cron

### External Services

- Firebase Authentication
- Firebase Firestore
- Firebase Storage
- Zoom API
- Gmail/Nodemailer email service

---

## 📁 Project Structure

```text
Job_Community_Portal/
│
├── client/
│   ├── public/
│   │
│   ├── src/
│   │   ├── admin/
│   │   │   └── AdminPage.jsx
│   │   │
│   │   ├── components/
│   │   │   ├── Blog/
│   │   │   ├── Company/
│   │   │   ├── Jobs/
│   │   │   ├── BlogPostView.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Header.jsx
│   │   │
│   │   ├── config/
│   │   │   └── api.js
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── SocketContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── firebase/
│   │   │   └── firebaseConfig.js
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── BookMeeting.jsx
│   │   │   ├── Companies.jsx
│   │   │   ├── CompanyDashboard.jsx
│   │   │   ├── CompanyEdit.jsx
│   │   │   ├── CompanyPage.jsx
│   │   │   ├── CompanyProfile.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── MeetingApprovalPage.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── PublicProfile.jsx
│   │   │   └── Services.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── ...
│   │
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── ...
│
├── server/
│   ├── config/
│   │   ├── firebase.js
│   │   ├── mailer.js
│   │   └── zoom.js
│   │
│   ├── controllers/
│   │   └── user.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── roles.js
│   │   └── verifyToken.js
│   │
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── applications.routes.js
│   │   ├── auth.routes.js
│   │   ├── blog.routes.js
│   │   ├── company.routes.js
│   │   ├── job.routes.js
│   │   ├── meeting.routes.js
│   │   ├── notification.routes.js
│   │   └── user.routes.js
│   │
│   ├── utils/
│   │   ├── notifications.js
│   │   └── zoom.js
│   │
│   ├── app.js
│   ├── index.js
│   └── package.json
│
├── package.json
├── package-lock.json
└── README.md
```

---

## 🖥️ Frontend Routes

| Route | Purpose |
|---|---|
| `/` | Home page |
| `/jobs` | Job listings |
| `/jobs/:id` | Job details |
| `/create-job` | Create a job |
| `/blog` | Blog listing |
| `/blog/:id` | Blog details |
| `/create-blog` | Create a blog |
| `/services` | Services |
| `/book-meeting` | Meeting request |
| `/profile` | Current user's profile |
| `/users/:userId` | Public user profile |
| `/companies` | Company listing |
| `/company/:id` | Company profile |
| `/company/edit` | Edit company profile |
| `/company/dashboard` | Company dashboard |
| `/notifications` | User notifications |
| `/auth/register` | Registration |
| `/auth/login` | Login |
| `/admin` | Admin dashboard |
| `/admin/meeting-approval` | Meeting administration |

---

## 🔌 Backend API

The Express backend exposes REST endpoints for the major platform modules.

### Authentication

```text
POST /register
POST /login
```

### Users

```text
GET  /user/profile
PUT  /update-profile
GET  /public/stats
GET  /me/company
GET  /users/:userId/profile
```

### Jobs

```text
GET    /jobs
GET    /jobs/latest
GET    /jobs/:id
POST   /jobs/create
PUT    /jobs/:id/edit
DELETE /jobs/:id
PUT    /jobs/:id/apply
PUT    /jobs/:id/save
PUT    /jobs/:id/view
GET    /company/job-views/total
GET    /search-jobs
```

### Applications

```text
GET /applications/company/:companyId
PUT /applications/:id/status
PUT /applications/job/:jobId/withdraw
```

### Companies

```text
GET    /companies
GET    /company/:id
GET    /company/:companyId/jobs
GET    /company/:id/analytics
GET    /company/:companyId/team
DELETE /company/:companyId/team/:userId
POST   /company/profile/create
GET    /company/users
PUT    /company/update-user-role
PUT    /company/update
GET    /company/:id/employee-growth
```

### Blogs

```text
GET    /blogs
POST   /blogs
GET    /blogs/:id
PUT    /blogs/:id/like
PUT    /blogs/:id/dislike
PUT    /blogs/:id/edit
DELETE /blogs/:id
GET    /blogs/:id/comments
POST   /blogs/:id/comments
```

### Meetings

```text
POST /create-meeting
POST /meeting-request
GET  /admin/meetings
PUT  /admin/meetings/:id/approve
PUT  /admin/meetings/:id/decline
```

### Notifications

```text
GET /notifications
PUT /notifications/:id/read
GET /notifications/unread-count
```

### Administration

```text
GET /admin/users
GET /admin/jobs
GET /admin/blogs
PUT /admin/update-role
GET /admin/companies/pending
PUT /admin/companies/:id/approve
PUT /admin/companies/:id/reject
```

---

## 🗄️ Data Layer

The application uses **Cloud Firestore** for persistent application data.

The backend works with collections including:

```text
users
companies
jobs
applications
blogs
notifications
meeting_requests
```

Company employee records are also maintained under company-specific employee collections.

Firestore timestamps and server-side timestamps are used for records such as:

- Jobs
- Applications
- Companies
- Notifications
- Blog posts
- Meetings
- Employees

---

## 🔑 Environment Configuration

The frontend uses Vite environment variables for the backend API URL.

Create:

```text
client/.env.local
```

with:

```env
VITE_API_URL=http://localhost:5000
```

The backend uses environment variables for services such as:

```env
PORT=5000

EMAIL=your-email
EMAIL_PASSWORD=your-email-password

# Zoom credentials
# Firebase/Admin credentials as required by your configuration
```

Use your own Firebase, email, and Zoom credentials.

**Do not commit `.env`, `.env.local`, service-account credentials, API secrets, or passwords to the repository.**

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Firebase project
- Firebase Authentication configured
- Firestore configured

Additional configuration is required if you want to use:

- Gmail email notifications
- Zoom meeting creation

### 1. Clone the repository

```bash
git clone https://github.com/Sujit-Hiwale/Job_Community_Portal.git
cd Job_Community_Portal
```

### 2. Install dependencies

Install the root dependencies:

```bash
npm install
```

Then install the frontend and backend dependencies:

```bash
cd client
npm install

cd ../server
npm install

cd ..
```

### 3. Configure environment variables

Create:

```text
client/.env.local
```

and configure:

```env
VITE_API_URL=http://localhost:5000
```

Configure the required backend environment variables in:

```text
server/.env
```

### 4. Start the application

The root project is configured to start both the frontend and backend together.

From the project root:

```bash
npm run dev
```

This runs:

```text
Frontend → Vite development server
Backend  → Node.js / Express server
```

The root `package.json` uses `concurrently` to run both processes simultaneously.

### Individual Services

Frontend only:

```bash
npm run client
```

Backend only:

```bash
npm run server
```

---

## 🧪 Available Scripts

### Root

```bash
npm run dev
npm run client
npm run server
```

### Client

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Server

```bash
npm run dev
npm start
```

---

## 🔄 Application Flow

### User Authentication

```text
User
 │
 ▼
Firebase Authentication
 │
 ▼
Firebase ID Token
 │
 ▼
Express Backend
 │
 ▼
Token Verification
 │
 ▼
Firestore User Profile
 │
 ▼
Role & Company Context
 │
 ▼
Authorized Application Features
```

### Job Application

```text
Job Seeker
    │
    ▼
Browse / Search Jobs
    │
    ▼
View Job
    │
    ▼
Apply
    │
    ▼
Application stored in Firestore
    │
    ▼
Company reviews application
    │
    ▼
Application status updated
    │
    ▼
Applicant notification
```

### Meeting Workflow

```text
User
 │
 ▼
Meeting Request
 │
 ▼
Firestore
 │
 ├──► Admin Notification
 │
 ▼
Admin Review
 │
 ├── Decline ──► Email + Notification
 │
 └── Approve
        │
        ▼
     Zoom API
        │
        ▼
   Meeting Created
        │
        ├──► Zoom Join Link
        ├──► Email
        └──► In-App Notification
```

---

## 📊 Analytics

The platform provides company-level analytics derived from application and company data.

Tracked metrics include:

- Company profile views
- Job views
- Applications
- Top-performing jobs
- Employee growth
- Workforce distribution

The frontend uses Chart.js and `react-chartjs-2` for data visualization.

---

## 🧩 Main Frontend Modules

```text
Authentication
     │
     ├── Login
     ├── Registration
     └── Auth Context
     
Jobs
     │
     ├── Job Listing
     ├── Job Details
     ├── Job Creation
     └── Applications
     
Companies
     │
     ├── Company Profiles
     ├── Company Dashboard
     ├── Team Management
     ├── Analytics
     └── Company Jobs
     
Community
     │
     ├── Blogs
     ├── Likes / Dislikes
     └── Comments
     
Communication
     │
     ├── Notifications
     └── Meeting Requests
     
Administration
     │
     ├── User Management
     ├── Job Management
     ├── Blog Management
     ├── Company Approval
     ├── Role Management
     └── Meeting Approval
```

---

## ⚙️ Backend Middleware

The backend separates authentication and authorization responsibilities through middleware.

### `auth.js`

Handles Firebase ID-token verification for protected and optionally authenticated routes.

### `roles.js`

Loads user role and company information and provides authorization middleware for:

- Admin
- Super Admin
- Company Owner

### `verifyToken.js`

Provides Firebase token verification for authenticated requests.

---

## 📦 Dependencies

### Client

```text
React
React Router
Firebase
Axios
Socket.IO Client
Chart.js
React Chart.js 2
Lucide React
Tailwind CSS
Vite
```

### Server

```text
Express
Firebase Admin
Socket.IO
Axios
Nodemailer
Multer
CORS
dotenv
node-cron
```

---

## 🔗 Frontend–Backend Configuration

API access is centralized through:

```text
client/src/config/api.js
```

which reads:

```env
VITE_API_URL
```

This allows the frontend to use different backend endpoints without hardcoding the server URL throughout individual components.

The frontend API architecture follows:

```text
React Component
      │
      ▼
API_URL
      │
      ▼
Express REST API
      │
      ▼
Firebase / External Service
```
