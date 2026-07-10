# 🚖 Uber Clone

## Production-Inspired Ride Hailing Platform

> A full-stack ride-hailing application built with the **MERN Stack**, inspired by the architecture of modern ride-sharing platforms. This project focuses on backend engineering, scalable architecture, secure authentication, ride lifecycle management, and clean software engineering practices rather than simply recreating Uber's user interface.

---

# 📖 About the Project

This project aims to understand how production ride-hailing platforms are engineered.

Instead of focusing only on frontend design, the emphasis is on building a modular backend that follows industry-standard architecture and software engineering principles.

The application currently supports secure authentication for riders and captains, ride creation, dynamic fare calculation, OTP generation, protected APIs, and a service-layer architecture.

As development continues, the project will evolve with caching, distributed messaging, and deployment technologies including **Redis**, **Apache Kafka**, and **Docker**.

---

# 🎯 Project Objectives

- Build scalable REST APIs
- Implement secure authentication
- Follow modular backend architecture
- Learn production software engineering practices
- Simulate real ride-booking workflow
- Explore distributed system concepts

---

# ✨ Current Features

## 🔐 Authentication
- User Registration & Login
- Captain Registration & Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes & Middleware

## 🚖 Ride Management
- Create Ride API
- Ride Validation
- Secure OTP Generation
- Pending Ride APIs
- Ride Status Management

## 🗺️ Maps & Navigation
- OpenRouteService Integration
- Real-time Address Autocomplete Suggestions
- Distance & Duration Calculation
- Dynamic Fare Calculation Engine

## 📡 Real-Time Communication
- Socket.IO Server Integration
- Live Geolocation Streaming
- Event-driven ride state updates

---

# 🏗️ System Architecture

```text
                    React Frontend
                          │
                          │ REST API / WebSockets
                          ▼
                 Express.js Backend
                          │
      ┌───────────────────┼───────────────────┐
      │                   │                   │
 Controllers          Middleware         Services
      │                   │                   │
      └───────────────────┼───────────────────┘
                          │
                       MongoDB
```

The backend follows a layered architecture where every component has a single responsibility.

---

# 🧠 Backend Architecture

| Layer | Responsibility |
|--------|----------------|
| Routes | Defines API endpoints |
| Controllers | Receives requests and returns responses |
| Services | Contains all business logic |
| Middleware | Authentication & request validation |
| Models | MongoDB schema definitions |
| Database | Stores application data |

---

# 🔐 Authentication Workflow

```text
User
   │
   ▼
Register / Login
   │
   ▼
Password Hashing (bcrypt)
   │
   ▼
JWT Token Generated
   │
   ▼
Client Stores Token
   │
   ▼
Protected Routes
   │
   ▼
Authentication Middleware
```

---

# 🚕 Ride Booking Workflow

```text
Passenger
     │
     ▼
Create Ride Request
     │
     ▼
Validate Pickup & Destination
     │
     ▼
Calculate Fare
     │
     ▼
Generate Secure OTP
     │
     ▼
Create Ride Document
     │
     ▼
Store Ride in MongoDB
     │
     ▼
Return Ride Details
```

---

# 🚖 Ride Lifecycle

| Status | Description |
|--------|-------------|
| Requested | Ride has been created |
| Accepted | Driver accepts the ride |
| Arrived | Driver reaches pickup location |
| Ongoing | Ride starts |
| Completed | Ride successfully ends |
| Cancelled | Ride cancelled |
| Rejected | Ride rejected by driver |

---

# 💻 Technology Stack

| Category | Technology | Purpose |
|-----------|------------|---------|
| Frontend | React.js | User Interface |
| Build Tool | Vite | Fast development |
| Styling | Tailwind CSS | Responsive UI |
| Backend | Node.js + Express.js | REST APIs |
| Database | MongoDB | Persistent data storage |
| ODM | Mongoose | MongoDB object modeling |
| Authentication | JWT + bcrypt | Secure authentication |
| Real-Time | Socket.IO | Bi-directional communication |
| Geospatial | OpenRouteService | Routing and coordinates |
| API Testing | Postman | Endpoint testing |
| Version Control | Git & GitHub | Source control |

---

# 📂 Backend Structure

| Folder | Responsibility |
|---------|----------------|
| config | Configuration files |
| controllers | API controllers |
| middleware | Authentication & validation |
| models | Database schemas |
| routes | API routes |
| services | Business logic |
| utils | Helper functions |
| db | Database connection |

---

# 📊 Current Progress

| Module | Status |
|---------|--------|
| User Authentication | ✅ Completed |
| Captain Authentication | ✅ Completed |
| JWT Authorization | ✅ Completed |
| Middleware | ✅ Completed |
| Database Models | ✅ Completed |
| Ride Routing & APIs | ✅ Completed |
| OpenRouteService Integration | ✅ Completed |
| Dynamic Fare Calculation | ✅ Completed |
| OTP Generation | ✅ Completed |
| Modular Backend Architecture | ✅ Completed |
| Socket.IO Live Streaming | ✅ Completed |

---

# 🛣️ Project Roadmap

The following technologies and features will be integrated as the project continues to evolve.

## ⚡ Redis
Redis will be integrated to improve performance by caching frequently changing data.
Planned use cases include:
- Active Driver Cache
- Driver Availability
- OTP Expiration
- Nearby Driver Lookup

## 📨 Apache Kafka
Kafka will be explored to understand event-driven architecture.
Possible integrations include:
- Ride Events
- Driver Assignment Events
- Analytics Pipeline
- Future Microservice Communication

## 💳 Payments
- Payment Gateway Integration
- Ride Billing
- Transaction History

## ☁️ Deployment
- Docker
- CI/CD Pipeline
- Cloud Deployment

---

# 📚 Learning Outcomes

| Concept | Status |
|----------|--------|
| REST APIs | ✅ |
| JWT Authentication | ✅ |
| MongoDB Modeling | ✅ |
| Middleware | ✅ |
| Service Layer Architecture | ✅ |
| Modular Backend Design | ✅ |
| Maps API Integration | ✅ |
| Socket.IO | ✅ |
| Redis Caching | 🚧 Planned |
| Apache Kafka | 🚧 Planned |
| Docker | 🚧 Planned |
| CI/CD | 🚧 Planned |

---

# 🤝 Contributing

Contributions, suggestions, and feedback are always welcome.
Feel free to fork the repository, open an issue, or submit a pull request.

---

# ⭐ Support

If you found this project helpful or interesting, consider giving it a **⭐ Star**.
Your support motivates me to continue improving the project.

---

# 👨‍💻 Developer

## Indra Mohan Kumar
**Computer Science Engineering Student**
**MERN Stack • Backend Development • Data Structures & Algorithms • System Design**

---
> **Currently under active development with the goal of evolving into a production-inspired ride-hailing platform featuring real-time communication, distributed messaging, caching, and scalable backend architecture.**
