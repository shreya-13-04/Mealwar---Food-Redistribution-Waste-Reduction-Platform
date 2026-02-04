# Mealwar – API Documentation

This document provides a high-level overview of REST API endpoints
used in the Mealwar Food Redistribution & Waste Reduction Platform.
These APIs support identity management, surplus listing, safety enforcement,
logistics coordination, and impact analytics.

---

## 1. Authentication & Identity APIs

| Method | Endpoint | Description |
|------|--------|------------|
| POST | /api/auth/register | Register user with one or more roles |
| POST | /api/auth/login | Authenticate user via Firebase |
| GET | /api/auth/me | Fetch logged-in user profile |
| PUT | /api/auth/roles | Update user roles (admin only) |

---

## 2. Trust & Verification APIs

| Method | Endpoint | Description |
|------|--------|------------|
| GET | /api/trust/:userId | Fetch trust score of a user |
| PUT | /api/trust/update | Update trust score after transaction |
| GET | /api/verification/:userId | Get verification status |
| PUT | /api/verification/:userId | Update verification level |

---

## 3. Consent & Audit APIs

| Method | Endpoint | Description |
|------|--------|------------|
| POST | /api/consent | Record user consent |
| GET | /api/consent/:userId | Fetch consent history |
| GET | /api/audit/logs | Retrieve audit logs (admin only) |

---

## 4. Surplus Listing APIs

| Method | Endpoint | Description |
|------|--------|------------|
| POST | /api/surplus | Create surplus food listing |
| GET | /api/surplus | View available surplus listings |
| GET | /api/surplus/:id | View surplus listing details |
| PUT | /api/surplus/:id | Update surplus listing |
| DELETE | /api/surplus/:id | Remove surplus listing |

---

## 5. Safety & Hygiene APIs

| Method | Endpoint | Description |
|------|--------|------------|
| POST | /api/hygiene | Submit hygiene declaration |
| GET | /api/hygiene/:surplusId | View hygiene details |
| POST | /api/safety/validate | Validate food safety rules |
| GET | /api/safety/status/:surplusId | Get safety status |

---

## 6. Matching & Logistics APIs

| Method | Endpoint | Description |
|------|--------|------------|
| POST | /api/match | Trigger surplus-to-NGO matching |
| GET | /api/match/:surplusId | View matching results |
| POST | /api/pickup/assign | Assign volunteer for pickup |
| PUT | /api/pickup/status | Update pickup status |

---

## 7. Failure & Escalation APIs

| Method | Endpoint | Description |
|------|--------|------------|
| POST | /api/pickup/escalate | Trigger re-matching on failure |
| GET | /api/alerts | View system alerts (admin) |

---

## 8. Impact & Analytics APIs

| Method | Endpoint | Description |
|------|--------|------------|
| GET | /api/impact/:surplusId | View impact data |
| GET | /api/impact/summary | Platform-wide impact metrics |
| GET | /api/reports/institution | Generate institutional reports |

---

## 9. Language & Accessibility APIs

| Method | Endpoint | Description |
|------|--------|------------|
| PUT | /api/preferences/language | Update language preference |
| GET | /api/preferences/:userId | Fetch user preferences |

---

## Notes
- All APIs are secured using Firebase JWT authentication.
- Role-Based Access Control (RBAC) is enforced at middleware level.
- This documentation represents logical API design and may evolve during implementation.
