# User Controller Documentation

## Endpoints

### `/register`

- **Description**: Registers a new user by creating a user account with the provided information.
- **HTTP Method**: `POST`
- **Middlewares**: `validateUser`
- **Request Body**:
    - `fullname` (object):
        - `firstname` (string, required): User's first name (minimum 3 characters).
        - `lastname` (string, optional): User's last name (minimum 3 characters).
    - `email` (string, required): User's email address (must be a valid email).
    - `password` (string, required): User's password (minimum 6 characters).
- **Example Response**:
    - `user` (object):
        - `fullname` (object):
            - `firstname` (string): User's first name.
            - `lastname` (string): User's last name.
        - `email` (string): User's email address.
        - `password` (string): User's password.
    - `token` (string): JWT Token

### `/login`

- **Description**: Logs in an existing user using their email and password, returning a JWT token upon successful login.
- **HTTP Method**: `POST`
- **Middlewares**: `validateLogin`
- **Request Body**:
    - `email` (string, required): User's email address (must be a valid email).
    - `password` (string, required): User's password (minimum 6 characters).
- **Example Response**:
    - `user` (object):
        - `fullname` (object):
            - `firstname` (string): User's first name.
            - `lastname` (string): User's last name.
        - `email` (string): User's email address.
        - `password` (string): User's password.
    - `token` (string): JWT Token

### `/googleLogin`

- **Description**: Logs in a user using Google OAuth.
- **HTTP Method**: `POST`
- **Example Response**:
    - `user` (object):
        - `fullname` (object):
            - `firstname` (string): User's first name.
            - `lastname` (string): User's last name.
        - `email` (string): User's email address.
        - `password` (string): User's password.
    - `token` (string): JWT Token

### `/profile/update`

- **Description**: Updates the user's profile information.
- **HTTP Method**: `PUT`
- **Middlewares**: `isAuthenticated`, `singleUpload`, `validateProfileUpdate`
- **Request Body**:
    - `fullname` (object):
        - `firstname` (string, required): User's first name (minimum 3 characters).
        - `lastname` (string, optional): User's last name (minimum 3 characters).
    - `email` (string, required): User's email address (must be a valid email).
    - `phoneNumber` (string, optional): User's phone number.
    - `address` (string, optional): User's address.
- **Example Response**:
    - `user` (object):
        - `fullname` (object):
            - `firstname` (string): User's first name.
            - `lastname` (string): User's last name.
        - `email` (string): User's email address.
        - `phoneNumber` (string): User's phone number.
        - `address` (string): User's address.

### `/sendMessage`

- **Description**: Sends a message through the contact form.
- **HTTP Method**: `POST`
- **Middlewares**: `validateContactUsForm`
- **Request Body**:
    - `name` (string, required): Sender's name.
    - `email` (string, required): Sender's email address.
    - `message` (string, required): Message content.
- **Example Response**:
    - `message` (string): Confirmation message.

### `/forgot-password`

- **Description**: Initiates the password reset process by sending a reset link to the user's email.
- **HTTP Method**: `POST`
- **Request Body**:
    - `email` (string, required): User's email address.
- **Example Response**:
    - `message` (string): Confirmation message.

### `/reset-password`

- **Description**: Resets the user's password using the provided reset token.
- **HTTP Method**: `POST`
- **Request Body**:
    - `token` (string, required): Password reset token.
    - `newPassword` (string, required): New password (minimum 6 characters).
- **Example Response**:
    - `message` (string): Confirmation message.

### `/logout`

- **Description**: Logs out the user and invalidates the current session.
- **HTTP Method**: `GET`
- **Middlewares**: `isAuthenticated`
- **Example Response**:
    - `message` (string): Logout successful.

### `/delete`

- **Description**: Deletes the user's account.
- **HTTP Method**: `DELETE`
- **Middlewares**: `isAuthenticated`
- **Example Response**:
    - `message` (string): Account deletion successful.

## Middlewares

### `isAuthenticated`

Ensures that the user is authenticated before allowing access to certain routes.

### `singleUpload`

Handles file uploads for profile photos and resumes.

### `validateUser`

Validates the user registration data.

### `validateLogin`

Validates the user login data.

### `validateProfileUpdate`

Validates the profile update data.

### `validateContactUsForm`

Validates the contact form data.

## Models

The user controller interacts with the `User` model defined in `user.model.js`. The model includes fields such as `fullname`, `emailId`, `phoneNumber`, `password`, `role`, `address`, and `profile`.

## Error Handling

The controller functions include error handling to manage various scenarios such as validation errors, authentication errors, and server errors.

## Conclusion

This document provides a comprehensive overview of the `user.controller.js` file, detailing the endpoints, middlewares, and models used. For further details, refer to the respective files and their implementations.
 