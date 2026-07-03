# PatreonPlus

> A modern full-stack creator subscription platform that empowers creators to monetize exclusive content through secure subscription plans, recurring payments, and advanced analytics.

---

# Project Overview

PatreonPlus is a modern subscription-based web platform inspired by Patreon, designed to enable creators to publish premium content while allowing subscribers to access exclusive resources through recurring subscription plans.

The application follows a scalable three-tier architecture consisting of a React frontend, Express.js backend, and PostgreSQL database. It integrates third-party cloud services such as Stripe for subscription billing and Amazon S3 for secure media storage, providing a production-ready full-stack solution.

The project was developed using contemporary software engineering principles including modular architecture, RESTful APIs, role-based authentication, reusable components, secure coding practices, automated testing, and cloud integration.

Unlike traditional content-sharing platforms, PatreonPlus focuses on creating a secure ecosystem where creators have complete control over their subscription tiers, premium content, and subscriber engagement while maintaining a seamless user experience across desktop and mobile devices.

---

# Business Problem

Digital creators increasingly rely on online platforms to generate recurring revenue from their audiences. However, many existing platforms provide limited customization, expensive service fees, or lack flexibility for managing premium content and subscriptions.

Creators often require a centralized platform that allows them to:

- Publish premium content securely
- Manage multiple subscription tiers
- Process recurring subscription payments
- Store uploaded media safely
- Analyse subscriber growth and revenue
- Control access to exclusive resources

Subscribers also expect a modern platform where they can easily discover creators, subscribe to membership plans, access premium content, and manage billing without unnecessary complexity.

---

# Solution Overview

PatreonPlus addresses these challenges by providing a comprehensive creator subscription platform that combines content management, secure authentication, subscription billing, analytics, and cloud storage into a single web application.

The platform supports two primary user roles:

### Creator

Creators can:

- Create and manage subscription tiers
- Upload premium content
- Manage creator profiles
- View subscriber statistics
- Analyse revenue performance
- Track platform activity

### Subscriber

Subscribers can:

- Register securely
- Browse creators
- Subscribe to membership plans
- Access premium content
- Manage active subscriptions
- View billing information

The application separates presentation, business logic, and data persistence into independent layers, ensuring scalability and maintainability.

---

# Project Objectives

The primary objectives of PatreonPlus include:

- Design and develop a production-ready full-stack web application.
- Implement secure authentication using JSON Web Tokens (JWT).
- Support role-based authorization for creators and subscribers.
- Integrate Stripe for recurring subscription payments.
- Store uploaded media securely using Amazon S3.
- Develop responsive user interfaces using React.
- Provide creators with analytical insights into platform performance.
- Apply modern software engineering practices including modular architecture, reusable components, validation, automated testing, and cloud deployment.

---

# Core Features

## Authentication

- User Registration
- Secure Login
- JWT Authentication
- Password Encryption
- Protected Routes
- Session Management

---

## Creator Dashboard

Creators can:

- Manage personal profiles
- Create subscription tiers
- Upload premium content
- Edit published content
- Track subscriber growth
- Monitor revenue
- View analytics dashboard

---

## Subscriber Dashboard

Subscribers can:

- Discover creators
- Subscribe to premium plans
- Access exclusive posts
- View subscription history
- Manage memberships
- Update profile information

---

## Content Management

The platform provides secure content management capabilities including:

- Content publishing
- Content editing
- Media uploads
- Premium content visibility
- Tier-based access
- Secure storage

---

## Subscription Management

Subscription management includes:

- Subscription plans
- Membership tiers
- Active subscriptions
- Subscription cancellation
- Renewal management
- Billing status

---

## Analytics

The analytics module provides creators with valuable business insights including:

- Total subscribers
- Revenue overview
- Subscription statistics
- User activity
- Performance metrics
- Dashboard visualizations

---

## Cloud Storage

Amazon S3 is used to:

- Store uploaded images
- Store creator media
- Generate secure file URLs
- Deliver cloud-hosted assets
- Improve storage scalability

---

## Payment Processing

Stripe integration provides:

