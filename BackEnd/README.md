# GreatHire Backend

This repository contains the backend code for the GreatHire application. The backend is built using Node.js, Express, and MongoDB, and it provides APIs for managing users, recruiters, companies, jobs, applications, orders, and notifications.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [WebSocket Events](#websocket-events)
- [Cron Jobs](#cron-jobs)
- [Security](#security)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Sanketgreathire/GreatHire.git
    cd GreatHire/BackEnd
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    PORT=3000
    FRONTEND_URL=https://localhost:5173
    MONGODB_URI=your_mongodb_connection_string
    ```

4. Load SSL certificates:
    - Place your `key.pem` and `cert.pem` files in the root directory.

5. Start the server:
    ```sh
    npm run dev
    ```

## Usage

- The backend server will be running at `https://localhost:3000`.
- The frontend application should be configured to communicate with this backend server.

## API Endpoints

### User Routes
- `POST /api/v1/user/register` - Register a new user
- `POST /api/v1/user/login` - User login
- `GET /api/v1/user/profile` - Get user profile

### Recruiter Routes
- `POST /api/v1/recruiter/register` - Register a new recruiter
- `POST /api/v1/recruiter/login` - Recruiter login
- `GET /api/v1/recruiter/profile` - Get recruiter profile

### Company Routes
- `POST /api/v1/company` - Create a new company
- `GET /api/v1/company/:id` - Get company details

### Job Routes
- `POST /api/v1/job` - Create a new job
- `GET /api/v1/job/:id` - Get job details

### Application Routes
- `POST /api/v1/application` - Submit a new application
- `GET /api/v1/application/:id` - Get application details

### Order Routes
- `POST /api/v1/order` - Create a new order
- `GET /api/v1/order/:id` - Get order details

### Revenue Routes
- `GET /api/v1/revenue` - Get revenue details

### Notification Routes
- `GET /api/v1/notifications` - Get notifications

### Admin Routes
- `GET /api/v1/admin/stat` - Get admin statistics
- `GET /api/v1/admin/user/data` - Get user data
- `GET /api/v1/admin/company/data` - Get company data
- `GET /api/v1/admin/recruiter/data` - Get recruiter data
- `GET /api/v1/admin/job/data` - Get job data
- `GET /api/v1/admin/application/data` - Get application data

## WebSocket Events

- `newNotificationCount` - Emitted when there are new unseen notifications
- `planExpired` - Emitted when a subscription plan expires

## Cron Jobs

- **Plan Expiry Check**: Runs every hour to check for expired subscription plans (currently disabled)
- **Auto-Reject Applications**: Runs daily at 2:00 AM to automatically reject old pending applications
- **Monthly Free Plan Renewal**: Handles automatic renewal of free plans

### Auto-Reject Feature
The system automatically rejects job applications that have been pending for too long:
- Default: 30 days (configurable via `AUTO_REJECT_DAYS`)
- Sends email notifications to candidates
- Creates in-app notifications
- Runs daily at 2:00 AM

**Testing Commands:**
```bash
# Check feature status
npm run check:auto-reject

# Test email service
npm run test:email

# Test auto-reject process
npm run test:auto-reject

# Create test data
npm run backdate:applications
```

**Documentation:**
- [Auto-Reject Feature Guide](../AUTO_REJECT_FEATURE.md)
- [Quick Start Guide](../AUTO_REJECT_QUICK_START.md)
- [Implementation Summary](../AUTO_REJECT_IMPLEMENTATION_SUMMARY.md)

## Security

- The backend uses Helmet to set security-related HTTP headers.
- Rate limiting is applied to all API routes to prevent abuse.
- CORS is configured to allow requests from the frontend URL specified in the environment variables.

## License

This project is licensed under the MIT License.