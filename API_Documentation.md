# Cravings API Documentation

> Version: `1.0`
> 
> Base URL: `http://localhost:5000`
> 
> API style: RESTful JSON + multipart form-data for file upload endpoints

---

## 1. Overview

Cravings is a role-based food delivery management backend with the following route groups:

- `/auth` — user authentication and password recovery
- `/public` — publicly accessible endpoints
- `/common` — authenticated user operations
- `/restaurant` — authenticated restaurant-owner operations

The API uses cookie-based JWT authentication.

- `Oreo` cookie: required for protected endpoints
- `kitkat` cookie: issued after OTP verification and required only for password reset

Responses return JSON with a consistent error format:

```json
{ "message": "Error description here" }
```

---

## 2. Authentication

### 2.1 Cookie-based auth

Protected endpoints read the JWT from the `Oreo` cookie. If the cookie is missing, expired, or invalid, the server returns `401 Unauthorized`.

For password recovery, `POST /auth/verify-otp` issues a temporary `kitkat` cookie. The `kitkat` cookie must be present for `POST /auth/reset-password`.

### 2.2 Common auth flow

1. Register with `POST /auth/register`
2. Login with `POST /auth/login`
3. Use `Oreo` cookie for protected calls
4. Logout with `GET /auth/logout`
5. Forgot password: `POST /auth/send-otp`, then `POST /auth/verify-otp`, then `POST /auth/reset-password`

---

## 3. API Endpoints

### 3.1 Root

`GET /`

- Description: health check / welcome message
- Authentication: none
- Response:
  - `200 OK`
  - Body:
    ```json
    { "message": "Welcome to my Cravings Project" }
    ```

### 3.2 Auth Endpoints

#### `POST /auth/register`

Create a new user account.

Request headers:
- `Content-Type: application/json`

