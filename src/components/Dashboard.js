import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MyBarChart = () => {
  const [chartData, setChartData] = useState([]);
  const [chartBand, setChartBand] = useState([]);
  const [chartLeave, setChartLeave] = useState([]);
  const [ChartLeavename, setChartLeavename] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Department chart data
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/department-count")
      .then((response) => {
        const formatted = response.data.map((item) => ({
          department: item.department,
          total: item.total_staff,
        }));
        setChartData(formatted);
      })
      .catch((error) => console.error("Department fetch error:", error));
  }, []);

  // Banding chart data
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/department-banding")
      .then((response) => {
        const formatted = response.data.map((item) => ({
          banding: item.banding_name || "Unknown",
          total: item.total_staff,
        }));
        setChartBand(formatted);
      })
      .catch((error) => console.error("Banding fetch error:", error));
  }, []);

  // Staff Leave chart data
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/department-leave")
      .then((response) => {
        const formatted = response.data.map((item) => ({
          leave: item.department || "Unknown", // use 'department' instead of 'staff_leave'
          total: item.totalStaffOnLeave || 0, // match field from backend
        }));
        setChartLeave(formatted);
      })
      .catch((error) => console.error("Leave fetch error:", error));
  }, []);

  // Staff Leave by name chart data
  axios.get("http://localhost:8000/api/department-name").then((response) => {
    const formatted = response.data.map((item) => ({
      leavename: item.name || "Unknown",
      total: item.totalLeaveDaysThisMonth || 0,
    }));
    setChartLeavename(formatted);
  });

  useEffect(() => {
    const params = {};
    if (selectedMonth) params.month = selectedMonth;
    if (selectedYear) params.year = selectedYear;

    axios
      .get("http://localhost:8000/api/department-leave", { params })
      .then((response) => {
        const formatted = response.data.map((item) => ({
          leave: item.department || "Unknown",
          total: item.totalStaffOnLeave || 0,
        }));
        setChartLeave(formatted);
      })
      .catch((error) => console.error("Leave fetch error:", error));
  }, [selectedMonth, selectedYear]);

  return (
    <div
      style={{
        display: "flex",
        gap: "30px",
        padding: "20px",
        flexDirection: "column",
      }}
    >
      {/* Top Row: Department + Banding */}
      <div style={{ display: "flex", gap: "30px" }}>
        {/* Department Chart */}
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" name="Department" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Banding Chart */}
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartBand}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="banding" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#82ca9d" name="Banding" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row: Leave Charts */}
      <div style={{ display: "flex", gap: "30px" }}>
        {/* Leave by Department */}
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartLeave}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="leave" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#ffc658" name="Leave by Department" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leave by Name */}
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={ChartLeavename}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="leavename" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#ff8042" name="Leave by Name" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">All Years</option>
          {[2024, 2025].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MyBarChart;
