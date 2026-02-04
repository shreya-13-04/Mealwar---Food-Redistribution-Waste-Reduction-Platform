# Mealwar - Food Redistribution & Waste Reduction Platform

A **role-aware web application** designed to safely redistribute surplus food from **restaurants, events, and institutional kitchens** to **NGOs and community kitchens**.  
The platform aims to **reduce food waste**, **ensure public health**, and **maintain accountability** through intelligent matching, secure access control, and real-time coordination.

---

##  Key Objectives
- Reduce edible food waste
- Ensure safe and timely food redistribution
- Enable transparent accountability among stakeholders
- Optimize logistics using intelligent matching
- Measure social and environmental impact

---

##  Tech Stack

###  Frontend
- **React.js** – Component-based user interface
- **Vite** – Fast development and build tool
- **React Router** – Client-side routing
- **Tailwind CSS** – Responsive UI styling
- **React Context API** – Authentication and language state management

---

###  Backend
- **Node.js** – Server-side JavaScript runtime
- **Express.js** – RESTful API framework
- **Firebase Authentication** – Secure user login and identity management

---

###  Database
- **MongoDB** – NoSQL database with flexible schema design
- **Mongoose** – Object Data Modeling (ODM) for MongoDB

---

###  Security & Access Control
- **Firebase ID Tokens (JWT)** – Secure API access
- **Role-Based Access Control (RBAC)**  
  - Food Provider (Donor)  
  - NGO  
  - Volunteer  
  - Admin  

---

##  Testing Strategy

| Test Type              | Tool Used                          |
|------------------------|------------------------------------|
| Unit Testing           | Jest                               |
| API Testing            | Supertest                          |
| UI Testing             | React Testing Library              |
| Integration Testing    | Jest + MongoDB Memory Server       |
| Manual Testing         | Test Case Documentation            |

---

##  CI/CD Pipeline 

###  Continuous Integration (CI)
**Tool:** GitHub Actions  

Triggered automatically on every Pull Request:
- ESLint code quality checks
- Backend tests (Jest)
- Frontend tests (React Testing Library)
- Build verification

---

###  Continuous Deployment 
- **Backend Deployment:** Render 
- **Frontend Deployment:** Vercel

---

##  Development Tools
- **Git & GitHub** – Version control
- **Postman** – API testing
- **Docker (Optional)** – Local containerized setup
- **GitHub Actions** – Automated workflows

---

##  Documentation
- Software Requirements Specification (SRS)
- Architecture Diagram
- ER Diagram
- API Documentation
- Manual Test Case Reports

---

##  Impact
- Reduces food wastage
- Supports food-insecure communities
- Saves CO₂ emissions through redistribution
- Encourages sustainable practices

---

##  Team
Built by a cross-functional team focusing on **trust, logistics optimization, real-time coordination, and sustainability-driven engineering**.

---
