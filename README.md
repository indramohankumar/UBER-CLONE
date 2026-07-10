# 🚖 Uber Clone - Full Stack Ride-Hailing Application

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A high-performance, real-time ride-hailing web application built from the ground up using the MERN stack and WebSockets. This project replicates the core functionalities of Uber, providing seamless location tracking, dynamic fare calculation, and instant ride requests.

---

## ✨ Key Features

- **🔐 Secure Authentication:** JWT-based robust authentication and authorization for both Riders and Drivers. Password encryption using bcrypt.
- **🗺️ Interactive Maps & Routing:** Integration with the **OpenRouteService API** for real-time location autocomplete, coordinate decoding, and accurate route plotting.
- **💰 Dynamic Fare Calculation:** Mathematical models on the backend calculate precise fares based on distance and estimated travel time.
- **📡 Real-Time Live Tracking:** Bi-directional real-time communication using **Socket.io**. Drivers broadcast their exact GPS coordinates, and riders see cars moving on the map instantly.
- **🎨 Premium UI/UX:** Responsive, modern, and beautiful user interfaces crafted with **Tailwind CSS**.

---

## 🛠️ Technology Stack

### **Frontend (Rider & Driver Apps)**
- **React.js** (Vite)
- **Tailwind CSS** (for rapid, beautiful styling)
- **React Router** (for SPA navigation)
- **React Context API** (for global state management)
- **Axios** (for API communication)
- **Socket.io-client** (for real-time events)

### **Backend (API & WebSockets)**
- **Node.js & Express.js**
- **MongoDB & Mongoose** (for scalable database management)
- **JSON Web Tokens (JWT)** (for stateless auth)
- **Socket.io** (for live geolocation streaming)
- **OpenRouteService API** (for geospatial calculations)

---

## 🚀 Installation & Setup

Want to run this project locally? Follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/indramohankumar/UBER-CLONE.git
cd UBER-CLONE
```

### 2. Setup the Backend
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add your secret keys:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
ORS_API_KEY=your_open_route_service_api_key
```

Start the backend server:
```bash
npm start
```

### 3. Setup the Frontend (Rider App)
Open a second terminal and navigate to the frontend directory:
```bash
cd frontend/rider
npm install
```
Start the Vite development server:
```bash
npm run dev
```

---

## 📂 Project Architecture

```text
UBER-CLONE/
├── backend/                  # Express server & MongoDB logic
│   ├── controllers/          # API logic (auth, maps, rides)
│   ├── middlewares/          # JWT protection
│   ├── models/               # Mongoose Database Schemas
│   ├── routes/               # API endpoint definitions
│   ├── services/             # OpenRouteService API integration
│   └── socket.js             # Real-time WebSocket handlers
│
└── frontend/                 # React applications
    └── rider/                # The Rider-facing Web App
        ├── src/
        │   ├── components/   # Reusable UI components
        │   ├── context/      # AuthContext for state
        │   ├── pages/        # Login, Register, Home
        │   └── services/     # Axios API instances
```

---

## 👨‍💻 Author

Developed by **Indra Mohan Kumar** 
*(Currently under active development)*
