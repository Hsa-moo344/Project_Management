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
  Cell,
} from "recharts";

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [chartBand, setChartBand] = useState([]);
  const [remarkData, setRemarkData] = useState([]);
  const [GenderData, setGenderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [OperationData, setOperationData] = useState([]);
  const totalRemarkStaff = remarkData.reduce(
    (acc, item) => acc + item.total,
    0
  );

  // Bandind colors
  const COLORS = [
    "#8884d8", // purple
    "#82ca9d", // green
    "#ffc658", // yellow
    "#ff7f50", // coral
    "#8dd1e1", // light blue
    "#a4de6c", // lime
    "#d0ed57", // light green
    "#ffbb28", // orange
    "#ff6f61", // salmon
    "#6a5acd", // slate blue
    "#20b2aa", // teal
    "#ff1493", // pink
    "#00bfff", // sky blue
    "#cd5c5c", // indian red
  ];

  // Department colors
  const DepartmentColors = {
    "Health Services": "#1f77b4",
    ECU: "#ff7f0e",
    IPU: "#2ca02c",
    "Nursing Program": "#d62728",
    "VCT, Blood Bank Department (HIV Program)": "#9467bd",
    "RH IPD": "#8c564b",
    "RH OPD": "#e377c2",
    "HIS and Registration": "#7f7f7f",
    "Eye Program": "#bcbd22",
    Lab: "#17becf",
    Referral: "#aec7e8",
    "Adult & Child IPD": "#ffbb78",
    "Physiotherapy & TCM Department": "#98df8a",
    "Surgical OPD": "#ff9896",
    "Adult OPD": "#c5b0d5",
    "Child OPD & Immunization": "#c49c94",
    Dental: "#f7b6d2",
    "Pharmacy OPD and Central Pharmacy": "#dbdb8d",
    "Pharamcy IPD": "#9edae5",
  };

  // Operation Department colors
  const OperationColors = {
    "Organisational Development": "#1f77b4",
    Kitchen: "#ff7f0e",
    "Health Training and Community Health": "#2ca02c",
    "Community Health": "#d62728",
    "Community Health and SRHR Program": "#9467bd",
    "School Health": "#8c564b",
    "Training Office": "#e377c2",
    "Bachelor of Nursing": "#7f7f7f",
    Library: "#bcbd22",
  };

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
        // 1️Fixed list: Banding 1 → Banding 13
        const allBands = Array.from({ length: 13 }, (_, i) => ({
          banding: `Banding ${i + 1}`,
          total: 0,
        }));

        //  Normalize banding names from DB
        const dbData = response.data.map((item) => {
          let bandingName = item.banding || "Unknown";

          // Convert "Band 8" → "Banding 8"
          if (/^Band\s*\d+$/i.test(bandingName)) {
            bandingName = bandingName.replace(/^Band/i, "Banding");
          }

          // Convert "Banding-8" → "Banding 8"
          bandingName = bandingName.replace("-", " ");

          return {
            banding: bandingName.trim(),
            total: Number(item.total),
          };
        });

        //  Merge fixed list with DB data
        const merged = allBands.map((band) => {
          const found = dbData.find(
            (d) => d.banding.toLowerCase() === band.banding.toLowerCase()
          );
          return found ? found : band;
        });

        // Add "Unknown" at the end if exists
        const unknown = dbData.find((d) => d.banding === "Unknown");
        if (unknown) merged.push(unknown);

        //  Update state
        setChartBand(merged);
      })
      .catch((error) => console.error("Banding fetch error:", error));
  }, []);

  // Department banding and status
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/banding-status-count")
      .then((response) => {
        // Format data from backend
        const formatted = response.data.map((item) => ({
          status: item.remark, // “remark” from MySQL
          total: item.total, // “total” from SQL COUNT
        }));
        setRemarkData(formatted);
      })
      .catch((error) => console.error("❌ Remark data fetch error:", error));
  }, []);

  // Health department data
  useEffect(() => {
    async function fetchDepartmentData() {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/staff/healthdepartments"
        );
        setDepartmentData(res.data);
      } catch (err) {
        console.error(err);
        setDepartmentData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDepartmentData();
  }, []);

  // Opeartion department data
  useEffect(() => {
    async function fetchOperationData() {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/staff/operationdepartments"
        );
        setOperationData(res.data);
      } catch (err) {
        console.error(err);
        setOperationData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOperationData();
  }, []);

  // Total Gender count
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/Total-gender-count")
      .then((response) => {
        console.log("✅ Backend response:", response.data);

        // ✅ Check if response data is valid array
        if (Array.isArray(response.data) && response.data.length > 0) {
          const GenderCount = response.data.map((item) => ({
            gender: item.gender,
            total: item.total,
          }));
          setGenderData(GenderCount);
        } else {
          setGenderData([]); // No data case
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Gender data fetch error:", error);
        setLoading(false);
      });
  }, []);
  // color for gender
  const genderColors = {
    Male: "#4F46E5", // Indigo
    Female: "#EC4899", // Pink
    "No Gender": "#9CA3AF", // Gray
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "30px",
        padding: "20px",
        flexDirection: "column",
      }}
    >
      {/* Department */}
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
              <Bar dataKey="total" name="Total Banding">
                {chartBand.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.banding === "Unknown"
                        ? "#999999" // Gray for "Unknown"
                        : COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Banding Status */}
      </div>

      {/* Staff Remark Summary Chart */}
      <div style={{ flex: 1, marginTop: "40px", padding: "20px" }}>
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
          Total Staff Status Summary
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={remarkData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" name="Staff Status">
              {remarkData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Remark Summary under chart */}
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            borderTop: "1px solid #ccc",
            textAlign: "center",
            fontWeight: "bold",
            backgroundColor: "#f9f9f9",
          }}
        ></div>
        {/* Total gender count */}
        <div style={{ flex: 1, padding: "20px" }}>
          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
            Total Staff by Gender
          </h3>

          {loading ? (
            <p style={{ textAlign: "center" }}>Loading...</p>
          ) : GenderData.length === 0 ? (
            <p style={{ textAlign: "center", color: "gray" }}>
              No data available
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={GenderData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="gender" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" name="Gender">
                  {GenderData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={genderColors[entry.gender] || "#6B7280"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Health Services department */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            borderRadius: "8px",
            color: "#fff",
            display: "flex", // enable flex
            justifyContent: "flex-start", // align items to the left
          }}
        >
          <div style={{ width: "600px" }}>
            {" "}
            {/* fixed width for the chart */}
            <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
              Total Staff by Health Services Department
            </h3>
            {loading ? (
              <p style={{ textAlign: "center" }}>Loading...</p>
            ) : DepartmentData.length === 0 ? (
              <p style={{ textAlign: "center", color: "gray" }}>
                No data available
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  layout="vertical"
                  data={DepartmentData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }} // left margin smaller
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    stroke="#fff"
                    tick={{ fill: "#fff" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="department"
                    stroke="#fff"
                    tick={{ fill: "#fff" }}
                    width={200} // keep enough space for labels
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#333", border: "none" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend wrapperStyle={{ color: "#fff" }} />
                  <Bar
                    dataKey="total"
                    name="Total Health Services Department Staff"
                  >
                    {DepartmentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={DepartmentColors[entry.department] || "#6B7280"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Operation department */}
          <div
            style={{
              flex: 1,
              padding: "20px",
              borderRadius: "8px",
              color: "#fff",
              display: "flex", // enable flex
              justifyContent: "flex-start", // align items to the left
            }}
          >
            <div style={{ width: "600px" }}>
              {" "}
              {/* fixed width for the chart */}
              <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
                Total Staff by Operation Department
              </h3>
              {loading ? (
                <p style={{ textAlign: "center" }}>Loading...</p>
              ) : OperationData.length === 0 ? (
                <p style={{ textAlign: "center", color: "gray" }}>
                  No data available
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    layout="vertical"
                    data={OperationData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }} // left margin smaller
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis
                      type="number"
                      allowDecimals={false}
                      stroke="#fff"
                      tick={{ fill: "#fff" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="department"
                      stroke="#fff"
                      tick={{ fill: "#fff" }}
                      width={200} // keep enough space for labels
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#333", border: "none" }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Legend wrapperStyle={{ color: "#fff" }} />
                    <Bar
                      dataKey="total"
                      name="Total Opeartion Department Staff"
                    >
                      {OperationData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={OperationColors[entry.department] || "#6B7280"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
