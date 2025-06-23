import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProfileCss from "../css/staff.module.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Finance = () => {
  const [dash, setDash] = useState([]);
  const departmentName = "Security";

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = dash.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(dash.length / rowsPerPage);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/attendance?department=${departmentName}`)
      .then((res) => setDash(res.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, [departmentName]);

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    autoTable(doc, {
      head: [
        [
          "Number",
          "Name",
          "Gender",
          "Position",
          "Department",
          "Type",
          "Date",
          "Time In",
          "Time Out",
          "Working Hours",
          "Total Leave Day",
          "Approved By",
        ],
      ],
      body: dash.map((row, index) => [
        index + 1,
        row.name,
        row.gender,
        row.position,
        row.department,
        row.type,
        row.date?.slice(0, 10),
        row.timeIn,
        row.timeOut,
        row.workingHours,
        row.totalLeaveDaysThisMonth,
        row.approvedBy,
      ]),
      headStyles: {
        fillColor: [128, 128, 128],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        lineColor: [200, 200, 200],
        lineWidth: 0.5,
      },
      styles: {
        fontSize: 9,
        cellPadding: 2,
        overflow: "linebreak",
        columnWidth: "wrap",
      },
      columnStyles: {
        0: { cellWidth: 15 }, // Number
        1: { cellWidth: 35 }, // Name
        2: { cellWidth: 15 }, // Gender
        3: { cellWidth: 25 }, // Position
        4: { cellWidth: 25 }, // Department
        5: { cellWidth: 15 }, // Type
        6: { cellWidth: 20 }, // Date
        7: { cellWidth: 18 }, // Time In
        8: { cellWidth: 18 }, // Time Out
        9: { cellWidth: 25 }, // Working Hours
        10: { cellWidth: 25 }, // Total Leave Day
        11: { cellWidth: 25 }, // Approved By
      },
    });

    doc.save("Finance_Timesheet.pdf");
  };

  return (
    <>
      <div className={ProfileCss.MainDashboard}>
        <Link to="/Dashboard" className={ProfileCss.LinkButton}>
          Click to Main Dashboard Page
        </Link>
      </div>

      <div className={ProfileCss.MainAttendance}>
        <h2>
          Mae Tao Clinic Staff Timesheet Records - Security/Public Relation
        </h2>

        <table className={ProfileCss.AttendanceTable}>
          <thead className={ProfileCss.dashboardTbl}>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Position</th>
              <th>Department</th>
              <th>Type</th>
              <th>Date</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Working Hours</th>
              <th>Total Leave Day</th>
              <th>Approved By</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.gender}</td>
                <td>{item.position}</td>
                <td>{item.department}</td>
                <td>{item.type}</td>
                <td>{item.date?.slice(0, 10)}</td>
                <td>{item.timeIn}</td>
                <td>{item.timeOut}</td>
                <td>{item.workingHours}</td>
                <td>{item.totalLeaveDaysThisMonth}</td>
                <td>{item.approvedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={exportPDF} className={ProfileCss.ExportBtn}>
          Export to PDF
        </button>

        <div className={ProfileCss.Pagination}>
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
      </div>
    </>
  );
};

export default Finance;
