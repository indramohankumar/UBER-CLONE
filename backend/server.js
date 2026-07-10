const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const {initializeSocket} = require('./socket');
dotenv.config();
const app=express();
const server=http.createServer(app);
initializeSocket(server);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/auth.routes');
const driverRoutes = require('./routes/driver.routes');
const rideRoutes = require('./routes/ride.routes');
const mapRoutes = require('./routes/map.routes');
app.use('/users', authRoutes);
app.use('/drivers', driverRoutes);
app.use('/rides', rideRoutes);
app.use('/maps', mapRoutes);

app.get('/', (req, res) => {
  res.send("Uber backend server is running");
});
mongoose
.connect(process.env.MONGODB_URI)
.then(() => {
  console.log("MongoDB connected successfully");
  server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});
