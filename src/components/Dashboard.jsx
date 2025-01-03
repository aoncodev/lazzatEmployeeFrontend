import React, { useState, useEffect } from "react";
import { Clock, Coffee, LogOut, User, AlertCircle } from "lucide-react";

export default function Dashboard({ employeeId, onLogout }) {
  const [status, setStatus] = useState({ clockStatus: "", breakStatus: "" });
  const [employee, setEmployee] = useState({ name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
    fetchEmployee();
  }, [employeeId]);

  const fetchStatus = async () => {
    try {
      const response = await fetch(
        `http://3.36.115.48:5000/api/${employeeId}/status`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch status");
      }
      const data = await response.json();
      setStatus({ clockStatus: data.status, breakStatus: data.breakStatus });
      setError("");
    } catch (error) {
      setError("Unable to update status. Please try again.");
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await fetch(
        `http://3.36.115.48:5000/api/employee/${employeeId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch employee data");
      }
      const data = await response.json();
      setEmployee({ name: data.name });
      setError("");
    } catch (error) {
      setError("Unable to fetch employee data. Please try again.");
    }
  };

  const handleAction = async (action) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://3.36.115.48:5000/api/${employeeId}/${action}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to ${action}`);
      }
      await fetchStatus();
      setError("");
    } catch (error) {
      setError(`Unable to ${action}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <User className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-lg">{employee.name}</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Status Card */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Current Status</span>
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Clock Status:</span>
                <span
                  className={`font-medium ${
                    status.clockStatus === "Clocked in"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {status.clockStatus || "Not clocked in"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Break Status:</span>
                <span
                  className={`font-medium ${
                    status.breakStatus === "On break"
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }`}
                >
                  {status.breakStatus || "Not on break"}
                </span>
              </div>
            </div>

            {error && (
              <div className="flex items-start space-x-2 p-4 bg-red-50 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Quick Actions
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => handleAction("clock")}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium 
                           transition duration-300 focus:outline-none focus:ring-4 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center space-x-2 ${
                             status.clockStatus === "Clocked in"
                               ? "bg-red-500 hover:bg-red-600 focus:ring-red-300"
                               : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300"
                           }`}
              >
                <Clock className="w-5 h-5" />
                <span>
                  {status.clockStatus === "Clocked in"
                    ? "Clock Out"
                    : "Clock In"}
                </span>
              </button>

              <button
                onClick={() => handleAction("break")}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium 
                           transition duration-300 focus:outline-none focus:ring-4
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center space-x-2 ${
                             status.breakStatus === "On break"
                               ? "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-300"
                               : "bg-green-500 hover:bg-green-600 focus:ring-green-300"
                           }`}
              >
                <Coffee className="w-5 h-5" />
                <span>
                  {status.breakStatus === "On break"
                    ? "End Break"
                    : "Start Break"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Employee Info Footer */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600 text-center">
            Employee ID: {employeeId} • Last updated:{" "}
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </main>
    </div>
  );
}
