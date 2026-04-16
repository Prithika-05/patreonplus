# Introduction
Patreon+ is a modern, full-stack creator subscription platform designed to streamline the relationship between content creators and their audiences. The system enables creators to publish exclusive content, define customizable membership tiers with time-bound access, and track subscriber engagement. Subscribers can discover creators, subscribe to specific tiers, and consume time-unlocked content through an intuitive, role-based interface.

## Access URL of application
http://54.154.142.197/

# Patreon Docs - Backend
A robust, Node.js/Express backend for a creator subscription platform. The system enables creators to publish exclusive content, manage subscription tiers with custom pricing and access durations, and track subscribers. Subscribers can discover creators, subscribe to specific tiers, and access time-unlocked content. Built with a clean MVC-inspired architecture, JWT-based authentication, and PostgreSQL via Sequelize ORM.

## Tech Stack
- Runtime: Node.js
- Framework: Express.js
- Database: PostgreSQL
- ORM: Sequelize
- Authentication: JSON Web Tokens (JWT) + bcrypt
- Utilities: cors, dotenv, nodemon

## Prerequisites
    - Installation & Setup
        - npm install
    - Environment Variables
        - Create a .env file in the root directory
    - Clone & Navigate
        - git clone <your-repo-url>
        - cd server
    - Run the Development Server
        - npm run dev

## Step 1
- Authentication & Authorization

        - JWT-based Auth: Users receive a signed token on login containing id and role
        - Middleware Pipeline:
            authenticate -> Verifies token, attaches req.user, handles expired/invalid tokens.
            authorizeRole -> Restricts route access to specific roles (creator or subscriber).
        - Password Security: All passwords are hashed with bcrypt before storage and verified securely during login.

## Step 2
- Database & ORM

        - Sequelize manages PostgreSQL connections and model relationships.
        - Auto-Sync: sequelize.sync() on startup ensures schema matches models.

## Step 3
- Routing

        - server.js
            Application entry point. Loads .env variables, imports all Sequelize models, authenticates the DB connection, runs sequelize.sync(), and starts the HTTP server.
        - app.js
            Express configuration. Sets up global middleware (cors, express.json()), mounts all module routers to their base paths (/auth, /tiers, etc.), and defines a health-check route (/).
        - config/database.js
            Database setup. Initializes a Sequelize instance using PostgreSQL credentials from .env. Exports the connection for use across all models.
        - utils/password.js
            Security utility. Contains hashPassword() and comparePassword() wrappers around bcrypt for secure password handling.
    
## Step 4
    - modules/auth/
        - auth.routes.js : public endpoints /signup and /login.
        - auth.controller.js : Extracts request body, calls auth service, returns formatted JSON responses.
        - auth.service.js
            - Signup: Checks for existing email, hashes password, creates user.
            - Login: Validates credentials, generates signed JWT with id & role.
        - auth.middleware.js
            - authenticate: Verifies Bearer token, decodes JWT, attaches req.user.
            - authorizeRole(...roles): Blocks access if req.user.role isn't in the allowed list. (Imported globally by other modules)

## Step 5 
    - modules/users/
        - user.model.js: Defines User schema (id, name, username, email, password, role, bio, profileImage).
        -user.routes.js: Defines /search and /profile/:username.
        - user.controller.js: Handles search/profile requests and error mapping.
        - user.service.js
            - Search: Filters role='creator', uses Op.like for username matching.
            - Profile: Fetches user + associated tiers ordered by level.

## Step 6
    - modules/tiers/
        - tier.model.js: Defines Tier schema (name, price, unlockDuration, level, creatorId). Associates with User. Enforces unique (creatorId, level) index.
        - tier.routes.js: CRUD + /reorder endpoints. Protected: authenticate + authorizeRole('creator').
        - tier.controller.js: Passes req.user.id as creatorId to service layer.
        - tier.service.js
            -Auto-leveling: Assigns next available level on creation.
            - Ownership checks: Prevents creators from editing/deleting others' tiers.
            - Reordering: Batch updates level for multiple tiers.
        
