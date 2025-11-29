// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Settings from "./pages/Settings"; // si no existe, lo creamos ahorita

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex bg-slate-100">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}