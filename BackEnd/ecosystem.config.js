/**
 * PM2 Ecosystem Configuration
 * SAFE TO COMMIT (no secrets hardcoded)
 */

module.exports = {
  apps: [
    {
      name: "greathire-backend",
      script: "index.js",
      cwd: "/root/GreatHire/BackEnd",

      // App mode
      exec_mode: "fork",
      instances: 1,

      // Environment variables
      env: {
        NODE_ENV: "production",

        // These will be read from .env on the VPS
        RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
        RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
      },

      // Logs
      error_file: "/root/.pm2/logs/greathire-error.log",
      out_file: "/root/.pm2/logs/greathire-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};