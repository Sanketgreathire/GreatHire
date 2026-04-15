# User Model

This document provides an overview of the `user.model.js` file, which defines the schema for the User model in the GreatHire backend.

## Filepath
`/Users/virendersingh/Desktop/GreatHire/BackEnd/models/user.model.js`

## Schema Definition

The User schema is defined using Mongoose and includes the following fields:

### Fields

- **fullname**: 
    - Type: `String`
    - Required: `true`

- **emailId**:
    - **email**:
        - Type: `String`
        - Required: `true`
        - Unique: `true`
        - Validation: Must match a valid email format
    - **isVerified**:
        - Type: `Boolean`
        - Default: `false`

- **phoneNumber**:
    - **number**:
        - Type: `String`
    - **isVerified**:
        - Type: `Boolean`

- **password**:
    - Type: `String`

- **role**:
    - Type: `String`
    - Default: `student`

- **address**:
    - **city**:
        - Type: `String`
    - **state**:
        - Type: `String`
    - **country**:
        - Type: `String`

- **profile**:
    - **coverLetter**:
        - Type: `String`
    - **bio**:
        - Type: `String`
    - **experience**:
        - **companyName**:
            - Type: `String`
        - **jobProfile**:
            - Type: `String`
        - **duration**:
            - Type: `String`
        - **experienceDetails**:
            - Type: `String`
    - **currentCTC**:
        - Type: `Number`
        - Default: `0`
    - **expectedCTC**:
        - Type: `Number`
        - Default: `0`
    - **skills**:
        - Type: `Array of Strings`
    - **resume**:
        - Type: `String` (URL for the resume)
    - **resumeOriginalName**:
        - Type: `String`
    - **profilePhoto**:
        - Type: `String`
        - Default: `""`

### Timestamps
The schema includes timestamps, which automatically add `createdAt` and `updatedAt` fields to the model.

## Export
The User model is exported as `User` and can be used in other parts of the application.

```javascript
export const User = mongoose.model("User", userSchema);
```


# Company Model

This document provides an overview of the `company.model.js` file, which defines the schema for the Company model in the GreatHire backend.

## Filepath
`/Users/virendersingh/Desktop/GreatHire/BackEnd/models/company.model.js`

## Schema Definition

The Company schema is defined using Mongoose and includes the following fields:

### Fields

- **companyName**: 
    - Type: `String`
    - Required: `true`
    - Unique: `true`

- **companyWebsite**:
    - Type: `String`

- **industry**:
    - Type: `String`

- **address**:
    - **streetAddress**:
        - Type: `String`
    - **city**:
        - Type: `String`
    - **state**:
        - Type: `String`
    - **country**:
        - Type: `String`
    - **postalCode**:
        - Type: `String`

- **email**:
    - Type: `String`
    - Required: `true`
    - Unique: `true`
    - Validation: Must match a valid email format

- **adminEmail**:
    - Type: `String`
    - Required: `true`
    - Unique: `true`
    - Validation: Must match a valid email format

- **phone**:
    - Type: `String`

- **CIN**:
    - Type: `String`
    - Required: `true`
    - Unique: `true`

- **businessFile**:
    - Type: `String` (Store the file path or URL)

- **bussinessFileName**:
    - Type: `String`

- **maxJobPosts**:
    - Type: `Number`
    - Default: `5` (Default for Free plan)

- **creditedForCandidates**:
    - Type: `Number`
    - Default: `35` (Default for Free plan)

- **userId**:
    - Type: `Array of ObjectIds`
    - Ref: `User`
    - Required: `true`

- **isActive**:
    - Type: `Boolean`
    - Default: `false`

### Timestamps
The schema includes timestamps, which automatically add `createdAt` and `updatedAt` fields to the model.

## Export
The Company model is exported as `Company` and can be used in other parts of the application.

```javascript
export const Company = mongoose.model("Company", companySchema);
```


# Recruiter Model

This document provides an overview of the `recruiter.model.js` file, which defines the schema for the Recruiter model in the GreatHire backend.

## Filepath
`/Users/virendersingh/Desktop/GreatHire/BackEnd/models/recruiter.model.js`

## Schema Definition

The Recruiter schema is defined using Mongoose and includes the following fields:

### Fields

- **fullname**: 
    - Type: `String`
    - Required: `true`

- **emailId**:
    - **email**:
        - Type: `String`
        - Required: `true`
        - Unique: `true`
        - Validation: Must match a valid email format
    - **isVerified**:
        - Type: `Boolean`
        - Default: `false`

