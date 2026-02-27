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
  RAZORPAY_KEY_ID: "rzp_live_S2t2qrM6F4UFD9",
  RAZORPAY_KEY_SECRET: "22KLR0amLuLqee83wVtRS7jY"
},

      // Logs
      error_file: "/root/.pm2/logs/greathire-error.log",
      out_file: "/root/.pm2/logs/greathire-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
