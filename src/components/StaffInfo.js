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
  const [staffCounts, setStaffCounts] = useState([]);

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
      "Security and Patients Relation",
      "Administration",
      "Human Resources",
      "Organisational Development",
      "Health Services",
      "HIS and Registration",
      "Burma Based Health Services",
      "Training",
      "Referral",
      "Health Training and Community Health",
      "Community Health",
      "Community Health and SRHR Program",
      "School Health",
      "Training Office",
      "Bachelor of Nursing",
      "Library",
      "Education",
      "CDC - Admin",
      "CDC - High Teachers",
      "CDC - Middle Teachers",
      "CDC - Primary Teachers",
      "Non-Formal Education (NFE)",
      "CDC - Early Childhood Development (ECD)",
      "CDC - Education Quality Frame Work (EQF)",
      "CDC - Community Development / Protection",
      "GED Program",
      "Child Protection",
      "Birth Registration",
      "Daycare Centre",
      "Boarding House (Migrant)",
      "CDC Boarding House IDP",
      "Logistics",
      "Operations",
      "Vehicle",
      "Staff Advance Course (Bachelor of Nursing)",
      "Staff Advance Course (EmONC)",
      "Staff Advance Course (Medic Group 3)",
      "Community Operations",
      "Fundraising",
      "Kitchen",
      "Facilities",
      "Water & Sanitation",
      "Sewing Center",
      "Staff Advance",
    ],
    "OPD Units": [
      "Adult-OPD",
      "Child OPD & Immunization",
      "RH OPD",
      "Eye Program",
      "Dental",
      "VCT, Blood Bank Department (HIV Program)",
      "Pharmacy OPD/Main Cental",
      "Physiotherapy & TCM Department",
      "IPU",
      "Surgical OPD",
      "Pharmacy OPD and Central Pharmacy",
    ],
    "IPD Units": [
      "RH IPD",
      "Adult & Child IPD",
      "Surgical IPD",
      "Lab",
      "Nursing Program",
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

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/department-gender")
      .then((res) => {
        setStaffCounts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching department-gender data:", err);
      });
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
      <div>
        <h2 className={ProfileCss.SectionTitle}>
          Staff Count by Department and Gender
        </h2>
        <table className={ProfileCss.AttendanceTable}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Department</th>
              <th>Gender</th>
              <th>Total Staff</th>
            </tr>
          </thead>
          <tbody>
            {staffCounts.map((item, index) => (
              <tr key={`${item.department}-${item.gender}`}>
                <td>{index + 1}</td>
                <td>{item.department}</td>
                <td>{item.gender}</td>
                <td>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffInfo;
