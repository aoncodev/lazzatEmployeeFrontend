import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Clock,
  Search,
  ChevronDown,
  AlertCircle,
  FileText,
  BarChart2,
} from "lucide-react";

export function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [employees, setEmployees] = useState([]);
  const [employeesStats, setEmployeesStats] = useState([]);
  const [todayClockStatus, setTodayClockStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    hourlyWage: "",
    active: true,
    role: "employee",
  });

  useEffect(() => {
    fetchEmployees();
    fetchTodayClockStatus();
    fetchEmployeeStats();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://3.36.115.48:5000/api/employee");
      if (!response.ok) throw new Error("Failed to fetch employees");
      const data = await response.json();
      setEmployees(data);
      setError("");
    } catch (err) {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeStats = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://3.36.115.48:5000/api/stats");
      if (!response.ok) throw new Error("Failed to fetch employees");
      const data = await response.json();
      setEmployeesStats(data);
      setError("");
    } catch (err) {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayClockStatus = async () => {
    try {
      const response = await fetch("http://3.36.115.48:5000/api/today");
      if (!response.ok) throw new Error("Failed to fetch today's clock status");
      const data = await response.json();
      setTodayClockStatus(data);
    } catch (err) {
      setError("Failed to load today's clock status");
    }
  };

  const formatHoursWorked = (hours) => {
    if (hours === undefined || hours === null) return "-";
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = Math.round(((hours - h) * 60 - m) * 60);
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!newEmployee.name || !newEmployee.hourlyWage) {
      setError("Name, Employee ID, and Hourly Wage are required.");
      return;
    }

    try {
      setLoading(true);

      // Prepare employee data
      const employeeData = {
        ...newEmployee,
        active: newEmployee.active ?? true,
        role: newEmployee.role || "employee",
      };

      const response = await fetch("http://3.36.115.48:5000/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) throw new Error("Failed to create employee");

      await fetchEmployees(); // Refresh employee list

      // Reset form fields
      setNewEmployee({
        name: "",
        hourlyWage: "",
        active: true,
        role: "employee",
      });
      setError("");
    } catch (err) {
      setError(err.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  async function handleDeleteEmployee(employeeID) {
    if (!employeeID) return;

    try {
      const response = await fetch(
        `http://3.36.115.48:5000/api/employee/${employeeID}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete employee");

      // Refresh employee list
      await fetchEmployees();
    } catch (err) {
      setError("Failed to delete employee");
    }
  }

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-lg">Admin Dashboard</span>
          </div>
          <button
            onClick={onLogout}
            className="text-gray-600 hover:text-gray-800"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === "dashboard"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("employees")}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === "employees"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Employees</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("add-employee")}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === "add-employee"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Add Employee</span>
            </div>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-start space-x-2 p-4 bg-red-50 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <div className="flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Total Employees
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {employeesStats.totalEmployees}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Clocked In
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {employeesStats.clockedIn}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  On Break
                </h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {employeesStats.onBreak}
                </p>
              </div>
            </div>

            {/* Today's Clock In/Out Status Table */}
            <div className="bg-white rounded-xl shadow-md mt-10">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Today's Clock In/Out Status
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clock In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clock Out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Break Hours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Worked Hours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Daily Wage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {todayClockStatus.map((status) => (
                      <tr key={status.employeeId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {status.employeeName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {status.employeeRole}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {status.employeeId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(status.date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {status.firstClockIn
                              ? new Date(
                                  status.firstClockIn
                                ).toLocaleTimeString()
                              : "Not clocked in"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {status.lastClockOut
                              ? new Date(
                                  status.lastClockOut
                                ).toLocaleTimeString()
                              : "Not clocked out"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatHoursWorked(status.totalBreakHours)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatHoursWorked(status.totalHoursWorked)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {status.dailyWage
                              ? `₩${status.dailyWage.toFixed(0)}`
                              : "-"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "employees" && (
          <div className="bg-white rounded-xl shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex-grow relative">
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {employee.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {employee.employeeId}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() =>
                            handleDeleteEmployee(employee.employeeId)
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Employee View */}
        {activeTab === "add-employee" && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Add New Employee
            </h2>
            <form onSubmit={handleCreateEmployee} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Wage
                </label>
                <input
                  type="number"
                  value={newEmployee.hourlyWage}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      hourlyWage: parseFloat(e.target.value) || "",
                    })
                  }
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Active Status
                </label>
                <select
                  value={newEmployee.active}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      active: e.target.value === "true",
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newEmployee.role}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium
                   hover:bg-blue-600 focus:outline-none focus:ring-4 
                   focus:ring-blue-200 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Employee"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
