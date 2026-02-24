# Admin Custom Credits Feature Implementation

## Overview
Implemented a feature that allows admins to customize credits and max job posts for individual recruiters. The custom credits automatically override default credits when fetching company data.

## Changes Made

### Backend Changes

#### 1. Company Model (`BackEnd/models/company.model.js`)
Added three new fields:
- `customCreditsForJobs`: Number (default: null) - Admin-set custom job credits
- `customCreditsForCandidates`: Number (default: null) - Admin-set custom candidate credits
- `customMaxJobPosts`: String (default: null) - Admin-set custom max job posts

#### 2. Admin Controller (`BackEnd/controllers/admin/admin.controller.js`)
Added new function:
- `updateRecruiterCredits`: Updates custom credits for a specific company/recruiter

#### 3. Admin Route (`BackEnd/routes/admin/admin.route.js`)
Added new endpoint:
- `PUT /api/v1/admin/update-recruiter-credits` - Updates recruiter credits

#### 4. Recruiter Stats Controller (`BackEnd/controllers/admin/recruiterStats.controller.js`)
Updated `getAllRecruitersList` to include credit fields in the response:
- creditedForJobs
- creditedForCandidates
- maxJobPosts
- customCreditsForJobs
- customCreditsForCandidates
- customMaxJobPosts

#### 5. Company Controller (`BackEnd/controllers/company.controller.js`)
Updated two functions to apply custom credits:
- `companyByUserId`: Returns company data with custom credits applied if they exist
- `getCompanyById`: Returns company data with custom credits applied if they exist

Logic: If custom credits are set (not null), they override the default credits in the response.

### Frontend Changes

#### 1. New Component (`frontend/src/components/admin/UpdateCreditsModal.jsx`)
Created a modal component with:
- Input for custom job credits
- Input for custom candidate credits
- Input for custom max job posts
- Shows current values for reference
- Form validation and submission

#### 2. RecruitersList Component (`frontend/src/pages/admin/recruiters/RecruitersList.jsx`)
Added:
- Import for `CreditCard` icon and `UpdateCreditsModal` component
- State management for credits modal
- `updateRecruiterCredits` function to handle API calls
- New "Update Credits" button (purple credit card icon) in the actions column
- Modal integration at the bottom of the component

## How to Use

1. Admin navigates to the Recruiters List page
2. For any recruiter, click the purple credit card icon in the Actions column
3. A modal opens showing:
   - Current job credits
   - Current candidate credits
   - Current max job posts
4. Admin can enter custom values (leave empty to use defaults)
5. Click "Update" to save changes
6. The system updates the company's custom credit fields
7. When recruiters fetch their company data, custom credits automatically override defaults

## API Endpoint

**Endpoint:** `PUT /api/v1/admin/update-recruiter-credits`

**Request Body:**
```json
{
  "companyId": "company_id_here",
  "customCreditsForJobs": 5000,
  "customCreditsForCandidates": 100,
  "customMaxJobPosts": "20"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Credits updated successfully",
  "company": { /* updated company object */ }
}
```

## How Custom Credits Work

1. Admin sets custom credits via the modal
2. Custom credits are stored in the company document
3. When company data is fetched (via `companyByUserId` or `getCompanyById`):
   - If `customCreditsForJobs` is set, it overrides `creditedForJobs`
   - If `customCreditsForCandidates` is set, it overrides `creditedForCandidates`
   - If `customMaxJobPosts` is set, it overrides `maxJobPosts`
4. Recruiters see the custom credits automatically without any code changes on their side

## Important Notes About maxJobPosts

- The `maxJobPosts` field is stored in the database but is NOT currently used in the UI
- The system calculates remaining job posts using: `Math.floor(creditedForJobs / 500)`
- Each job post costs 500 credits
- To effectively control max job posts, admins should set `customCreditsForJobs`
- Example: To allow 10 job posts, set `customCreditsForJobs` to 5000 (10 × 500)
- The `customMaxJobPosts` field is available for future use or custom logic

## Notes

- Custom credits override default plan credits when set
- Setting a field to null or empty removes the custom value
- Only admins can access this feature
- Changes are reflected immediately when recruiters refresh their data
- The feature supports dark mode
- No changes needed in recruiter-side code - custom credits are applied server-side
