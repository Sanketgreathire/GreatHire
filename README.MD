# GreatHire Project Documentation



## Project Setup

This project consists of two main parts: the frontend and the backend. Follow the instructions below to set up both parts of the project.

### Prerequisites

Make sure you have the following installed on your machine:
- Node.js (v14 or higher)
- npm (v6 or higher)

### Frontend Setup

1. Navigate to the frontend directory:
    ```sh
    cd /GreatHire/frontend
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Start the development server:
    ```sh
    npm run dev
    ```

4. To build the project for production:
    ```sh
    npm run build
    ```

5. To preview the production build:
    ```sh
    npm run preview
    ```

6. To lint the code:
    ```sh
    npm run lint
    ```

### Backend Setup

1. Navigate to the backend directory:
    ```sh
    cd /GreatHire/BackEnd
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Start the development server:
    ```sh
    npm run dev
    ```

## Additional Information

- The frontend is built using React and Vite.
- The backend is built using Express.js.
- Make sure to configure environment variables as needed for both frontend and backend.

## New Features

### Auto-Sourcing System
Automatically fetch candidates from public sources into your database:
- ✅ GitHub profile scraping with smart search
- ✅ Automated daily cron job (3:00 AM)
- ✅ Smart deduplication and skill normalization
- ✅ Multi-recruiter support
- ✅ Per-recruiter configuration and stats
- ✅ Configurable search criteria
- ✅ Rate-limited API calls
- ✅ REST API for configuration management
- ✅ **One-click trigger button in admin panel**
- ✅ **View all auto-sourced candidates in admin dashboard**

**Where to View:**
- Admin Dashboard: `/admin/dashboard` - See total count
- AI Sourcing Page: `/admin/ai-sourcing` - View all candidates, trigger manually
- Recruiter Page: `/recruiter/dashboard/sourcing` - Recruiters see their own

**Quick Start:**
```bash
# 1. Add GitHub token to .env (optional but recommended)
GITHUB_TOKEN=your_github_token

# 2. Initialize configs for existing recruiters (run once)
npm run init:auto-sourcing

# 3. Test manually
npm run test:auto-sourcing

# 4. Runs automatically at 3 AM daily
npm run dev
```

**Manual Trigger:**
1. Login as admin
2. Go to `/admin/ai-sourcing`
3. Click "Trigger Auto-Sourcing" button
4. Wait 5 seconds for results

**API Endpoints:**
- GET `/api/v1/auto-sourcing/config` - Get configuration
- PUT `/api/v1/auto-sourcing/config` - Update configuration
- GET `/api/v1/auto-sourcing/stats` - Get statistics
- POST `/api/v1/auto-sourcing/trigger` - Manual trigger (admin)

**Documentation:**
- Full Guide: [AUTO_SOURCING_FEATURE.md](./AUTO_SOURCING_FEATURE.md)
- Quick Start: [AUTO_SOURCING_QUICK_START.md](./AUTO_SOURCING_QUICK_START.md)
- Implementation: [AUTO_SOURCING_IMPLEMENTATION.md](./AUTO_SOURCING_IMPLEMENTATION.md)
- User Guide: [AUTO_SOURCING_USER_GUIDE.md](./AUTO_SOURCING_USER_GUIDE.md)
- Architecture: [AUTO_SOURCING_ARCHITECTURE.md](./AUTO_SOURCING_ARCHITECTURE.md)

### Verification-Based Job Posting
Recruiters can now start posting jobs immediately without waiting for verification:
- ✅ Post 1 free job before company verification
- ✅ Post 2nd free job after admin verification
- ✅ Clear status messages and banners
- ✅ Automatic unlock after verification
- ✅ Smooth transition to credit-based system

**How it works:**
1. New recruiter signs up → Can post 1 job immediately
2. After 1st job → Must wait for admin verification
3. Admin verifies company → 2nd free job unlocked automatically
4. After 2 free jobs → Normal credit system applies (500 credits per job)

**Documentation:**
- Full Guide: [VERIFICATION_BASED_JOB_POSTING.md](./VERIFICATION_BASED_JOB_POSTING.md)
- Testing Guide: [VERIFICATION_TESTING_GUIDE.md](./VERIFICATION_TESTING_GUIDE.md)

**Migration:**
```bash
# Run this ONCE after deploying the new code
node BackEnd/migrate-free-jobs.js
```

### Auto-Reject Job Applications
The system now automatically rejects job applications that have been pending for too long. This feature:
- ✅ Automatically rejects applications older than configured days (default: 30 days)
- ✅ Sends professional rejection emails to candidates
- ✅ Creates in-app notifications
- ✅ Runs daily at 2:00 AM via cron job
- ✅ Configurable via `AUTO_REJECT_DAYS` environment variable

**Quick Start:**
```bash
# The feature is already configured and will run automatically
# To test manually:
node BackEnd/test-auto-reject.js
```

**Documentation:**
- Full Guide: [AUTO_REJECT_FEATURE.md](./AUTO_REJECT_FEATURE.md)
- Quick Start: [AUTO_REJECT_QUICK_START.md](./AUTO_REJECT_QUICK_START.md)

For any issues or contributions, please open an issue or submit a pull request on the project's repository.

Happy coding!