- Secure Checkout
- Subscription billing
- Payment confirmation
- Webhook processing
- Billing lifecycle management

---

# Technology Stack

## Frontend

| Technology | Purpose |
|------------|---------|
| React | User Interface |
| Vite | Development & Build Tool |
| Tailwind CSS | Responsive Styling |
| React Router | Client-side Routing |
| React Query | Server State Management |
| Axios | HTTP Client |
| Zod | Form Validation |
| Framer Motion | UI Animations |
| Recharts | Analytics Visualization |

---

## Backend

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript Runtime |
| Express.js | REST API Framework |
| Sequelize | ORM |
| PostgreSQL | Relational Database |
| JWT | Authentication |
| bcrypt | Password Encryption |
| Zod | Request Validation |

---

## Cloud Services

| Service | Purpose |
|----------|---------|
| AWS S3 | Cloud File Storage |
| Stripe | Subscription Payments |

---

## Development Tools

| Tool | Purpose |
|------|---------|
| Docker | Containerization |
| Git | Version Control |
| GitHub | Source Code Management |
| Jest | Unit Testing |
| Playwright | End-to-End Testing |

---

# Software Architecture

PatreonPlus follows a Three-Tier Architecture that separates the presentation layer, application layer, and data layer.

```text
                    Client Layer
                React + Tailwind CSS
                        │
                REST API Requests
                        │
                        ▼
             Application Layer
          Node.js + Express.js API
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
 Authentication      Stripe API      AWS S3
        │
        ▼
     PostgreSQL
```

### Architecture Benefits

- Separation of concerns
- Scalability
- Maintainability
- Improved testing
- Better security
- Modular development
- Independent deployment

---

# System Workflow

```text
User
 │
 ▼
React Application
 │
 ▼
Axios HTTP Request
 │
 ▼
Express REST API
 │
 ▼
Authentication Middleware
 │
 ▼
Business Logic
 │
 ├────────► PostgreSQL
 │
 ├────────► AWS S3
 │
 └────────► Stripe
 │
 ▼
JSON Response
 │
 ▼
React UI
```

The frontend communicates with the backend through RESTful APIs using Axios. Each request passes through authentication and validation middleware before reaching the business logic layer. Depending on the request, the backend interacts with PostgreSQL, AWS S3, or Stripe and returns a structured JSON response to the client.

---

# Project Structure

```text
PatreonPlus
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validations/
│   │   ├── utils/
│   │   └── styles/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── uploads/
│   │   └── tests/
│   └── package.json
│
├── docker/
├── .github/
├── README.md
└── docker-compose.yml
```

---

# Frontend Architecture

The frontend is developed using React with Vite and follows a component-based architecture. The application is organised into reusable modules to improve maintainability, readability, and scalability.

| Directory | Description |
|----------|-------------|
| `assets` | Static resources including images, icons, and fonts. |
| `components` | Reusable UI components shared across multiple pages. |
| `pages` | Main application screens such as login, dashboard, subscriptions, analytics, and profile pages. |
| `layouts` | Shared layouts used throughout the application. |
| `routes` | Client-side routing configuration using React Router. |
| `hooks` | Custom React hooks for reusable business logic. |
| `services` | Axios-based API communication layer. |
| `context` | Global application state such as authentication. |
| `validations` | Zod schemas for client-side validation. |
| `utils` | Utility functions and helper methods. |

The frontend communicates exclusively through RESTful APIs and manages asynchronous server state using React Query, reducing unnecessary network requests and improving application performance.

---

# Backend Architecture

The backend follows a modular Express.js architecture where each feature is separated into dedicated controllers, services, middleware, routes, and database models.

Each module is responsible for a single business domain, improving maintainability and supporting future scalability.

Major backend responsibilities include:

- User authentication
- Subscription management
- Payment processing
- Creator management
- Content management
- Analytics
- File uploads
- Validation
- Error handling
# Database Design

PatreonPlus uses **PostgreSQL** as the primary relational database management system. The database is designed using a normalized schema to ensure data consistency, integrity, and efficient query performance.

