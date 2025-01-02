import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PinEntry from "./components/PinEntry";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [employeeId, setEmployeeId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is already logged in (persisted state)
  useEffect(() => {
    const storedEmployeeId = localStorage.getItem("employeeId");
    const storedIsAdmin = localStorage.getItem("isAdmin") === "true";

    if (storedEmployeeId) {
      setEmployeeId(storedEmployeeId);
      setIsAdmin(storedIsAdmin);
    }
  }, []);

  const handlePinSubmit = async (pin) => {
    try {
      const employeeResponse = await fetch(
        `http://localhost:5000/api/employee/${pin}`
      );

      if (employeeResponse.ok) {
        const employeeData = await employeeResponse.json();

        if (employeeData.role === "admin") {
          setIsAdmin(true);
          localStorage.setItem("isAdmin", true);
        } else {
          setIsAdmin(false);
          localStorage.setItem("isAdmin", false);
        }

        setEmployeeId(pin);
        localStorage.setItem("employeeId", pin);
      } else {
        throw new Error("Invalid PIN");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const handleLogout = () => {
    setEmployeeId(null);
    setIsAdmin(false);
    localStorage.removeItem("employeeId");
    localStorage.removeItem("isAdmin");
  };

  const ProtectedRoute = ({ children }) => {
    if (!employeeId) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Login Route */}
          <Route
            path="/login"
            element={
              !employeeId ? (
                <PinEntry onPinSubmit={handlePinSubmit} />
              ) : isAdmin ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* Employee Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard employeeId={employeeId} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* Redirect all unknown paths to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}