- **phoneNumber**:
    - **number**:
        - Type: `String`
    - **isVerified**:
        - Type: `Boolean`

- **password**:
    - Type: `String`

- **role**:
    - Type: `String`
    - Default: `recruiter`

- **position**:
    - Type: `String`
    - Default: `""`

- **isCompanyCreated**:
    - Type: `Boolean`
    - Default: `false`

- **profile**:
    - **profilePhoto**:
        - Type: `String`
        - Default: `""`

- **isActive**:
    - Type: `Boolean`
    - Default: `false`

### Timestamps
The schema includes timestamps, which automatically add `createdAt` and `updatedAt` fields to the model.

## Export
The Recruiter model is exported as `Recruiter` and can be used in other parts of the application.

```javascript
export const Recruiter = mongoose.model("Recruiter", recruiterSchema);
```

# Job Model

This document provides an overview of the `job.model.js` file, which defines the schema for the Job model in the GreatHire backend.

## Filepath
`/Users/virendersingh/Desktop/GreatHire/BackEnd/models/job.model.js`

## Schema Definition

The Job schema is defined using Mongoose and includes the following fields:

### Fields

- **jobDetails**:
    - **companyName**:
        - Type: `String`
        - Required: `true`
    - **urgentHiring**:
        - Type: `Boolean`
        - Required: `true`
        - Default: `false`
    - **title**:
        - Type: `String`
        - Required: `true`
    - **details**:
        - Type: `String`
        - Required: `true`
    - **skills**:
        - Type: `Array of Strings`
    - **qualifications**:
        - Type: `Array of Strings`
    - **benefits**:
        - Type: `Array of Strings`
    - **responsibilities**:
        - Type: `Array of Strings`
    - **experience**:
        - Type: `String`
        - Required: `true`
    - **salary**:
        - Type: `String`
        - Required: `true`
    - **jobType**:
        - Type: `String`
        - Required: `true`
    - **location**:
        - Type: `String`
        - Required: `true`
    - **numberOfOpening**:
        - Type: `String`
        - Required: `true`
    - **respondTime**:
        - Type: `String`
        - Required: `true`
    - **duration**:
        - Type: `String`
        - Required: `true`
    - **isActive**:
        - Type: `Boolean`
        - Default: `true`

- **saveJob**:
    - Type: `Array of ObjectIds`
    - Ref: `User`

- **hiddenJob**:
    - Type: `Array of ObjectIds`
    - Ref: `User`

- **application**:
    - Type: `Array of ObjectIds`
    - Ref: `Application`

- **created_by**:
    - Type: `ObjectId`
    - Ref: `Recruiter`
    - Required: `true`

- **company**:
    - Type: `ObjectId`
    - Ref: `Company`
    - Required: `true`

### Timestamps
The schema includes timestamps, which automatically add `createdAt` and `updatedAt` fields to the model.

## Export
The Job model is exported as `Job` and can be used in other parts of the application.

```javascript
export const Job = mongoose.model("Job", jobSchema);
```


# Application Model

This document provides an overview of the `application.model.js` file, which defines the schema for the Application model in the GreatHire backend.

## Filepath
`/Users/virendersingh/Desktop/GreatHire/BackEnd/models/application.model.js`

## Schema Definition

The Application schema is defined using Mongoose and includes the following fields:

### Fields

- **job**:
    - Type: `ObjectId`
    - Ref: `Job`
    - Required: `true`

- **applicant**:
    - Type: `ObjectId`
    - Ref: `User`
    - Required: `true`

- **status**:
    - Type: `String`
    - Enum: `["Pending", "Shortlisted", "Rejected"]`
    - Default: `Pending`

### Timestamps
The schema includes timestamps, which automatically add `createdAt` and `updatedAt` fields to the model.

## Export
The Application model is exported as `Application` and can be used in other parts of the application.

```javascript
export const Application = mongoose.model("Application", applicationSchema);
```

# Job Report Model

This document provides an overview of the `jobReport.model.js` file, which defines the schema for the Job Report model in the GreatHire backend.

## Filepath
`/Users/virendersingh/Desktop/GreatHire/BackEnd/models/jobReport.model.js`

## Schema Definition

The Job Report schema is defined using Mongoose and includes the following fields:

### Fields

- **userId**: 
    - Type: `ObjectId`
    - Ref: `User`
    - Required: `true`

