import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {DriverAuthProvider} from "./context/DriverAuthContext";
ReactDOM.createRoot(document.getElementById("root")).render (
  <React.StrictMode>
    <DriverAuthProvider>
      <App />
    </DriverAuthProvider>
  </React.StrictMode>
);