The application uses **Sequelize ORM** to manage database interactions, model relationships, migrations, and CRUD operations.

## Core Database Entities

| Entity | Description |
|----------|-------------|
| Users | Stores user account information, authentication details, and roles. |
| Creator Profiles | Stores creator-specific information including biography, profile image, and creator settings. |
| Subscription Tiers | Defines different membership plans offered by creators. |
| Subscriptions | Tracks active subscriptions between subscribers and creators. |
| Posts | Stores premium and public content created by creators. |
| Media | Stores uploaded file metadata and AWS S3 object references. |
| Payments | Maintains subscription payment records and transaction history. |
| Analytics | Stores creator performance metrics and platform statistics. |

## Database Relationships

The database follows relational principles where:

- One creator can create multiple subscription tiers.
- One creator can publish multiple posts.
- One subscriber can subscribe to multiple creators.
- Each subscription is linked to a payment record.
- Media assets are associated with creator content.
- Analytics aggregate platform activities for reporting.

This relational design minimizes data redundancy while supporting efficient retrieval of related information.

---

# Authentication & Authorization

PatreonPlus implements a secure authentication mechanism using **JSON Web Tokens (JWT)** combined with **Role-Based Access Control (RBAC)**.

## Authentication Flow

```text
User Login
      │
      ▼
Validate Credentials
      │
      ▼
Generate JWT Token
      │
      ▼
Return Access Token
      │
      ▼
Store Token on Client
      │
      ▼
Authenticated Requests
```

## Authorization

The platform supports role-based access using predefined user roles.

### Creator

Creators have permission to:

- Manage subscription tiers
- Upload premium content
- Edit creator profiles
- View analytics
- Manage subscribers

### Subscriber

Subscribers can:

- Browse creators
- Purchase subscriptions
- Access premium content
- Manage active subscriptions
- Update personal profiles

Protected API endpoints validate the authenticated user's role before executing business logic, ensuring users can only perform actions relevant to their permissions.

---

# External Integrations

## Stripe Integration

Stripe is integrated to provide secure recurring subscription payments.

### Features

- Secure Checkout
- Subscription Creation
- Billing Management
- Payment Confirmation
- Webhook Processing
- Subscription Status Tracking

### Payment Workflow

```text
Subscriber
      │
      ▼
Select Subscription Tier
      │
      ▼
Stripe Checkout
      │
      ▼
Payment Successful
      │
      ▼
Webhook Event
      │
      ▼
Update Subscription
      │
      ▼
Grant Premium Access
```

Stripe handles sensitive payment information, ensuring compliance with industry-standard security practices while simplifying recurring billing management.

---

## Amazon S3 Integration

Amazon S3 is used to securely store user-uploaded media assets.

### Storage Workflow

```text
Creator Uploads Media
          │
          ▼
Backend Validation
          │
          ▼
Upload to AWS S3
          │
          ▼
Store Object URL
          │
          ▼
Retrieve Asset
```

### Benefits

- Scalable cloud storage
- Secure media hosting
- Reduced backend storage requirements
- Faster content delivery
- High availability

---

# REST API Overview

The backend exposes RESTful endpoints that facilitate communication between the frontend and server.

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate user |
| POST | `/auth/logout` | Logout user |

---

## User

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/profile` | Retrieve user profile |
| PUT | `/users/profile` | Update profile |

---

## Creator

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/creator/dashboard` | Retrieve creator dashboard |
| POST | `/creator/tier` | Create subscription tier |
| PUT | `/creator/tier/:id` | Update subscription tier |
| DELETE | `/creator/tier/:id` | Delete subscription tier |

---

## Content

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/posts` | Publish content |
| GET | `/posts` | Retrieve posts |
| PUT | `/posts/:id` | Update content |
| DELETE | `/posts/:id` | Delete content |

---

## Subscription

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/subscriptions` | Create subscription |
| DELETE | `/subscriptions/:id` | Cancel subscription |
| GET | `/subscriptions` | Retrieve subscriptions |

---

