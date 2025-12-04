// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import RequireAuth from "./components/auth/RequireAuth.jsx";

import App from "./App.jsx"; // tu layout con sidebar/topbar
import Dashboard from "./pages/Dashboard.jsx";
import About from "./pages/About.jsx";
import Settings from "./pages/Settings.jsx";
import Login from "./pages/Login.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública: login */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas: todo lo demás va dentro de RequireAuth */}
          <Route element={<RequireAuth />}>
            {/* App es tu layout principal (sidebar, topbar, etc.) */}
            <Route element={<App />}>
              <Route index element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);