## Step 7
    - modules/contents/
        - content.model.js: Defines Content schema (title, description, fileUrl, creatorId, tierId). Associates with User and Tier.
        - content.routes.js: CRUD endpoints. Protected: authenticate + authorizeRole('creator').
        - content.controller.js: content.controller.js
        - content.service.js
            - Ensures tierId exists and belongs to the requesting creator before create/update.
            - Verifies creatorId === userId on read/delete operations.

## Step 8
    - modules/subscriptions/
        - subscription.model.js: Defines Subscription schema (startDate, endDate, status, subscriberId, creatorId, tierId). 
        - subscription.routes.js: /subscribe, /my-subscriptions, /cancel/:id. Protected: authenticate + authorizeRole('subscriber').
        - subscription.controller.js: Extracts tierId or subscription id, forwards to service.
        - subscription.service.js
            - Subscribe: Calculates endDate = now + tier.unlockDuration (days). If active subscription exists, updates it; otherwise creates new.
            - My Subscriptions: Fetches with included tier and creator data.
            - Cancel: Sets status='cancelled' after verifying ownership.

# Patreon Docs - Frontend
A modern, full-stack platform connecting creators with subscribers, featuring a vibrant design system, real-time analytics, and secure membership management.

## Tech Stack
- Frontend: React 18 + Vite
- Language: JavaScript (ES6+)
- Styling: Tailwind CSS v4 (Custom Theme)
- UI Components: shadcn/ui (Radix Primitives)
- State Management: TanStack Query (React Query)
- Routing: React Router DOM v6
- Animations: Framer Motion
- Icons: Lucide React
- Notifications: Sonner

## Prerequisites
    - Installation & Setup
        - npm install
    - Environment Variables
        - Create a .env file in the root directory and add your backend API URL
    - Run the Development Server
        - npm run dev

