import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileCss from "../css/staff.module.css";
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

const StaffInfo = () => {
  const [departments, setDepartments] = useState([]);
  const [openGroup, setOpenGroup] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [payrollData, setPayrollData] = useState([]);

  const toggleGroup = (groupName) => {
    setOpenGroup(openGroup === groupName ? null : groupName);
  };

  const handleDepartmentClick = async (departmentName) => {
    setSelectedDepartment(departmentName);

    if (departmentName === "Staff Payroll") {
      try {
        const res = await axios.get("http://localhost:8000/api/payroll-data");
        setPayrollData(res.data);
      } catch (err) {
        console.error("Failed to fetch payroll data", err);
      }
    } else {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/department-count"
        );
        setDepartments(res.data);
      } catch (err) {
        console.error("Failed to fetch department counts", err);
      }
    }
  };

  const departmentGroups = {
    "Admin Units": [
      "Finance",
      "Security/Public Relation/Kitchen",
      "Administration",
      "HR",
      "OD",
      "Organizational Development",
      "Health Adminstration Office",
      "HIS/Registration",
      "BBHS",
      "Training",
      "CDC",
    ],
    "OPD Units": [
      "Adult OPD",
      "Child OPD/Immunization",
      "RH OPD",
      "Eye",
      "Dental",
      "VCT/Blood Bank",
      "Pharmacy OPD/Main Cental",
      "Physio/TCM",
      "IPU",
    ],
    "IPD Units": [
      "RH IPD",
      "Child IPD",
      "Adult IPD",
      "Surgical IPD",
      "Lab",
      "Nursing Aid",
      "ECU",
    ],
  };

  const stafftimesheet = {
    "Operation Units": [
      "Human Resource Profile",
      "Staff Timesheet",
      "Individual Timesheet",
      "Staff Payroll",
      "Staff Profile Detail",
    ],
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/department-count")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Failed to fetch department counts", err));
  }, []);

  const filteredDepartments =
    selectedDepartment && selectedDepartment !== "Staff Payroll"
      ? departments.filter((d) => d.department === selectedDepartment)
      : departments;

  return (
    <div className={ProfileCss.DahsboardBar}>
      {/* === Slide Navigation === */}
      <div className={ProfileCss.SubDahsboardBar}>
        <h3>Departments</h3>
        {Object.entries(departmentGroups).map(([group, depts]) => (
          <div key={group}>
            <div
              onClick={() => toggleGroup(group)}
              className={ProfileCss.GrpNav}
            >
              {group}
            </div>
            {openGroup === group && (
              <ul style={{ paddingLeft: "20px", listStyle: "none", margin: 0 }}>
                {depts.map((dept) => (
                  <li
                    key={dept}
                    className={`${ProfileCss.DeptDash} ${
                      selectedDepartment === dept ? ProfileCss.ActiveDept : ""
                    }`}
                    onClick={() => handleDepartmentClick(dept)}
                  >
                    {dept}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {Object.entries(stafftimesheet).map(([group, depts]) => (
          <div key={group}>
            <div
              onClick={() => toggleGroup(group)}
              className={ProfileCss.GrpNav}
            >
              {group}
            </div>
            {openGroup === group && (
              <ul style={{ paddingLeft: "20px", listStyle: "none", margin: 0 }}>
                {depts.map((dept) => (
                  <li
                    key={dept}
                    className={`${ProfileCss.DeptDash} ${
                      selectedDepartment === dept ? ProfileCss.ActiveDept : ""
                    }`}
                    onClick={() => handleDepartmentClick(dept)}
                  >
                    {dept}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <button
          onClick={() => setSelectedDepartment(null)}
          className={ProfileCss.DashBtn}
        >
          Show All
        </button>
      </div>

      {/* === Table Section === */}
      <div
        className={ProfileCss.MainAttendance}
        style={{ flex: 1, padding: "20px" }}
      >
        <h2>
          {selectedDepartment
            ? `Staff Info for: ${selectedDepartment}`
            : "Staff Count by Department"}
        </h2>

        {selectedDepartment === "Staff Payroll" ? (
          <table className={ProfileCss.AttendanceTable}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Staff Code</th>
                <th>Full Name</th>
                <th>Gender</th>
                <th>Banding</th>
                <th>Position</th>
                <th>Department</th>
                <th>Pay Month</th>
                <th>Gross Salary</th>
                <th>Net Salary</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payrollData.map((item, index) => (
                <tr key={item.staffCode + item.payMonth}>
                  <td>{index + 1}</td>
                  <td style={{ minWidth: "80px", padding: "12px 14px" }}>
                    {item.staffCode}
                  </td>
                  <td style={{ minWidth: "160px", padding: "12px 20px" }}>
                    {item.fullName}
                  </td>
                  <td>{item.gender}</td>
                  <td>{item.banding}</td>
                  <td>{item.position}</td>
                  <td>{item.department}</td>
                  <td>{item.payMonth}</td>
                  <td>{item.grossSalary}</td>
                  <td>{item.netSalary}</td>
                  <td>{item.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className={ProfileCss.AttendanceTable}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Department</th>
                <th>Total Staff</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((item, index) => (
                <tr key={item.department}>
                  <td>{index + 1}</td>
                  <td>{item.department}</td>
                  <td>{item.total_staff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StaffInfo;
