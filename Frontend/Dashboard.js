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

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [chartBand, setChartBand] = useState([]);

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
        // Fixed list of Banding 1 → Banding 13
        const allBands = Array.from({ length: 13 }, (_, i) => ({
          banding: `Banding ${i + 1}`,
          total: 0,
        }));

        // Map API fields correctly
        const dbData = response.data.map((item) => ({
          banding: item.banding || "Unknown", // ✅ backend sends 'banding'
          total: Number(item.total), // ✅ backend sends 'total'
        }));

        // Merge fixed list with DB results
        const merged = allBands.map((band) => {
          const found = dbData.find(
            (d) => d.banding.toLowerCase() === band.banding.toLowerCase()
          );
          return found ? found : band;
        });

        // Add Unknown if exists
        const unknown = dbData.find((d) => d.banding === "Unknown");
        if (unknown) merged.push(unknown);

        setChartBand(merged);
      })
      .catch((error) => console.error("Banding fetch error:", error));
  }, []);

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
              <Bar dataKey="total" fill="#82ca9d" name="Total Staff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
