# Task Manager App

A full-stack Task Management application that enables users to register, log in, and manage tasks across three stages: **Todo**, **In Progress**, and **Done**.

## Features

### Authentication

* User Registration
* User Login
* JWT-based Authentication
* Protected API Routes
* Password Hashing using bcrypt

### Task Management

* Create Tasks
* View Tasks
* Update Tasks
* Delete Tasks
* Change Task Status

  * Todo
  * In Progress
  * Done

### User Experience

* Responsive UI
* Loading States
* Error Handling
* Clean Dashboard Interface

---

## Tech Stack

### Frontend

* React.js
* Vite
* Axios
* React Router
* Tailwind CSS

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs

### Database

* MySQL
* Sequelize ORM

---

## Technical Decisions & Assumptions

### Database Strategy (MySQL)

MySQL was selected as the primary database because it is widely used in production environments, provides strong relational data integrity, and scales effectively for future enhancements. Sequelize ORM was used to simplify database operations and model relationships.

### Authentication Strategy

JWT (JSON Web Tokens) were implemented for stateless authentication. This approach removes the need for server-side session storage and allows the application to scale more easily.

### ORM Choice

Sequelize was used to:

* Simplify database interactions
* Manage model relationships
* Handle schema synchronization
* Improve code maintainability

### State Management

React's built-in hooks (`useState`, `useEffect`) were sufficient for the project scope. This avoided unnecessary complexity introduced by larger state management libraries.

### UI Design

Tailwind CSS was chosen for:

* Rapid UI development
* Responsive design
* Consistent styling
* Reduced CSS maintenance

---

## Database Schema

### Users

| Field    | Type    |
| -------- | ------- |
| id       | Integer |
| username | String  |
| email    | String  |
| password | String  |
| role     | Enum    |
| isActive | Boolean |

### Tasks

| Field       | Type    |
| ----------- | ------- |
| id          | Integer |
| userId      | Integer |
| name        | String  |
| description | Text    |
| category    | String  |
| dueDate     | Date    |
| status      | Enum    |

### Audit Logs

| Field      | Type    |
| ---------- | ------- |
| id         | Integer |
| userId     | Integer |
| action     | String  |
| entityType | String  |
| entityId   | Integer |
| oldValue   | JSON    |
| newValue   | JSON    |

---

## Project Structure

```text
task-manager/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   ├── config/
│   └── server.js
│
└── README.md
```

---

## Installation & Setup

### Clone Repository

```bash
git clone <repository-url>
cd task-manager
```

---

### Backend Setup

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_manager

JWT_SECRET=your_secret_key
```

Create MySQL database:

```sql
CREATE DATABASE task_manager;
```

Start backend server:

```bash
node server.js
```

or

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

### Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start application:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Tasks

```http
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

---






