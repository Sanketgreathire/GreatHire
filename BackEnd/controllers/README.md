## User Controller Documentation

This document provides an overview of the user controller and its functionalities in the GreatHire backend application.

## Table of Contents
- [Introduction](#introduction)
- [Endpoints](#endpoints)
    - [Register](#register)
    - [Login](#login)
    - [Google Login](#google-login)
    - [Update Profile](#update-profile)
    - [Send Message](#send-message)
    - [Forgot Password](#forgot-password)
    - [Reset Password](#reset-password)
    - [Logout](#logout)
    - [Delete Account](#delete-account)
- [Middleware](#middleware)
- [Error Handling](#error-handling)

## Introduction

The user controller handles various user-related operations such as registration, login, profile updates, and more. It interacts with the user model and other related models to perform these operations.

## Endpoints

### Register

**Endpoint:** `/register`  
**Method:** `POST`  
**Description:** Registers a new user.  
**Request Body:**
```json
{
    "fullname": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890",
    "password": "password123"
}
```
**Response:**
```json
{
    "message": "Account created successfully.",
    "success": true,
    "user": { ... }
}
```

### Login

**Endpoint:** `/login`  
**Method:** `POST`  
**Description:** Logs in a user.  
**Request Body:**
```json
{
    "email": "john.doe@example.com",
    "password": "password123"
}
```
**Response:**
```json
{
    "message": "Welcome John Doe",
    "user": { ... },
    "success": true
}
```

### Google Login

**Endpoint:** `/googleLogin`  
**Method:** `POST`  
**Description:** Logs in a user using Google authentication.  
**Request Body:**
```json
{
    "code": "authorization_code",
    "role": "student"
}
```
**Response:**
```json
{
    "message": "Welcome back John Doe",
    "user": { ... },
    "success": true
}
```

### Update Profile

**Endpoint:** `/profile/update`  
**Method:** `PUT`  
**Description:** Updates the user's profile.  
**Request Body:**
```json
{
    "fullname": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890",
    ...
}
```
**Response:**
```json
{
    "message": "Profile updated successfully.",
    "user": { ... },
    "success": true
}
```

### Send Message

**Endpoint:** `/sendMessage`  
**Method:** `POST`  
**Description:** Sends a message from the contact section of the website.  
**Request Body:**
```json
{
    "fullname": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890",
    "message": "Hello, I need help with..."
}
```
**Response:**
```json
{
    "message": "Our team will be in touch with you soon!",
    "success": true
}
```

### Forgot Password

**Endpoint:** `/forgot-password`  
**Method:** `POST`  
**Description:** Sends a password reset link to the user's email.  
**Request Body:**
```json
{
    "email": "john.doe@example.com"
}
```
**Response:**
```json
{
    "message": "Password reset link sent successfully.",
    "success": true
}
```

### Reset Password

**Endpoint:** `/reset-password`  
**Method:** `POST`  
**Description:** Resets the user's password.  
**Request Body:**
```json
{
    "decoded": { ... },
    "newPassword": "newpassword123"
}
```
**Response:**
```json
{
    "message": "Password reset successfully.",
    "success": true
}
```

### Logout

**Endpoint:** `/logout`  
**Method:** `GET`  
**Description:** Logs out the user.  
**Response:**
```json
{
    "message": "Logged out successfully.",
    "success": true
}
```

### Delete Account

**Endpoint:** `/delete`  
**Method:** `DELETE`  
**Description:** Deletes the user's account.  
**Request Body:**
```json
{
    "email": "john.doe@example.com"
}
```
**Response:**
```json
{
    "message": "User account deleted successfully.",
    "success": true
}
```

## Middleware

The following middleware functions are used in the user routes:
- `isAuthenticated`: Ensures the user is authenticated.
- `singleUpload`: Handles file uploads.
- `validateUser`: Validates user registration data.
- `validateLogin`: Validates login data.
- `validateProfileUpdate`: Validates profile update data.
- `validateContactUsForm`: Validates contact form data.

## Error Handling

Errors are caught and handled within each controller function. Appropriate status codes and error messages are returned in the response.



## Recruiter Controller Documentation

This document provides an overview of the recruiter controller and its functionalities in the GreatHire backend application.

## Table of Contents
- [Introduction](#introduction)
- [Endpoints](#endpoints)
    - [Register](#register)
    - [Google Login](#google-login)
    - [Get All Recruiters](#get-all-recruiters)
    - [Get Recruiter By ID](#get-recruiter-by-id)
    - [Add Recruiter To Company](#add-recruiter-to-company)
    - [Update Profile](#update-profile)
    - [Delete Account](#delete-account)
    - [Toggle Active](#toggle-active)
- [Middleware](#middleware)
- [Error Handling](#error-handling)

## Introduction

The recruiter controller handles various recruiter-related operations such as registration, login, profile updates, and more. It interacts with the recruiter model and other related models to perform these operations.

## Endpoints

### Register

**Endpoint:** `/register`  
**Method:** `POST`  
**Description:** Registers a new recruiter.  
**Request Body:**
```json
{
    "fullname": "Jane Doe",
    "email": "jane.doe@example.com",
    "phoneNumber": "0987654321",
    "password": "password123"
}
```
**Response:**
```json
{
    "message": "Account created successfully.",
    "success": true,
    "user": { ... }
}
```

### Google Login

**Endpoint:** `/googleLogin`  
**Method:** `POST`  
**Description:** Logs in a recruiter using Google authentication.  
**Request Body:**
```json
{
    "code": "authorization_code",
    "role": "recruiter"
}
```
**Response:**
```json
{
    "message": "Welcome back Jane Doe",
    "user": { ... },
    "success": true
}
```

### Get All Recruiters

**Endpoint:** `/recruiters`  
**Method:** `POST`  
**Description:** Retrieves all recruiters associated with a company.  
**Request Body:**
```json
{
    "companyId": "company_id"
}
```
**Response:**
```json
{
    "recruiters": [ ... ],
    "success": true
}
```

### Get Recruiter By ID

**Endpoint:** `/recruiter-by-id/:id`  
**Method:** `GET`  
**Description:** Retrieves a recruiter by their ID.  
**Response:**
```json
{
    "message": "Recruiter fetched successfully",
    "recruiter": { ... },
    "success": true
}
```

### Add Recruiter To Company

**Endpoint:** `/add-recruiter`  
**Method:** `POST`  
**Description:** Adds a recruiter to a company.  
**Request Body:**
```json
{
    "fullname": "Jane Doe",
    "email": "jane.doe@example.com",
    "phoneNumber": "0987654321",
    "password": "password123",
    "position": "HR Manager",
    "companyId": "company_id"
}
```
**Response:**
```json
{
    "message": "Recruiter added. credentials send to recruiter mail.",
    "success": true
}
```

### Update Profile

**Endpoint:** `/profile/update`  
**Method:** `PUT`  
**Description:** Updates the recruiter's profile.  
**Request Body:**
```json
{
    "fullname": "Jane Doe",
    "phoneNumber": "0987654321",
    "position": "HR Manager",
    ...
}
```
**Response:**
```json
{
    "message": "Profile updated successfully.",
    "user": { ... },
    "success": true
}
```

### Delete Account

**Endpoint:** `/delete`  
**Method:** `DELETE`  
**Description:** Deletes the recruiter's account.  
**Request Body:**
```json
{
    "userEmail": "jane.doe@example.com",
    "companyId": "company_id"
}
```
**Response:**
```json
{
    "message": "Recruiter removed",
    "success": true
}
```

### Toggle Active

**Endpoint:** `/toggle-active`  
**Method:** `PUT`  
**Description:** Toggles the active status of a recruiter.  
**Request Body:**
```json
{
    "recruiterId": "recruiter_id",
    "companyId": "company_id",
    "isActive": true
}
```
**Response:**
```json
{
    "message": "Recruiter status updated successfully",
    "success": true
}
```

## Middleware

The following middleware functions are used in the recruiter routes:
- `isAuthenticated`: Ensures the recruiter is authenticated.
- `singleUpload`: Handles file uploads.
- `validateUser`: Validates recruiter registration data.

## Error Handling

Errors are caught and handled within each controller function. Appropriate status codes and error messages are returned in the response.


## Company Controller Documentation

This document provides an overview of the company controller and its functionalities in the GreatHire backend application.

## Table of Contents
- [Introduction](#introduction)
- [Endpoints](#endpoints)
    - [Register Company](#register-company)
    - [Get Company By ID](#get-company-by-id)
    - [Get Company By User ID](#get-company-by-user-id)
    - [Update Company](#update-company)
    - [Change Admin](#change-admin)
    - [Get Current Plan](#get-current-plan)
    - [Get Candidate Data](#get-candidate-data)
    - [Decrease Candidate Credits](#decrease-candidate-credits)
    - [Get Company Applicants](#get-company-applicants)
    - [Report Job](#report-job)
- [Middleware](#middleware)
- [Error Handling](#error-handling)

## Introduction

The company controller handles various company-related operations such as registration, updating details, managing recruiters, and more. It interacts with the company model and other related models to perform these operations.

## Endpoints

### Register Company

**Endpoint:** `/register`  
**Method:** `POST`  
**Description:** Registers a new company.  
**Request Body:**
```json
{
    "companyName": "Tech Solutions",
    "companyWebsite": "https://techsolutions.com",
    "industry": "Software",
    "streetAddress": "123 Tech Street",
    "city": "Tech City",
    "state": "Tech State",
    "country": "Tech Country",
    "postalCode": "123456",
    "email": "contact@techsolutions.com",
    "phone": "1234567890",
    "CIN": "U12345MH2000PTC123456",
    "recruiterPosition": "HR Manager",
    "userEmail": "hr@techsolutions.com"
}
```
**Response:**
```json
{
    "message": "Company registered successfully.",
    "success": true
}
```

### Get Company By ID

**Endpoint:** `/company-by-id`  
**Method:** `POST`  
**Description:** Retrieves a company by its ID.  
**Request Body:**
```json
{
    "companyId": "company_id"
}
```
**Response:**
```json
{
    "company": { ... },
    "success": true
}
```

### Get Company By User ID

**Endpoint:** `/company-by-userid`  
**Method:** `POST`  
**Description:** Retrieves a company by the user ID.  
**Request Body:**
```json
{
    "userId": "user_id"
}
```
**Response:**
```json
{
    "company": { ... },
    "success": true
}
```

### Update Company

**Endpoint:** `/update/:id`  
**Method:** `PUT`  
**Description:** Updates the company's details.  
**Request Body:**
```json
{
    "companyWebsite": "https://newtechsolutions.com",
    "address": {
        "streetAddress": "456 New Tech Street",
        "city": "New Tech City",
        "state": "New Tech State",
        "country": "New Tech Country",
        "postalCode": "654321"
    },
    "industry": "New Software",
    "email": "newcontact@techsolutions.com",
    "phone": "0987654321"
}
```
**Response:**
```json
{
    "company": { ... },
    "message": "Company information updated.",
    "success": true
}
```

### Change Admin

**Endpoint:** `/change-admin`  
**Method:** `PUT`  
**Description:** Changes the admin of the company.  
**Request Body:**
```json
{
    "email": "current_admin@techsolutions.com",
    "companyId": "company_id",
    "adminEmail": "new_admin@techsolutions.com"
}
```
**Response:**
```json
{
    "message": "Admin email changed successfully.",
    "success": true
}
```

### Get Current Plan

**Endpoint:** `/current-plan/:id`  
**Method:** `GET`  
**Description:** Retrieves the current job plan of the company.  
**Response:**
```json
{
    "plan": { ... },
    "message": "Current active plan retrieved successfully",
    "success": true
}
```

### Get Candidate Data

**Endpoint:** `/candidate-list`  
**Method:** `GET`  
**Description:** Retrieves candidate data based on job title, experience, and salary budget.  
**Request Query:**
```json
{
    "jobTitle": "Software Engineer",
    "experience": "3 years",
    "salaryBudget": "60000",
    "companyId": "company_id"
}
```
**Response:**
```json
{
    "candidates": [ ... ],
    "success": true
}
```

### Decrease Candidate Credits

**Endpoint:** `/decrease-credit/:id`  
**Method:** `GET`  
**Description:** Decreases the candidate credits of the company.  
**Response:**
```json
{
    "success": true
}
```

### Get Company Applicants

**Endpoint:** `/applicants/:companyId`  
**Method:** `GET`  
**Description:** Retrieves all applicants for the company's job postings.  
**Response:**
```json
{
    "totalApplications": 10,
    "applications": [ ... ],
    "success": true
}
```

### Report Job

**Endpoint:** `/report-job`  
**Method:** `POST`  
**Description:** Reports a job as invalid.  
**Request Body:**
```json
{
    "jobId": "job_id",
    "reportTitle": "Spam",
    "description": "This job posting is spam."
}
```
**Response:**
```json
{
    "message": "Report submitted successfully.",
    "success": true
}
```

## Middleware

The following middleware functions are used in the company routes:
- `isAuthenticated`: Ensures the user is authenticated.
- `singleUpload`: Handles file uploads.

## Error Handling

Errors are caught and handled within each controller function. Appropriate status codes and error messages are returned in the response.



## Job Controller Documentation

This document provides an overview of the job controller and its functionalities in the GreatHire backend application.

## Table of Contents
- [Introduction](#introduction)
- [Endpoints](#endpoints)
    - [Post Job](#post-job)
    - [Get All Jobs](#get-all-jobs)
    - [Get Job By ID](#get-job-by-id)
    - [Get Job By Recruiter ID](#get-job-by-recruiter-id)
    - [Get Job By Company ID](#get-job-by-company-id)
    - [Delete Job By ID](#delete-job-by-id)
    - [Update Job](#update-job)
    - [Bookmark Job](#bookmark-job)
    - [Toggle Active](#toggle-active)
    - [Get Jobs Statistics](#get-jobs-statistics)
- [Middleware](#middleware)
- [Error Handling](#error-handling)

## Introduction

The job controller handles various job-related operations such as posting jobs, fetching job details, updating job information, and more. It interacts with the job model and other related models to perform these operations.

## Endpoints

### Post Job

**Endpoint:** `/post-job`  
**Method:** `POST`  
**Description:** Posts a new job.  
**Request Body:**
```json
{
    "companyName": "Tech Solutions",
    "urgentHiring": true,
    "title": "Software Engineer",
    "details": "Job details here...",
    "skills": "JavaScript, Node.js",
    "qualifications": "Bachelor's degree in Computer Science",
    "benefits": "Health insurance, Paid time off",
    "responsibilities": "Develop and maintain web applications",
    "experience": "3 years",
    "salary": "60000",
    "jobType": "Full-time",
    "location": "Tech City",
    "numberOfOpening": 2,
    "respondTime": "24 hours",
    "duration": "Permanent",
    "companyId": "company_id"
}
```
**Response:**
```json
{
    "message": "Job posted successfully.",
    "success": true
}
```

### Get All Jobs

**Endpoint:** `/get`  
**Method:** `GET`  
**Description:** Retrieves all jobs in a stream manner.  
**Response:**
```json
[
    {
        "jobDetails": { ... },
        "created_by": "user_id",
        "company": "company_id"
    },
    ...
]
```

### Get Job By ID

**Endpoint:** `/get/:id`  
**Method:** `GET`  
**Description:** Retrieves a job by its ID.  
**Response:**
```json
{
    "job": { ... },
    "success": true
}
```

### Get Job By Recruiter ID

**Endpoint:** `/jobs/:id`  
**Method:** `GET`  
**Description:** Retrieves jobs posted by a specific recruiter.  
**Response:**
```json
{
    "jobs": [ ... ],
    "totalJobs": 10,
    "totalPages": 1,
    "currentPage": 1,
    "success": true
}
```

### Get Job By Company ID

**Endpoint:** `/jobs-list/:id`  
**Method:** `GET`  
**Description:** Retrieves jobs posted by a specific company.  
**Response:**
```json
{
    "jobs": [ ... ],
    "success": true
}
```

### Delete Job By ID

**Endpoint:** `/delete/:id`  
**Method:** `DELETE`  
**Description:** Deletes a job by its ID.  
**Request Body:**
```json
{
    "companyId": "company_id"
}
```
**Response:**
```json
{
    "message": "Job and related applications deleted successfully.",
    "success": true
}
```

### Update Job

**Endpoint:** `/update/:jobId`  
**Method:** `PUT`  
**Description:** Updates the details of a job.  
**Request Body:**
```json
{
    "editedJob": {
        "details": "Updated job details...",
        "skills": "JavaScript, Node.js",
        "qualifications": "Bachelor's degree in Computer Science",
        "benefits": "Health insurance, Paid time off",
        "responsibilities": "Develop and maintain web applications",
        "experience": "3 years",
        "salary": "70000",
        "jobType": "Full-time",
        "location": "New Tech City",
        "numberOfOpening": 3,
        "respondTime": "24 hours",
        "duration": "Permanent"
    },
    "companyId": "company_id"
}
```
**Response:**
```json
{
    "message": "Job updated successfully.",
    "success": true
}
```

### Bookmark Job

**Endpoint:** `/bookmark-job/:jobId`  
**Method:** `GET`  
**Description:** Bookmarks or unbookmarks a job.  
**Response:**
```json
{
    "message": "Save successfully",
    "success": true
}
```

### Toggle Active

**Endpoint:** `/toggle-active`  
**Method:** `PUT`  
**Description:** Toggles the active status of a job.  
**Request Body:**
```json
{
    "jobId": "job_id",
    "isActive": true,
    "companyId": "company_id"
}
```
**Response:**
```json
{
    "message": "Job status updated successfully.",
    "success": true
}
```

### Get Jobs Statistics

**Endpoint:** `/job-statistics/:id`  
**Method:** `GET`  
**Description:** Retrieves statistics of jobs for a specific company.  
**Response:**
```json
{
    "statistics": {
        "totalJobs": 10,
        "activeJobs": 5,
        "inactiveJobs": 5,
        "totalApplicants": 50,
        "selectedCandidates": 10
    },
    "success": true
}
```

## Middleware

The following middleware functions are used in the job routes:
- `isAuthenticated`: Ensures the user is authenticated.
- `singleUpload`: Handles file uploads.

## Error Handling

Errors are caught and handled within each controller function. Appropriate status codes and error messages are returned in the response.


## Application Controller Documentation

This document provides an overview of the application controller and its functionalities in the GreatHire backend application.

## Table of Contents
- [Introduction](#introduction)
- [Endpoints](#endpoints)
    - [Apply Job](#apply-job)
    - [Get Applied Jobs](#get-applied-jobs)
    - [Get Applicants](#get-applicants)
    - [Update Status](#update-status)
- [Middleware](#middleware)
- [Error Handling](#error-handling)

## Introduction

The application controller handles various job application-related operations such as applying for a job, retrieving applied jobs, fetching applicants for a job, and updating the status of an application. It interacts with the application model and other related models to perform these operations.

## Endpoints

### Apply Job

**Endpoint:** `/apply`  
**Method:** `POST`  
**Description:** Applies for a job.  
**Request Body:**
```json
{
    "fullname": "John Doe",
    "email": "john.doe@example.com",
    "number": "1234567890",
    "city": "City",
    "state": "State",
    "country": "Country",
    "coverLetter": "Cover letter content",
    "experience": "Previous experience details",
    "jobTitle": "Job Title",
    "company": "Company Name",
    "jobId": "job_id"
}
```
**Response:**
```json
{
    "message": "Applied successfully",
    "success": true,
    "user": { ... },
    "newApplication": { ... }
}
```

### Get Applied Jobs

**Endpoint:** `/get`  
**Method:** `GET`  
**Description:** Retrieves jobs applied by the user.  
**Response:**
```json
{
    "application": [ ... ],
    "success": true
}
```

### Get Applicants

**Endpoint:** `/:id/applicants`  
**Method:** `GET`  
**Description:** Retrieves applicants for a specific job.  
**Response:**
```json
{
    "applicants": [ ... ],
    "success": true
}
```

### Update Status

**Endpoint:** `/status/:id/update`  
**Method:** `POST`  
**Description:** Updates the status of a job application.  
**Request Body:**
```json
{
    "status": "New Status"
}
```
**Response:**
```json
{
    "message": "Status updated successfully.",
    "success": true
}
```

## Middleware

The following middleware functions are used in the application routes:
- `isAuthenticated`: Ensures the user is authenticated.
- `singleUpload`: Handles file uploads.
- `validateJobApplication`: Validates job application data.

## Error Handling

Errors are caught and handled within each controller function. Appropriate status codes and error messages are returned in the response.


## Order Controller Documentation

This document provides an overview of the order controller and its functionalities in the GreatHire backend application.

## Table of Contents
- [Introduction](#introduction)
- [Endpoints](#endpoints)
    - [Create Order for Job Plan](#create-order-for-job-plan)
    - [Create Order for Candidate Plan](#create-order-for-candidate-plan)
- [Middleware](#middleware)
- [Error Handling](#error-handling)

## Introduction

The order controller handles the creation of orders for job and candidate plans. It interacts with the Razorpay API and the subscription models to perform these operations.

## Endpoints

### Create Order for Job Plan

**Endpoint:** `/create-order-for-jobplan`  
**Method:** `POST`  
**Description:** Creates an order for a job plan.  
**Request Body:**
```json
{
    "planName": "Basic Plan",
    "companyId": "company_id",
    "amount": 1000,
    "jobBoost": 5
}
```
**Response:**
```json
{
    "message": "Order created successfully",
    "success": true,
    "orderId": "order_id",
    "amount": 1000,
    "currency": "INR"
}
```

### Create Order for Candidate Plan

**Endpoint:** `/create-order-for-candidateplan`  
**Method:** `POST`  
**Description:** Creates an order for a candidate plan.  
**Request Body:**
```json
{
    "planName": "Premium Plan",
    "companyId": "company_id",
    "amount": 2000,
    "creditBoost": 10
}
```
**Response:**
```json
{
    "message": "Order created successfully",
    "success": true,
    "orderId": "order_id",
    "amount": 2000,
    "currency": "INR"
}
```

## Middleware

The following middleware functions are used in the order routes:
- `isAuthenticated`: Ensures the user is authenticated.

## Error Handling

Errors are caught and handled within each controller function. Appropriate status codes and error messages are returned in the response.


## Revenue Controller Documentation

This document provides an overview of the revenue controller and its functionalities in the GreatHire backend application.

## Table of Contents
- [Introduction](#introduction)
- [Endpoints](#endpoints)
    - [Store Revenue](#store-revenue)
- [Middleware](#middleware)
- [Error Handling](#error-handling)

## Introduction

The revenue controller handles operations related to storing revenue data generated by job posting plans or candidate database plans. It interacts with the revenue model to perform these operations.

## Endpoints

### Store Revenue

**Endpoint:** `/store-revenue`  
**Method:** `POST`  
**Description:** Stores revenue data.  
**Request Body:**
```json
{
    "itemDetails": { ... },
    "companyName": "Company Name",
    "userDetails": {
        "userName": "User Name",
        "email": "user@example.com",
        "phoneNumber": "1234567890"
    }
}
```
**Response:**
```json
{
    "message": "Revenue recorded successfully.",
    "success": true
}
```

## Middleware

The following middleware functions are used in the revenue routes:
- `isAuthenticated`: Ensures the user is authenticated.

## Error Handling

Errors are caught and handled within the controller function. Appropriate status codes and error messages are returned in the response.



## Verification Controller Documentation

This document provides an overview of the verification controller and its functionalities in the GreatHire backend application.

## Table of Contents
- [Introduction](#introduction)
- [Endpoints](#endpoints)
    - [Verify Token](#verify-token)
    - [Send Verification Status](#send-verification-status)
    - [Request OTP for Email](#request-otp-for-email)
    - [Request OTP for Number](#request-otp-for-number)
    - [Verify OTP](#verify-otp)
    - [Verify Payment for Job Plans](#verify-payment-for-job-plans)
    - [Verify Payment for Candidate Plans](#verify-payment-for-candidate-plans)
    - [Update Email Verification](#update-email-verification)
    - [Update Number Verification](#update-number-verification)
    - [Send Email to Applicant](#send-email-to-applicant)
- [Middleware](#middleware)
- [Error Handling](#error-handling)

## Introduction

The verification controller handles various verification-related operations such as token verification, OTP requests, payment verification, and more. It interacts with the relevant models to perform these operations.

## Endpoints

### Verify Token

**Endpoint:** `/verify-token`  
**Method:** `POST`  
**Description:** Verifies a token.  
**Request Body:**
```json
{
    "token": "jwt_token"
}
```
**Response:**
```json
{
    "decoded": { ... },
    "message": "Token Valid",
    "success": true
}
```

### Send Verification Status

**Endpoint:** `/send-verification-status`  
**Method:** `PUT`  
**Description:** Sends the verification status of a company.  
**Request Body:**
```json
{
    "email": "admin@example.com",
    "adminEmail": "admin@example.com",
    "companyId": "company_id",
    "isActive": true
}
```
**Response:**
```json
{
    "success": true,
    "message": "Verification status updated successfully and email notifications sent."
}
```

### Request OTP for Email

**Endpoint:** `/request-otp-email`  
**Method:** `POST`  
**Description:** Requests an OTP for email verification.  
**Request Body:**
```json
{
    "email": "user@example.com"
}
```
**Response:**
```json
{
    "message": "OTP sent successfully!",
    "success": true,
    "token": "jwt_token"
}
```

### Request OTP for Number

**Endpoint:** `/request-otp-mob`  
**Method:** `POST`  
**Description:** Requests an OTP for phone number verification.  
**Request Body:**
```json
{
    "number": "1234567890"
}
```
**Response:**
```json
{
    "message": "OTP sent successfully!",
    "success": true,
    "token": "jwt_token"
}
```

### Verify OTP

**Endpoint:** `/verify-otp`  
**Method:** `POST`  
**Description:** Verifies an OTP.  
**Request Body:**
```json
{
    "decodedOTP": "decoded_otp",
    "otp": "123456"
}
```
**Response:**
```json
{
    "success": true,
    "message": "OTP verified successfully."
}
```

### Verify Payment for Job Plans

**Endpoint:** `/verify-payment-for-jobplan`  
**Method:** `POST`  
**Description:** Verifies payment for job plans.  
**Request Body:**
```json
{
    "razorpay_order_id": "order_id",
    "razorpay_payment_id": "payment_id",
    "razorpay_signature": "signature",
    "jobBoost": 5,
    "companyId": "company_id"
}
```
**Response:**
```json
{
    "success": true,
    "plan": { ... },
    "message": "Payment verified successfully"
}
```

### Verify Payment for Candidate Plans

**Endpoint:** `/verify-payment-for-candidateplan`  
**Method:** `POST`  
**Description:** Verifies payment for candidate plans.  
**Request Body:**
```json
{
    "razorpay_order_id": "order_id",
    "razorpay_payment_id": "payment_id",
    "razorpay_signature": "signature",
    "creditBoost": 10,
    "companyId": "company_id"
}
```
**Response:**
```json
{
    "success": true,
    "plan": { ... },
    "message": "Payment verified successfully"
}
```

### Update Email Verification

**Endpoint:** `/update-email-verification`  
**Method:** `POST`  
**Description:** Updates the email verification status of a user.  
**Request Body:**
```json
{
    "email": "user@example.com"
}
```
**Response:**
```json
{
    "message": "Email Verified.",
    "success": true
}
```

### Update Number Verification

**Endpoint:** `/update-number-verification`  
**Method:** `POST`  
**Description:** Updates the phone number verification status of a user.  
**Request Body:**
```json
{
    "email": "user@example.com"
}
```
**Response:**
```json
{
    "message": "Number Verified.",
    "success": true
}
```

### Send Email to Applicant

**Endpoint:** `/send-email-applicants/:id`  
**Method:** `POST`  
**Description:** Sends an email to an applicant regarding their application status.  
**Request Body:**
```json
{
    "email": "applicant@example.com",
    "status": "Shortlisted"
}
```
**Response:**
```json
{
    "success": true,
    "message": "Email sent successfully"
}
```

## Middleware

The following middleware functions are used in the verification routes:
- `isAuthenticated`: Ensures the user is authenticated.

## Error Handling

Errors are caught and handled within each controller function. Appropriate status codes and error messages are returned in the response.



## Notification Controller Documentation

This document provides an overview of the notification controller and its functionalities in the GreatHire backend application.

## Table of Contents
- [Introduction](#introduction)
- [Endpoints](#endpoints)
    - [Get Unseen Notifications Count](#get-unseen-notifications-count)
    - [Get Unseen Messages](#get-unseen-messages)
    - [Get Messages](#get-messages)
    - [Mark As Seen](#mark-as-seen)
    - [Delete Contact](#delete-contact)
    - [Delete Job Report](#delete-job-report)
    - [Delete All Messages](#delete-all-messages)
- [Middleware](#middleware)
- [Error Handling](#error-handling)

## Introduction

The notification controller handles various notification-related operations such as fetching unseen notifications, marking notifications as seen, and deleting messages. It interacts with the job report and contact models to perform these operations.

## Endpoints

### Get Unseen Notifications Count

**Endpoint:** `/unseen`  
**Method:** `GET`  
**Description:** Retrieves the count of unseen notifications.  
**Response:**
```json
{
    "success": true,
    "totalUnseenNotifications": 5
}
```

### Get Unseen Messages

**Endpoint:** `/unseen/messages`  
**Method:** `GET`  
**Description:** Retrieves all unseen messages.  
**Response:**
```json
{
    "success": true,
    "messages": [ ... ]
}
```

### Get Messages

**Endpoint:** `/getAll-messages`  
**Method:** `GET`  
**Description:** Retrieves all messages.  
**Response:**
```json
{
    "success": true,
    "messages": [ ... ]
}
```

### Mark As Seen

**Endpoint:** `/mark-seen`  
**Method:** `PUT`  
**Description:** Marks all unseen messages as seen.  
**Response:**
```json
{
    "success": true,
    "message": "All unseen notifications have been marked as seen."
}
```

### Delete Contact

**Endpoint:** `/contacts/:msgId`  
**Method:** `DELETE`  
**Description:** Deletes a contact message by its ID.  
**Response:**
```json
{
    "success": true,
    "message": "Contact message deleted successfully."
}
```

### Delete Job Report

**Endpoint:** `/jobReports/:msgId`  
**Method:** `DELETE`  
**Description:** Deletes a job report by its ID.  
**Response:**
```json
{
    "success": true,
    "message": "Job report deleted successfully."
}
```

### Delete All Messages

**Endpoint:** `/deleteMessages`  
**Method:** `DELETE`  
**Description:** Deletes all messages from both contact and job report models.  
**Response:**
```json
{
    "success": true,
    "message": "All messages deleted successfully."
}
```

## Middleware

The following middleware functions are used in the notification routes:
- `isAuthenticated`: Ensures the user is authenticated.

## Error Handling

Errors are caught and handled within each controller function. Appropriate status codes and error messages are returned in the response.