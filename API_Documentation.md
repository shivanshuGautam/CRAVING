# 🍔 Cravings - API Documentation

> **Base URL:** `http://localhost:4500`
>
> **Authentication:** Cookie-based JWT (`Oreo` cookie for general auth, `kitkat` cookie for OTP auth)
>
> **Content-Type:** `application/json` (unless specified as `multipart/form-data`)

---

## 📑 Table of Contents

1. [Auth APIs](#1--auth-apis)
2. [Common APIs (All Roles)](#2--common-apis-all-roles)
3. [Public APIs](#3--public-apis)
4. [Restaurant APIs](#4--restaurant-apis)
5. [Customer APIs](#5--customer-apis)
6. [Admin APIs](#6--admin-apis)
7. [Rider APIs](#7--rider-apis)

---
# 🍔 Cravings — Simple API Reference

**Base URL:** `http://localhost:4500`

**Auth** — cookie-based JWTs:
- `Oreo`: primary auth cookie for protected routes
- `kitkat`: temporary cookie after OTP verification (used for password reset)

Content-Type: `application/json` unless endpoint requires `multipart/form-data`.

Quick Start
- Register a user:
  ```bash
  curl -X POST http://localhost:4500/auth/register \
    -H "Content-Type: application/json" \
    -d '{"fullName":"A User","email":"user@example.com","password":"pass123","phone":"9876543210","userType":"customer"}'
  ```
- Login (saves `Oreo` cookie to `cookies.txt`):
  ```bash
  curl -X POST http://localhost:4500/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com","password":"pass123"}' \
    -c cookies.txt
  ```
- Use saved cookie to call protected endpoints:
  ```bash
  curl -X GET http://localhost:4500/user/profile -b cookies.txt
  ```

Top-level Summary
- Auth: register, login, logout, send/verify OTP, reset password
- Public: contact form (implemented); restaurant listing/search (planned)
- User: edit profile, change password
- Restaurant: get/update profile (implemented); menu & orders (planned)

Auth Endpoints (important)
- `POST /auth/register` — create user
- `POST /auth/login` — login and receive `Oreo` cookie
- `GET /auth/logout` — clear cookie
- `POST /auth/send-otp` — send password-reset OTP to email
- `POST /auth/verify-otp` — verify OTP, set `kitkat`
- `POST /auth/reset-password` — reset password (requires `kitkat`)

Public (no auth)
- `POST /public/contact-us` — submit contact form (implemented)

Common (requires `Oreo`)
- `PUT /user/edit-profile` — update name/phone/photo (multipart)
- `PATCH /user/change-password` — change password (old + new)

Restaurant (requires `Oreo` + restaurant role)
- `GET /restaurant/get-restaurant-data?id=managerId` — fetch restaurant profile
- `PUT /restaurant/update-profile` — create/update restaurant (multipart)

Planned (high-level)
- Customer: address book, place orders, view/track/cancel, rate orders
- Admin: manage users/restaurants/riders, platform dashboard, contacts
- Rider: profile, toggle availability, accept deliveries, update status

Error format
```json
{ "message": "Error description" }
```

HTTP status quick guide
- `400` Bad Request — invalid or missing input
- `401` Unauthorized — invalid/expired token
- `403` Forbidden — role not permitted
- `404` Not Found — resource missing
- `409` Conflict — duplicate resource
- `500` Internal Server Error

Data models (short)
- User: `_id, fullName, email, phone, dob, gender, password (hashed), photo, userType`
- Restaurant: `_id, managerId, restaurantName, address, cuisineTypes, images, isOpen, status, averageRating, servingHours, financial/contact details`
- Customer: `_id, customerId, addressBook[]`
- Rider: `_id, riderId, vehicleDetails, documents, currentLocation, isAvailable`
- Order: `_id, restaurantId, customerId, riderId?, orderItems[], orderStatus, billDetails, deliveryAddress, paymentDetails`
- Menu: `_id, restaurantId, menuItems[]`
- Contact: `_id, fullName, email, phone, subject, message, createdAt`

Next steps I can do for you
- Expand any endpoint with request/response examples
- Generate a Postman collection or OpenAPI spec
- Add cURL examples for planned endpoints

  "phone": "String",
  "subject": "String",
  "message": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### OTP Model
```json
{
  "_id": "ObjectId",
  "email": "String (unique)",
  "otp": "String (hashed)",
  "expiresAt": "Date (5 min from creation)"
}
```

---

## 🔒 Middleware Reference

| Middleware | Cookie | Description |
|---|---|---|
| `AuthProtect` | `Oreo` | Verifies JWT token from `Oreo` cookie. Attaches `req.user` with full user object. Used by Common, Customer, Admin, and Rider routes. |
| `OTPAuthProtect` | `kitkat` | Verifies JWT token from `kitkat` cookie (set after OTP verification). Used only for `reset-password` route. |
| `RestaurantAuthProtect` | `Oreo` | Verifies JWT token + checks `userType === "restaurant"`. Returns 403 if not a restaurant user. Used by Restaurant routes. |

---

## ⚠️ Common Error Response Format

All errors follow this consistent format:

```json
{
  "message": "Error description here"
}
```

| Status Code | Meaning |
|---|---|
| `400` | Bad Request — Missing or invalid fields |
| `401` | Unauthorized — Session expired / invalid token |
| `403` | Forbidden — User role not authorized |
| `404` | Not Found — Resource doesn't exist |
| `409` | Conflict — Duplicate resource (e.g., email) |
| `500` | Internal Server Error |

---

> **Legend:**
> - ✅ **Implemented** — API is coded and working in the current codebase
> - 🔮 **Planned** — API is designed based on existing models and will be implemented in future
