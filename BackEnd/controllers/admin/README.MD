## Admin Controller Documentation

This document provides an overview of the `admin.controller.js` file, which contains the logic for handling admin-related operations in the GreatHire application.

## Table of Contents
- [Register](#register)
- [Login](#login)
- [Get Admin List](#get-admin-list)
- [Remove Account](#remove-account)

## Register

### Endpoint
`POST /register`

### Description
This endpoint allows for the creation of a new admin profile. It validates the input, checks for existing users, hashes the password, creates a new admin, and sends a welcome email.

### Request Body
- `fullname`: String (required)
- `email`: String (required)
- `phoneNumber`: String (required)
- `password`: String (required)

### Response
- `200 OK`: Account created successfully.
- `400 Bad Request`: Validation errors.
- `500 Internal Server Error`: Server error.

## Login

### Endpoint
`POST /login`

### Description
This endpoint allows an admin to log in. It validates the input, checks the credentials, generates a JWT token, and returns the admin details without the password.

### Request Body
- `email`: String (required)
- `password`: String (required)

### Response
- `200 OK`: Login successful.
- `400 Bad Request`: Missing email or password.
- `500 Internal Server Error`: Server error.

## Get Admin List

### Endpoint
`GET /getAdmin-list`

### Description
This endpoint retrieves a list of all admins, excluding the owner.

### Response
- `200 OK`: List of admins.
- `500 Internal Server Error`: Server error.

## Remove Account

### Endpoint
`DELETE /remove-admin/:userId`

### Description
This endpoint allows the owner to remove an admin account by their user ID.

### Parameters
- `userId`: String (required)

### Response
- `200 OK`: Account removed successfully.
- `400 Bad Request`: Missing user ID.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: Server error.

## Error Handling
All endpoints handle errors gracefully and return appropriate HTTP status codes and messages.

## Dependencies
- `bcryptjs`: For hashing passwords.
- `jsonwebtoken`: For generating JWT tokens.
- `express-validator`: For validating request inputs.
- `nodemailer`: For sending emails.

## Middleware
- `isAuthenticated`: Ensures the user is authenticated.
- `validateUser`: Validates user registration data.
- `validateLogin`: Validates login data.

## Models
- `User`
- `Recruiter`
- `Admin`

For more details, refer to the respective files and their implementations.


## User Stats Controller Documentation

This document provides an overview of the `userStats.controller.js` file, which contains the logic for handling user statistics and related operations in the GreatHire application.

## Table of Contents
- [Get User Stats](#get-user-stats)
- [Get Users List](#get-users-list)
- [Get User](#get-user)
- [Get All Applications](#get-all-applications)

## Get User Stats

### Endpoint
`GET /get-stats`

### Description
This endpoint returns the total number of users in the application.

### Response
- `200 OK`: Successfully retrieved user stats.
- `500 Internal Server Error`: Server error.

## Get Users List

### Endpoint
`GET /user-stats`

### Description
This endpoint retrieves a list of all users along with their application count and formatted join date.

### Response
- `200 OK`: Successfully retrieved users list.
- `500 Internal Server Error`: Server error.

## Get User

### Endpoint
`GET /getUser/:userId`

### Description
This endpoint retrieves the details of a specific user by their user ID.

### Parameters
- `userId`: String (required)

### Response
- `200 OK`: Successfully retrieved user details.
- `400 Bad Request`: Invalid user ID.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: Server error.

## Get All Applications

### Endpoint
`GET /user-all-application/:userId`

### Description
This endpoint retrieves all applications submitted by a specific user.

### Parameters
- `userId`: String (required)

### Response
- `200 OK`: Successfully retrieved user applications.
- `500 Internal Server Error`: Server error.

## Error Handling
All endpoints handle errors gracefully and return appropriate HTTP status codes and messages.

## Dependencies
- `mongoose`: For interacting with MongoDB.

## Middleware
- `isAuthenticated`: Ensures the user is authenticated.

## Models
- `User`
- `Application`

For more details, refer to the respective files and their implementations.


## Company Stats Controller Documentation

This document provides an overview of the `companyStats.controller.js` file, which contains the logic for handling company statistics and related operations in the GreatHire application.

## Table of Contents
- [Get Company Stats](#get-company-stats)
- [Get Company List](#get-company-list)

## Get Company Stats

### Endpoint
`GET /get-stats`

### Description
This endpoint returns the total number of companies, active companies, and deactive companies in the application.

### Response
- `200 OK`: Successfully retrieved company stats.
- `500 Internal Server Error`: Server error.

## Get Company List

### Endpoint
`GET /company-list`

### Description
This endpoint retrieves a list of all companies with selected fields.

### Response
- `200 OK`: Successfully retrieved company list.
- `500 Internal Server Error`: Server error.

## Error Handling
All endpoints handle errors gracefully and return appropriate HTTP status codes and messages.

## Dependencies
- `mongoose`: For interacting with MongoDB.

## Middleware
- `isAuthenticated`: Ensures the user is authenticated.

## Models
- `Company`

For more details, refer to the respective files and their implementations.


## Recruiter Stats Controller Documentation

This document provides an overview of the `recruiterStats.controller.js` file, which contains the logic for handling recruiter statistics and related operations in the GreatHire application.

## Table of Contents
- [Get Recruiter Stats](#get-recruiter-stats)
- [Get Recruiters List](#get-recruiters-list)
- [Get All Recruiters List](#get-all-recruiters-list)
- [Get Recruiter](#get-recruiter)

## Get Recruiter Stats

### Endpoint
`GET /get-stats`

### Description
This endpoint returns the total number of recruiters, active recruiters, and deactive recruiters in the application.

### Response
- `200 OK`: Successfully retrieved recruiter stats.
- `500 Internal Server Error`: Server error.

## Get Recruiters List

### Endpoint
`GET /recruiter-stats/:companyId`

### Description
This endpoint retrieves a list of recruiters for a specific company, including their job postings and status.

### Parameters
- `companyId`: String (required)

### Response
- `200 OK`: Successfully retrieved recruiters list.
- `404 Not Found`: Company not found.
- `500 Internal Server Error`: Server error.

## Get All Recruiters List

### Endpoint
`GET /getAllRecruiter-stats`

### Description
This endpoint retrieves a list of all recruiters across all companies, including their job postings and status.

### Response
- `200 OK`: Successfully retrieved all recruiters list.
- `500 Internal Server Error`: Server error.

## Get Recruiter

### Endpoint
`GET /getUser/:userId`

### Description
This endpoint retrieves the details of a specific recruiter by their user ID.

### Parameters
- `userId`: String (required)

### Response
- `200 OK`: Successfully retrieved recruiter details.
- `400 Bad Request`: Invalid user ID.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: Server error.

## Error Handling
All endpoints handle errors gracefully and return appropriate HTTP status codes and messages.

## Dependencies
- `mongoose`: For interacting with MongoDB.

## Middleware
- `isAuthenticated`: Ensures the user is authenticated.

## Models
- `Company`
- `Recruiter`

For more details, refer to the respective files and their implementations.


## Job Stats Controller Documentation

This document provides an overview of the `jobStats.controller.js` file, which contains the logic for handling job statistics and related operations in the GreatHire application.

## Table of Contents
- [Get Job Stats](#get-job-stats)
- [Get All Job List](#get-all-job-list)

## Get Job Stats

### Endpoint
`GET /get-stats`

### Description
This endpoint returns the total number of jobs, active jobs, and deactive jobs in the application.

### Response
- `200 OK`: Successfully retrieved job stats.
- `500 Internal Server Error`: Server error.

## Get All Job List

### Endpoint
`GET /getAllJobs-stats`

### Description
This endpoint retrieves a list of all jobs with selected fields, including the number of applications and formatted posted date.

### Response
- `200 OK`: Successfully retrieved job list.
- `500 Internal Server Error`: Server error.

## Error Handling
All endpoints handle errors gracefully and return appropriate HTTP status codes and messages.

## Dependencies
- `mongoose`: For interacting with MongoDB.

## Middleware
- `isAuthenticated`: Ensures the user is authenticated.

## Models
- `Job`

For more details, refer to the respective files and their implementations.


## Application Stats Controller Documentation

This document provides an overview of the `applicationStats.controller.js` file, which contains the logic for handling application statistics and related operations in the GreatHire application.

## Table of Contents
- [Get Application Stats](#get-application-stats)

## Get Application Stats

### Endpoint
`GET /get-stats`

### Description
This endpoint returns the total number of applications in the application.

### Response
- `200 OK`: Successfully retrieved application stats.
- `500 Internal Server Error`: Server error.

## Error Handling
All endpoints handle errors gracefully and return appropriate HTTP status codes and messages.

## Dependencies
- `mongoose`: For interacting with MongoDB.

## Middleware
- `isAuthenticated`: Ensures the user is authenticated.

## Models
- `Application`

For more details, refer to the respective files and their implementations.


## Statistic Controller Documentation

This document provides an overview of the `statistic.controller.js` file, which contains the logic for handling various statistics and related operations in the GreatHire application.

## Table of Contents
- [Get Statistic In Range](#get-statistic-in-range)
- [Get Applications Data By Year](#get-applications-data-by-year)
- [Get Recent Activity](#get-recent-activity)
- [Get Recent Job Postings](#get-recent-job-postings)
- [Get Reported Job List](#get-reported-job-list)

## Get Statistic In Range

### Endpoint
`GET /getState-in-range`

### Description
This endpoint retrieves statistics within a specified date range, including revenue trends, new users, and application statuses.

### Query Parameters
- `year`: Number (optional)
- `range`: Number (optional)

### Response
- `200 OK`: Successfully retrieved statistics.
- `500 Internal Server Error`: Server error.

## Get Applications Data By Year

### Endpoint
`GET /applications`

### Description
This endpoint retrieves the number of applications submitted each month for a specified year.

### Query Parameters
- `year`: Number (required)

### Response
- `200 OK`: Successfully retrieved applications data.
- `400 Bad Request`: Invalid or missing year parameter.
- `500 Internal Server Error`: Server error.

## Get Recent Activity

### Endpoint
`GET /recent-activity`

### Description
This endpoint retrieves the most recent activities, including user registrations, company registrations, recruiter registrations, job postings, and application submissions.

### Response
- `200 OK`: Successfully retrieved recent activity.
- `500 Internal Server Error`: Server error.

## Get Recent Job Postings

### Endpoint
`GET /recent-job-postings`

### Description
This endpoint retrieves the most recent job postings, including job title, company name, posting time, application count, and job status.

### Response
- `200 OK`: Successfully retrieved recent job postings.
- `500 Internal Server Error`: Server error.

## Get Reported Job List

### Endpoint
`GET /reported-job-list`

### Description
This endpoint retrieves a list of reported jobs, including user details, job details, report title, and description.

### Response
- `200 OK`: Successfully retrieved reported job list.
- `500 Internal Server Error`: Server error.

## Error Handling
All endpoints handle errors gracefully and return appropriate HTTP status codes and messages.

## Dependencies
- `mongoose`: For interacting with MongoDB.

## Middleware
- `isAuthenticated`: Ensures the user is authenticated.

## Models
- `Job`
- `User`
- `Recruiter`
- `Application`
- `Company`
- `Revenue`
- `JobReport`

For more details, refer to the respective files and their implementations.