import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileCss from "../css/staff.module.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const StaffInfo = () => {
  const [departments, setDepartments] = useState([]);
  const [openGroup, setOpenGroup] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [payrollData, setPayrollData] = useState([]);
  const [staffCounts, setStaffCounts] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPayroll = payrollData
    .filter((item) => (selectedMonth ? item.payMonth === selectedMonth : true))
    .filter(
      (item) =>
        (item.fullName ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (item.department ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );

  const totalPages = Math.ceil(filteredPayroll.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayroll = filteredPayroll.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const toggleGroup = (groupName) => {
    setOpenGroup(openGroup === groupName ? null : groupName);
  };

  const handleDepartmentClick = async (departmentName) => {
    setSelectedDepartment(departmentName);
    setSelectedMonth("");
    setCurrentPage(1);

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
      "Leave by department",
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
      .then((res) => setStaffCounts(res.data))
      .catch((err) =>
        console.error("Error fetching department-gender data:", err)
      );
  }, []);

  const filteredDepartments =
    selectedDepartment && selectedDepartment !== "Staff Payroll"
      ? departments.filter((d) => d.department === selectedDepartment)
      : departments;

  const exportPDF = () => {
    const doc = new jsPDF("landscape");
    doc.setFontSize(18);
    doc.text("Staff Payroll - Page " + currentPage, 14, 15);

    const tableColumn = [
      "No.",
      "Staff Code",
      "Full Name",
      "Gender",
      "Banding",
      "Position",
      "Department",
      "Pay Month",
      "Gross Salary",
      "Net Salary",
      "Status",
    ];

    const tableRows = currentPayroll.map((item, index) => [
      indexOfFirstItem + index + 1,
      item.staffCode,
      item.fullName,
      item.gender,
      item.banding,
      item.position,
      item.department,
      item.payMonth,
      item.grossSalary,
      item.netSalary,
      item.paymentStatus,
    ]);

    autoTable(doc, {
      startY: 25,
      head: [tableColumn],
      body: tableRows,
    });

    doc.save(`staff_payroll_page_${currentPage}.pdf`);
  };

  return (
    <div className={ProfileCss.DahsboardBar}>
      <div className={ProfileCss.SubDahsboardBar}>
        {Object.entries(departmentGroups).map(([group, depts]) => (
          <div key={group}>
            <div
              onClick={() => toggleGroup(group)}
              className={ProfileCss.GrpNav}
            >
              {group}
            </div>
            {openGroup === group && (
              <ul style={{ paddingLeft: "20px", listStyle: "none" }}>
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
              <ul style={{ paddingLeft: "20px", listStyle: "none" }}>
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
          <>
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="monthFilter"
                style={{ marginRight: "10px", fontWeight: "bold" }}
              >
                Filter by Month:
              </label>
              <select
                id="monthFilter"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  minWidth: "160px",
                }}
              >
                <option value="">All Months</option>
                {[...new Set(payrollData.map((item) => item.payMonth))]
                  .filter(Boolean)
                  .sort()
                  .map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
              </select>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label
                htmlFor="searchInput"
                style={{ marginRight: "10px", fontWeight: "bold" }}
              >
                Search (Name / Department):
              </label>
              <input
                id="searchInput"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Type name or department..."
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  minWidth: "250px",
                }}
              />
            </div>

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
                {currentPayroll.map((item, index) => (
                  <tr key={item.staffCode + item.payMonth}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{item.staffCode}</td>
                    <td>{item.fullName}</td>
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

            {totalPages > 1 && (
              <div className={ProfileCss.pagination}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`${ProfileCss.pageBtn} ${
                      currentPage === i + 1 ? ProfileCss.activePage : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}

            <button onClick={exportPDF} className={ProfileCss.submitBtn}>
              Export This Page to PDF
            </button>
          </>
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