Request body:

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "9876543210",
  "gender": "male",
  "dob": "1990-01-01",
  "userType": "customer"
}
```

Success response:
- `201 Created`
- Body:
  ```json
  { "message": "User Created Successfully" }
  ```

Errors:
- `400` if any required field is missing
- `409` if email is already registered

#### `POST /auth/login`

Authenticate a user and issue the `Oreo` cookie.

Request headers:
- `Content-Type: application/json`

Request body:

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

Success response:
- `200 OK`
- Body:
  ```json
  {
    "message": "Welcome Back",
    "data": {
      "_id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "dob": "1990-01-01T00:00:00.000Z",
      "gender": "male",
      "photo": { "url": "...", "publicId": null },
      "userType": "customer",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

Errors:
- `400` if email or password is missing
- `404` if email is not registered
- `401` if password is incorrect

#### `GET /auth/logout`

Clear the `Oreo` cookie and log the user out.

Success response:
- `200 OK`
- Body:
  ```json
  { "message": "Logout Sucessfully" }
  ```

#### `POST /auth/send-otp`

Send a password-reset OTP to the registered email.

Request headers:
- `Content-Type: application/json`

Request body:

```json
{ "email": "john@example.com" }
```

Success response:
- `200 OK`
- Body:
  ```json
  { "message": "OTP sent on 'john@example.com'" }
  ```

Errors:
- `400` if email is missing
- `404` if the email is not registered

#### `POST /auth/verify-otp`

Verify the OTP and issue a temporary `kitkat` cookie for password reset.

Request headers:
- `Content-Type: application/json`

Request body:

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

Success response:
- `200 OK`
- Body:
  ```json
  { "message": "OTP verified. Create You New Password Now" }
  ```

Errors:
- `401` if the OTP is expired or invalid
- `404` if the email is not registered

#### `POST /auth/reset-password`

Reset a user password using the temporary `kitkat` cookie.

Request headers:
- `Content-Type: application/json`
- Cookie: `kitkat`

Request body:

```json
{ "newPassword": "NewPassword123" }
```

Success response:
- `200 OK`
- Body:
  ```json
  { "message": "Password Changed" }
  ```

Errors:
- `401` if the `kitkat` cookie is missing or invalid

---

### 3.3 Public Endpoints

#### `POST /public/contact-us`

Submit a contact inquiry.

Request headers:
- `Content-Type: application/json`

Request body:

```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "9876543210",
  "subject": "Partner inquiry",
  "message": "I would like to learn more about your service."
}
```

Success response:
- `201 Created`
- Body:
  ```json
  { "message": "Contact form submitted successfully" }
  ```

Errors:
- `400` if any required field is missing

---

### 3.4 Common Endpoints (Authenticated)

All endpoints under `/common` require the `Oreo` cookie.

#### `PUT /common/edit-profile`

Update user profile information and optionally upload a profile picture.

Request headers:
- `Content-Type: multipart/form-data`
- Cookie: `Oreo`

Request fields:
- `email` (string)
- `fullName` (string)
- `phone` (string)
- `displayPic` (file, optional)

Example using `curl`:

```bash
curl -X PUT http://localhost:5000/common/edit-profile \
  -H "Cookie: Oreo=<token>" \
  -F "email=john@example.com" \
  -F "fullName=John Doe" \
  -F "phone=9876543210" \
  -F "displayPic=@/path/to/avatar.jpg"
```

Success response:
- `200 OK`
- Body:
  ```json
  {
    "message": "User Updated Sucessfully",
    "data": { /* updated user document */ }
  }
  ```

Errors:
- `400` if any required field is missing
- `404` if the email is not registered

#### `PATCH /common/change-password`

Change the current authenticated user password.

Request headers:
- `Content-Type: application/json`
- Cookie: `Oreo`

Request body:

```json
{
  "oldPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

Success response:
- `200 OK`
- Body:
  ```json
  { "message": "Password updated successfully" }
  ```

Errors:
- `400` if any field is missing or if old password does not match

---

### 3.5 Restaurant Endpoints (Restaurant Role Only)

All `/restaurant` endpoints require the `Oreo` cookie and the authenticated user must have `userType: "restaurant"`.

#### `POST /restaurant/update-profile`

Create or update the restaurant profile for the authenticated restaurant manager.

Request headers:
- `Content-Type: multipart/form-data`
- Cookie: `Oreo`

Request fields:
- `restaurantName` (string)
- `address` (string)
- `city` (string)
- `state` (string)
- `pinCode` (string)
- `country` (string)
- `description` (string)
- `restaurantType` (string) — one of `veg`, `non-veg`, `jain`, `vegan`, `both`
- `cuisineTypes` (string or JSON array)
- `documents[legalName]` (string)
- `documents[companyType]` (string)
- `documents[gstCertificate]` (string)
- `documents[fssaiCertificate]` (string)
- `documents[panCard]` (string)
- `financialDetails[bankName]` (string)
- `financialDetails[accountNumber]` (string)
- `financialDetails[ifscCode]` (string)
- `contactDetails[email]` (string)
- `contactDetails[phone]` (string)
- `servingHours[openingTime]` (string)
- `servingHours[closingTime]` (string)
- `socialMediaLinks` (string or JSON array)
- `coverImage` (file, optional)
- `restaurantImage` (file[], optional)

> Note: The implementation expects the required restaurant fields in the request body. When sending nested or array values through multipart form-data, use JSON string values.

Success responses:
- `201 Created` when the restaurant profile is created
- `200 OK` when an existing restaurant profile is updated

Success response body:
```json
{
  "message": "Restaurant profile created successfully",
  "data": { /* restaurant document */ }
}
```

or

```json
{
  "message": "Restaurant profile updated successfully",
  "data": { /* restaurant document */ }
}
```

Errors:
- `400` if a required field is missing
- `403` if the authenticated user is not a restaurant
- `401` if authentication fails

#### `GET /restaurant/get-resturant-data?id=<managerId>`

Retrieve the restaurant profile for the authenticated restaurant manager.

Request headers:
- Cookie: `Oreo`

Query parameters:
- `id` — the restaurant manager user ID

Success response:
- `200 OK`
- Body:
  ```json
  {
    "message": "Restaurant Fetched Successfully",
    "data": [ /* restaurant records for manager */ ]
  }
  ```

If no restaurant data exists:
- `200 OK`
- Body:
  ```json
  {
    "message": "No restaurant Data Found",
    "data": {}
  }
  ```

Errors:
- `401` if the `id` does not match the authenticated user
- `403` if the authenticated user is not a restaurant

---

## 4. Data Models

### 4.1 User

```json
{
  "_id": "ObjectId",
  "fullName": "String",
  "email": "String",
  "phone": "String",
  "dob": "Date",
  "gender": "String",
  "password": "String (hashed)",
  "photo": {
    "url": "String",
    "publicId": "String | null"
  },
  "userType": "admin | customer | rider | restaurant",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 4.2 Restaurant

```json
{
  "_id": "ObjectId",
  "managerId": "ObjectId",
  "restaurantName": "String",
  "address": "String",
  "city": "String",
  "state": "String",
  "pinCode": "String",
  "country": "String",
  "geoLocation": {
    "lat": "String",
    "lon": "String"
  },
  "documents": {
    "legalName": "String",
    "companyType": "String",
    "gstCertificate": "String",
    "fssaiCertificate": "String",
    "panCard": "String"
  },
  "financialDetails": {
    "bankName": "String",
    "accountNumber": "String",
    "ifscCode": "String"
  },
  "contactDetails": {
    "email": "String",
    "phone": "String"
  },
  "servingHours": {
    "openingTime": "String",
    "closingTime": "String"
  },
  "isOpen": "Boolean",
  "status": "active | inactive | blocked",
  "averageRating": "Number",
  "cuisineTypes": ["String"],
  "restaurantImage": [
    { "url": "String", "publicId": "String" }
  ],
  "coverImage": { "url": "String", "publicId": "String" },
  "description": "String",
  "restaurantType": "veg | non-veg | jain | vegan | both",
  "socialMediaLinks": [
    { "platform": "String", "url": "String" }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 4.3 OTP

```json
{
  "_id": "ObjectId",
  "email": "String",
  "otp": "String (hashed)",
  "expiresAt": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 4.4 Contact

```json
{
  "_id": "ObjectId",
  "fullName": "String",
  "email": "String",
  "phone": "String",
  "subject": "String",
  "message": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## 5. Error Codes

| Status | Description |
|---|---|
| `400` | Bad Request — validation failed or required fields missing |
| `401` | Unauthorized — missing/invalid auth cookie or OTP token |
| `403` | Forbidden — user role does not have access |
| `404` | Not Found — resource not found |
| `409` | Conflict — duplicate resource or registration conflict |
| `500` | Internal Server Error |

---

## 6. Notes

- The server listens on `PORT` or `5000` by default.
- CORS is configured to allow requests from `http://localhost:5173`.
- File upload endpoints use `multer` and support multipart form-data.
- `RestaurantAuthProtect` enforces that only users with `userType: "restaurant"` can call `/restaurant` routes.
- `AuthProtect` attaches `req.user` to the request after verifying the `Oreo` cookie.