- **jobId**:
    - Type: `ObjectId`
    - Ref: `Job`
    - Required: `true`

- **reportTitle**:
    - Type: `String`
    - Required: `true`
    - Trim: `true`

- **description**:
    - Type: `String`
    - Trim: `true`

- **status**:
    - Type: `String`
    - Enum: `["seen", "unseen"]`
    - Default: `unseen`

### Timestamps
The schema includes timestamps, which automatically add `createdAt` and `updatedAt` fields to the model.

## Export
The Job Report model is exported as `JobReport` and can be used in other parts of the application.

```javascript
export const JobReport = mongoose.model("JobReport", jobReportSchema);
```


# Job Subscription Model

This document provides an overview of the `jobSubscription.model.js` file, which defines the schema for the Job Subscription model in the GreatHire backend.

## Filepath
`/Users/virendersingh/Desktop/GreatHire/BackEnd/models/jobSubscription.model.js`

## Schema Definition

The Job Subscription schema is defined using Mongoose and includes the following fields:

### Fields

- **type**: 
    - Type: `String`
    - Default: `JobPosting`

- **planName**:
    - Type: `String`
    - Enum: `["Basic", "Standard", "Premium"]`
    - Required: `true`

- **jobBoost**:
    - Type: `Number`
    - Required: `true`

- **purchaseDate**:
    - Type: `Date`
    - Required: `true`
    - Default: `Date.now`

- **expiryDate**:
    - Type: `Date`
    - Required: `true`
    - Default: One month after purchase

- **price**:
    - Type: `Number`
    - Required: `true`

- **status**:
    - Type: `String`
    - Enum: `["Hold", "Active", "Expired"]`
    - Required: `true`
    - Default: `Hold`

- **razorpayOrderId**:
    - Type: `String`
    - Required: `true`

- **paymentStatus**:
    - Type: `String`
    - Enum: `["created", "paid", "failed"]`
    - Default: `created`

- **paymentDetails**:
    - **paymentId**:
        - Type: `String`
    - **signature**:
        - Type: `String`

- **company**:
    - Type: `ObjectId`
    - Ref: `Company`
    - Required: `true`

### Timestamps
The schema includes timestamps, which automatically add `createdAt` and `updatedAt` fields to the model.

## Export
The Job Subscription model is exported as `JobSubscription` and can be used in other parts of the application.

```javascript
export const JobSubscription = mongoose.model("JobSubscription", jobSubscriptionSchema);
```

# Candidate Subscription Model

This document provides an overview of the `candidateSubscription.model.js` file, which defines the schema for the Candidate Subscription model in the GreatHire backend.

## Filepath
`/Users/virendersingh/Desktop/GreatHire/BackEnd/models/candidateSubscription.model.js`

## Schema Definition

The Candidate Subscription schema is defined using Mongoose and includes the following fields:

### Fields

- **type**: 
    - Type: `String`
    - Default: `CandidateData`

- **planName**:
    - Type: `String`
    - Enum: `["Basic", "Standard", "Premium"]`
    - Required: `true`

- **creditBoost**:
    - Type: `Number`
    - Required: `true`

- **purchaseDate**:
    - Type: `Date`
    - Required: `true`
    - Default: `Date.now`

- **expiryDate**:
    - Type: `Date`
    - Required: `true`
    - Default: One month after purchase

- **price**:
    - Type: `Number`
    - Required: `true`

- **status**:
    - Type: `String`
    - Enum: `["Hold", "Active", "Expired"]`
    - Required: `true`
    - Default: `Hold`

- **razorpayOrderId**:
    - Type: `String`
    - Required: `true`

- **paymentStatus**:
    - Type: `String`
    - Enum: `["created", "paid", "failed"]`
    - Default: `created`

- **paymentDetails**:
    - **paymentId**:
        - Type: `String`
    - **signature**:
        - Type: `String`

- **company**:
    - Type: `ObjectId`
    - Ref: `Company`
    - Required: `true`

### Timestamps
The schema includes timestamps, which automatically add `createdAt` and `updatedAt` fields to the model.

## Export
The Candidate Subscription model is exported as `CandidateSubscription` and can be used in other parts of the application.

```javascript
export const CandidateSubscription = mongoose.model("CandidateSubscription", candidateSubscriptionSchema);
```

# Contact Model

This document provides an overview of the `contact.model.js` file, which defines the schema for the Contact model in the GreatHire backend.