## Uploads

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/uploads` | Upload media |
| GET | `/uploads/:id` | Retrieve media |

---

## Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics` | Retrieve creator analytics |

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Prithika-05/patreonplus.git
```

## Backend Installation

```bash
cd server
npm install
```

## Frontend Installation

```bash
cd ../client
npm install
```

---

# Environment Variables

Create a `.env` file in both the client and server directories.

### Server

```env
PORT=
DATABASE_URL=
JWT_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Client

```env
VITE_API_URL=
VITE_STRIPE_PUBLISHABLE_KEY=
```

---

# Running the Application

## Start Backend

```bash
cd server
npm run dev
```

## Start Frontend

```bash
cd client
npm run dev
```

The frontend will communicate with the backend through REST APIs, allowing users to access authentication, subscriptions, analytics, and content management features.

---
# Testing

PatreonPlus follows a comprehensive testing strategy to ensure the reliability, stability, and correctness of both the frontend and backend components. The project incorporates automated testing at multiple levels, including unit, integration, and end-to-end testing.

## Testing Frameworks

| Framework | Testing Type | Purpose |
|-----------|--------------|---------|
| Jest | Unit Testing | Validates individual functions, business logic, and utility modules. |
| Playwright | Integration Testing | Verifies interactions between application components, APIs, and services. |
| Playwright | End-to-End (E2E) Testing | Simulates real user workflows across the complete application in a browser environment. |

---

## Unit Testing (Jest)

Jest is used to validate isolated components of the application, ensuring that individual functions, services, and utility modules behave as expected.

Typical unit tests include:

- Utility functions
- Business logic
- Validation logic
- Service methods
- Helper functions

Run unit tests using:

```bash
npm test
```

---

## Integration Testing (Playwright)

Playwright is used to verify that different application components work together correctly. Integration tests validate communication between the frontend, backend, APIs, authentication mechanisms, and database interactions.

Integration testing covers scenarios such as:

- User authentication with backend APIs
- Content creation and retrieval
- Subscription workflow
- API response validation
- Form submission and validation
- Dashboard data rendering

---

## End-to-End Testing (Playwright)

Playwright also performs end-to-end testing by simulating real user interactions in supported browsers. These tests validate complete application workflows from the user's perspective.

Typical end-to-end scenarios include:

- User registration
- User login
- Creator dashboard navigation
- Subscription purchase
- Premium content access
- Media uploads
- Analytics dashboard navigation
- User logout

Run Playwright tests using:

```bash
npx playwright test
```

---

## Testing Strategy

The testing strategy ensures that:

- Individual modules function correctly through unit testing.
- Integrated application components communicate as expected.
- Complete user workflows operate successfully in a production-like environment.
- Application updates do not introduce regressions.
- Core business functionality remains reliable during continuous development.

This layered testing approach improves software quality, increases confidence during deployment, and supports long-term maintainability.
---

# Security Features

PatreonPlus incorporates multiple security mechanisms to protect user data and application resources.

- JSON Web Token (JWT) Authentication
- Role-Based Access Control (RBAC)
- Password Hashing using bcrypt
- Input Validation using Zod
- Protected API Routes
- Secure Environment Variable Management
- Centralized Error Handling
- Secure File Upload Validation
- CORS Configuration
- SQL Injection Mitigation through Sequelize ORM

---

# Deployment

The application is designed for deployment using modern cloud technologies.

| Component | Deployment |
|------------|------------|
| Frontend | Vercel / Docker |
| Backend | Render / Railway / Docker |
| Database | PostgreSQL |
| Storage | Amazon S3 |
| Payments | Stripe |

Docker support enables consistent deployment across development, staging, and production environments.

---

# License

This project is intended for academic and educational purposes.

---

# Author

**Prithika**

GitHub: https://github.com/Prithika-05

---

## Acknowledgements

This project was developed using several open-source technologies and services, including React, Node.js, Express.js, PostgreSQL, Sequelize, Tailwind CSS, Stripe, Amazon Web Services (AWS), Docker, Jest, Playwright, and other community-maintained libraries that contributed to the successful implementation of the application.

---