## Step 1
-Routing
        - src/App.js
            - The root component that sets up routing.
            - Defines routes (/login, /creator/*, /subscriber/*).
            - Wraps protected routes with logic to check AuthContext.
            - Redirects users to the correct landing page based on their role.
        
        - src/main.jsx
            - Renders <App/>.
            - Wraps the app in QueryClientProvider (for TanStack Query) and AuthContextProvider.
            - Imports index.css to apply global styles.

## Step 2
- UI Components

        - src/components/ui/
            - These are atomic, accessible components built on top of Radix UI and styled with Tailwind. They consume the CSS variables from index.css.

            - button.jsx: Renders interactive buttons with variants (default, destructive, outline, ghost, secondary). Handles loading states and icons.
            - card.jsx: A container with header, content, and footer sections. Used for dashboards, feed posts, and tier cards.
            - input.jsx / label.jsx: Styled form inputs with focus rings matching the theme color.
            - dialog.jsx: Accessible modal/popover component used for "Create Tier" or "Edit Profile" forms.
            - avatar.jsx: Displays user images with fallback initials. Includes gradient styling logic.
            - badge.jsx: Small status indicators (e.g., "Active", "Level 1").
            - table.jsx: Structured data display for lists like "Recent Subscriptions".
            - select.jsx: Dropdown menus for selecting tiers or roles.

## Step 3
-  Service Layer

        - src/services/
            - These files abstract API calls using axios (or fetch) and TanStack Query
            - auth.service.js: Handles /login, /signup, and token management.
            - tier.service.js: CRUD operations for membership tiers (getAllTiers, createTier, updateTier, deleteTier).
            - content.service.js: Fetches feed content, uploads media, and manages creator posts.
            - subscription.service.js: Handles subscribing to creators, canceling subscriptions, and fetching user subscription history.
            - user.service.js: Fetches public profiles, searches creators, and updates user details.
            - analytics.service.js: Retrieves dashboard statistics (revenue, active subs) for the Creator Dashboard.

## Step 4
- Layout Modules

        - src/layouts/CreatorLayout.jsx
            - Role: Creator Only
            - Sidebar: Glass-morphism navigation with links to Dashboard, Tiers, and Content.
            - Header: Sticky top bar with user profile and notifications.
            - Main Area: Renders the specific page content via <Outlet />.

        -src/layouts/SubscriberLayout.jsx
            - Role: Subscriber Only
            - Sidebar: Links to Feed, My Subscriptions, and Explore.
            - Header: Search bar, notification bell, and user menu.

## Step 5
- Authentication Pages

        - pages/Login.jsx
            - Form for email/password.
            - Redirects based on user role (Creator → Dashboard, Subscriber → Feed).
        - pages/Signup.jsx
            - Field form (Name, Username, Email, Password, Role).
            - Includes a role selector (Creator vs. Subscriber).

## Step 6
- Creator Pages

        - pages/DashboardHome.jsx
            - Displays Revenue, Active Subs, Total Tiers, and Content count with animated counters.
            - Recent Activity Table: Shows latest subscriber actions.
            - Quick Actions: Cards linking to "Create Tier" or "Post Content".

        - pages/Tiers.jsx
            - Displays membership tiers as pricing cards.
            - A sophisticated form to Create/Edit tiers.
            - Handles sorting, deletion confirmation, and optimistic UI updates.

        - pages/Contents.jsx
            - Visual gallery of posts/videos.
            - Form to add title, description, file URL, and assign access tiers.

## Step 7
- Subscriber Pages

        - pages/Feed.jsx:
            - Infinite-scroll style list of content cards from subscribed creators.
            - Interactions: Like, Comment, Share buttons (visual), and "View Content" action.
        - pages/MySubscriptions.jsx:
            - Lists all active/expired subscriptions.
            - Progress bars showing time remaining, status badges, and creator avatars.
            - Cancel subscription flow with confirmation.
        - pages/Explorer.jsx:
            - Search bar to find creators by name/niche.
            - Creator Cards: Rich profile cards with bios and "View Profile" CTAs.
            - Skeleton Loading: Smooth loading states while fetching data.
        - pages/PublicProfile.jsx:
            - Pricing table allowing subscribers to choose and buy a tier directly.
            - Handles the subscription mutation and redirects to the subscriptions page upon success.

## Testing: User Service & Content Flow

## Backend Unit Tests: user.test.js
 Validate the business logic of user-related service functions in complete isolation from the database.

- Verifies that searching with an empty query returns the 5 most recent creators, while searching with a keyword filters users by username using partial matching.
- Confirms that requesting a creator's profile returns both user details and their pricing tiers in ascending order, while requesting a non-creator returns only user details with an empty tiers list.
- Ensures that requesting a non-existent user properly throws a "User not found" error.

## Frontend E2E Tests: content.e2e.spec.js
Validate the complete user journey for content creation, from authentication through UI interaction to backend persistence and deletion.
What Gets Tested:
- User signup, login, and JWT token generation via API.
- Creating a pricing tier that will be associated with content.
- Injecting the authentication token into the browser before the application loads.
- Opening the content modal, filling form fields, and selecting a tier from a dynamic dropdown.
- Submitting the form and verifying the new content appears in the list.
- Removing content and confirming it disappears from the UI.
Testing Strategy:
- Tests span API endpoints, authentication middleware, React components, and state management.

# Summary
Patreon+ is a modular, production-ready Node.js/Express API built for a creator subscription platform. It empowers creators to design tiered membership plans, publish time-unlocked content, and manage subscriber access, while enabling subscribers to discover creators, purchase tiers, and consume exclusive material.The architecture follows a clean, service-layer pattern that strictly separates HTTP routing, business logic, and data access, ensuring high maintainability and testability.

# References
- React : https://react.dev
- Vite : https://vitejs.dev
- shadcn/ui : https://ui.shadcn.com
- TanStack Query : https://tanstack.com/query/latest
- Framer Motion : https://www.framer.com/motion/
- Sonner : https://sonner.emilkowal.ski
- Lucid React : https://lucide.dev
- Node.js : https://nodejs.org/en/docs
- Express.js : https://expressjs.com
- PostgreSQL : https://www.postgresql.org/docs
- Sequelize : https://sequelize.org/docs/v6/
- GitHub : https://docs.github.com
