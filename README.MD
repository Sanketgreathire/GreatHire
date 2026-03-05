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
