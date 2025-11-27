// src/App.jsx
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="min-h-screen flex bg-slate-100">
      <Sidebar />
      <Dashboard />
    </div>
  );
}

export default App;