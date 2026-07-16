import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DriverLogin from "../pages/DriverLogin";
import DriverRegister from "../pages/DriverRegister";
import DriverHome from "../pages/DriverHome";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/driverlogin" element={<DriverLogin />} />
                <Route path="/driverregister" element={<DriverRegister />} />
                <Route path="/driverhome" element={<DriverHome />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;