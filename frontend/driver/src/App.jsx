import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DriverLogin from './pages/Driverlogin';
import DriverRegister from './pages/DriverRegister';
import DriverHome from './pages/DriverHome';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DriverLogin />} />
        <Route path="/driverlogin" element={<DriverLogin />} />
        <Route path="/driverregister" element={<DriverRegister />} />
        <Route path="/driverhome" element={<DriverHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
