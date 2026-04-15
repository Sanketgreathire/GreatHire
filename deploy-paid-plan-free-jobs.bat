@echo off
echo ========================================
echo   PAID PLAN FREE JOBS DEPLOYMENT
echo ========================================
echo.

echo 1. Running migration to initialize new fields...
node BackEnd/migrate-paid-plan-free-jobs.js
echo.

echo 2. Testing the implementation...
node BackEnd/test-paid-plan-free-jobs.js
echo.

echo ========================================
echo   DEPLOYMENT COMPLETED!
echo ========================================
echo.
echo SUMMARY:
echo - Backend: Added free jobs tracking for paid plans
echo - Frontend: Updated job limits display and verification flow
echo - Migration: Initialized new fields for existing companies
echo.
echo WHAT'S NEW:
echo - STANDARD Plan: 5 paid + 2 free = 7 total jobs/month
echo - PREMIUM Plan: 15 paid + 2 free = 17 total jobs/month  
echo - ENTERPRISE Plan: Unlimited paid + 2 free jobs/month
echo - Free jobs are consumed first, then paid jobs
echo - Monthly reset for free jobs (same as existing free plan)
echo.
echo The feature is now ready for use!
pause