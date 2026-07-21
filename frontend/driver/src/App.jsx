import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DriverLogin from './pages/Driverlogin';
import DriverRegister from './pages/DriverRegister';
import DriverHome from './pages/DriverHome';
import DriverProtectWrapper from './componenets/DriverProtectWrapper';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<DriverLogin />} />
        <Route path="/driverlogin" element={<DriverLogin />} />
        <Route path="/driverregister" element={<DriverRegister />} />
        <Route path="/driverhome" element={
          <DriverProtectWrapper>
            <DriverHome />
          </DriverProtectWrapper>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