## Filepath
`/Users/virendersingh/Desktop/GreatHire/BackEnd/models/contact.model.js`

## Schema Definition

The Contact schema is defined using Mongoose and includes the following fields:

### Fields

- **name**: 
    - Type: `String`
    - Required: `true`

- **email**:
    - Type: `String`
    - Required: `true`
    - Validation: Must match a valid email format

- **phoneNumber**:
    - Type: `String`
    - Required: `true`

- **message**:
    - Type: `String`
    - Required: `true`

- **status**:
    - Type: `String`
    - Enum: `["seen", "unseen"]`
    - Default: `unseen`

### Timestamps
The schema includes timestamps, which automatically add `createdAt` and `updatedAt` fields to the model.

## Export
The Contact model is exported as `Contact` and can be used in other parts of the application.

```javascript
export const Contact = mongoose.model("Contact", contactSchema);
```

# Revenue Model

This document provides an overview of the `revenue.model.js` file, which defines the schema for the Revenue model in the GreatHire backend.

## Filepath
`/Users/virendersingh/Desktop/GreatHire/BackEnd/models/revenue.model.js`

## Schema Definition

The Revenue schema is defined using Mongoose and includes the following fields:

### Fields

- **itemDetails**:
    - **itemType**:
        - Type: `String`
        - Required: `true`
        - Trim: `true`
    - **itemName**:
        - Type: `String`
        - Required: `true`
        - Trim: `true`
    - **price**:
        - Type: `Number`
        - Required: `true`
        - Min: `0`

- **companyName**:
    - Type: `String`
    - Trim: `true`

- **userDetails**:
    - **userName**:
        - Type: `String`
        - Required: `true`
        - Trim: `true`
    - **email**:
        - Type: `String`
        - Required: `true`
        - Trim: `true`
        - Lowercase: `true`
    - **phoneNumber**:
        - Type: `String`
        - Required: `true`
        - Trim: `true`

### Timestamps
The schema includes timestamps, which automatically add `createdAt` and `updatedAt` fields to the model.

## Export
The Revenue model is exported as `Revenue` and can be used in other parts of the application.

```javascript
export const Revenue = mongoose.model("Revenue", revenueSchema);
```

# Blacklisted Company Model

This document provides an overview of the `blacklistedCompany.model.js` file, which defines the schema for the Blacklisted Company model in the GreatHire backend.

## Filepath
`/Users/virendersingh/Desktop/GreatHire/BackEnd/models/blacklistedCompany.model.js`

## Schema Definition

The Blacklisted Company schema is defined using Mongoose and includes the following fields:

### Fields

- **companyName**: 
    - Type: `String`
    - Required: `true`
    - Unique: `true`

- **email**:
    - Type: `String`
    - Required: `true`
    - Unique: `true`

- **adminEmail**:
    - Type: `String`
    - Required: `true`
    - Unique: `true`

- **CIN**:
    - Type: `String`
    - Required: `true`
    - Unique: `true`

- **reason**:
    - Type: `String`
    - Default: `Deleted by recruiter`

- **blacklistedAt**:
    - Type: `Date`
    - Default: `Date.now`

### Timestamps
The schema includes timestamps, which automatically add `createdAt` and `updatedAt` fields to the model.

## Export
The Blacklisted Company model is exported as `BlacklistedCompany` and can be used in other parts of the application.

```javascript
export const BlacklistedCompany = mongoose.model("BlacklistedCompany", blacklistedCompanySchema);
```

# Blacklisted Token Model

This document provides an overview of the `blacklistedtoken.model.js` file, which defines the schema for the Blacklisted Token model in the GreatHire backend.

## Filepath
`/Users/virendersingh/Desktop/GreatHire/BackEnd/models/blacklistedtoken.model.js`

## Schema Definition

The Blacklisted Token schema is defined using Mongoose and includes the following fields:

### Fields

- **token**: 
    - Type: `String`
    - Required: `true`
    - Unique: `true`

- **createdAt**:
    - Type: `Date`
    - Default: `Date.now`
    - Expires: `86400` (24 hours in seconds)

### Timestamps
The schema includes timestamps, which automatically add `createdAt` and `updatedAt` fields to the model.

## Export
The Blacklisted Token model is exported as `BlacklistToken` and can be used in other parts of the application.

```javascript
export const BlacklistToken = mongoose.model("BlacklistToken", blacklistTokenSchema);
```

