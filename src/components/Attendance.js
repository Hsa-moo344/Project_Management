import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileCss from "../css/staff.module.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const initialForm = {
  name: "",
  staffCode: "",
  gender: "",
  position: "",
  department: "",
  // email: "",
  type: "",
  date: "",
  timeIn: "",
  timeOut: "",
  workingHours: "",
  startLeaveDay: "",
  endLeaveDay: "",
  totalLeaveDaysThisMonth: 0,
  approvedBy: "",
  // id: "",
};

function Attendance() {
  const [formData, setFormData] = useState(initialForm);
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStartedDate, setSelectedStartedDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");

  const getLastDayOfMonth = (date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    if (
      (name === "timeIn" || name === "timeOut") &&
      updatedFormData.timeIn &&
      updatedFormData.timeOut
    ) {
      const [startHour, startMinute] = updatedFormData.timeIn
        .split(":")
        .map(Number);
      const [endHour, endMinute] = updatedFormData.timeOut
        .split(":")
        .map(Number);

      const start = new Date();
      const end = new Date();
      start.setHours(startHour, startMinute, 0);
      end.setHours(endHour, endMinute, 0);

      let diff = end - start;
      if (diff < 0) {
        end.setDate(end.getDate() + 1); // Crossed midnight
        diff = end - start;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      updatedFormData.workingHours = `${hours
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }

    if (name === "startLeaveDay" || name === "endLeaveDay") {
      const start = new Date(updatedFormData.startLeaveDay);
      const end = new Date(updatedFormData.endLeaveDay);

      if (!isNaN(start) && !isNaN(end) && end >= start) {
        const lastDayOfStartMonth = getLastDayOfMonth(start);
        const lastCountDay =
          end > lastDayOfStartMonth ? lastDayOfStartMonth : end;
        const dayInMs = 1000 * 60 * 60 * 24;
        const diffDays = Math.ceil((lastCountDay - start) / dayInMs) + 1;
        updatedFormData.totalLeaveDaysThisMonth = diffDays;
      } else {
        updatedFormData.totalLeaveDaysThisMonth = 0;
      }
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/attendancefunction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Data submitted successfully!");
        setFormData(initialForm);
        fetchData();
      } else {
        const errorText = await response.text();
        alert("Failed to submit: " + errorText);
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Server error");
    }
  };

  const fetchData = () => {
    axios.get("http://localhost:8000/attendancefunction").then((res) => {
      setData(res.data);
    });
  };

  const editFunction = (id) => {
    const staff = data.find((s) => s.id === id);
    if (staff) {
      setFormData({ ...staff });
      setEditId(id);
    }
  };

  const UpdatedFunction = () => {
    if (!editId) {
      alert("No item selected for update");
      return;
    }

    axios
      .put(`http://localhost:8000/attendancefunction/${editId}`, formData)
      .then(() => {
        alert("Updated successfully");
        fetchData();
        setFormData(initialForm);
        setEditId(null);
      })
      .catch((err) => {
        console.log("Update failed", err);
        alert("Update failed");
      });
  };

  const deleteFunction = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      axios
        .delete(`http://localhost:8000/attendancefunction/${id}`)
        .then(() => {
          alert("Deleted successfully");
          fetchData();
        })
        .catch((err) => {
          console.log("Delete failed", err);
          alert("Failed to delete");
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const name = item.name?.toLowerCase() || "";
    const department = item.department?.toLowerCase() || "";
    // Convert number to string, no toLowerCase needed
    const leave =
      item.totalLeaveDaysThisMonth != null
        ? item.totalLeaveDaysThisMonth.toString()
        : "";
    const position = item.position?.toLowerCase() || "";
    const date = item.date?.slice(0, 10) || "";
    const search = searchTerm.toLowerCase();
    const selectedDept = selectedDepartment?.toLowerCase() || "";

    const matchesSearch =
      name.includes(search) ||
      department.includes(search) ||
      leave.includes(search) || // now safe because leave is string
      position.includes(search) ||
      date.includes(search);

    const matchesDepartment =
      selectedDept === "" || department === selectedDept;

    const matchesDate =
      (!selectedStartedDate || date >= selectedStartedDate) &&
      (!selectedEndDate || date <= selectedEndDate);

    return matchesSearch && matchesDepartment && matchesDate;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const displayedData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Mae Tao Clinic - Staff Timesheet Report", 14, 15);

    const tableColumn = ["Number", ...Object.keys(initialForm)];
    const tableRows = filteredData.map((row, index) => [
      index + 1,
      ...Object.keys(initialForm).map((key) => {
        const value = row[key] || "";
        // Check if the value is a date string
        if (typeof value === "string" && value.includes("T")) {
          return value.split("T")[0]; // Only return the date part
        }
        return value;
      }),
    ]);

    autoTable(doc, {
      startY: 25,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
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
        columnWidth: "wrap", // Required when using columnStyles
      },

      columnStyles: {
        0: { cellWidth: 15 }, // Serial number column

        ...Object.keys(initialForm).reduce((acc, key, i) => {
          acc[i + 1] = {
            cellWidth: ["name", "department"].includes(key) ? 23 : 18,
          };
          return acc;
        }, {}),
      },

      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      didDrawPage: function (data) {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(
          `Page ${
            doc.internal.getCurrentPageInfo().pageNumber
          } of ${pageCount}`,
          doc.internal.pageSize.getWidth() - 40,
          doc.internal.pageSize.getHeight() - 10
        );
      },
    });

    doc.save("Timesheet_report.pdf");
  };

  return (
    <div className={ProfileCss.MainAttendance}>
      <h2>Mae Tao Clinic Staff Timesheet</h2>
      <form className={ProfileCss.Attend} onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Staff Code:
          <input
            type="text"
            name="staffCode"
            value={formData.staffCode}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Gender:
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Position:
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          >
            <option value="">position</option>
            <option>in charge</option>
            <option>Supervisor</option>
            <option>Shiftleader</option>
            <option>Medic Staff</option>
            <option>Accountant</option>
            <option>Staff</option>
          </select>
        </label>

        <label>
          Department:
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Departments</option>
            <option>Finance</option>
            <option>HR</option>
            <option>Adult OPD</option>
            <option>Eye</option>
            <option>Dental</option>
            <option>Child OPD/Immunization</option>
            <option>RH OPD</option>
            <option>Lab</option>
            <option>RH IPD</option>
            <option>VCT/Blood Bank</option>
            <option>Pharmacy OPD/IPD/Main Center</option>
            <option>RH IPD</option>
            <option>Child IPD</option>
            <option>Surgical OPD/IPD</option>
            <option>Adult IPD</option>
            <option>Physiotherapy</option>
            <option>TCM</option>
            <option>Security/Public Relation</option>
            <option>Health Administraion Office</option>
            <option>HIS/Registration</option>
            <option>HR/OD</option>
            <option>ECU</option>
            <option>Administartion</option>
            <option>Kitchen</option>
            <option>BBHS</option>
            <option>Training</option>
          </select>
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Type:
          <input
            list="typeOptions"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
          <datalist id="typeOptions">
            <option value="Work" />
            <option value="Leave" />
            <option value="Absent" />
            <option value="Day Off" />
            <option value="Leave Without Pay" />
            <option value="Maternity Leave" />
            <option value="Paternity Leave" />
            <option value="Health Accident" />
            <option value="Education Leave" />
          </datalist>
        </label>

        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date?.slice(0, 10)}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Time In:
          <input
            type="time"
            name="timeIn"
            value={formData.timeIn}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Time Out:
          <input
            type="time"
            name="timeOut"
            value={formData.timeOut}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Working Hours:
          <input
            type="text"
            name="workingHours"
            value={formData.workingHours}
            onChange={handleChange}
          />
        </label>

        <label>
          Start Leave:
          <input
            type="date"
            name="startLeaveDay"
            value={formData.startLeaveDay?.slice(0, 10)}
            onChange={handleChange}
          />
        </label>

        <label>
          End Leave:
          <input
            type="date"
            name="endLeaveDay"
            value={formData.endLeaveDay?.slice(0, 10)}
            onChange={handleChange}
          />
        </label>

        <label>
          Total Leave:
          <input
            type="text"
            name="totalLeaveDaysThisMonth"
            value={formData.totalLeaveDaysThisMonth}
            onChange={handleChange}
          />
        </label>

        <label>
          Approved By:
          <input
            type="text"
            name="approvedBy"
            value={formData.approvedBy}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className={ProfileCss.submitBtn}>
          Submit
        </button>

        <button
          type="button"
          className={ProfileCss.submitBtn}
          onClick={UpdatedFunction}
        >
          Update
        </button>
      </form>
      {/* Staff Attendance Record display */}
      <h3 style={{ textAlign: "center" }}>Staff Timesheet Records List</h3>
      <div className={ProfileCss.AttendanceContainer}>
        <input
          type="text"
          placeholder="Search by name, department or position or leave"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={ProfileCss.TbnRecord}
        />

        <div className={ProfileCss.FilterContainer}>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className={ProfileCss.TbnRecord}
          >
            <option value="">All Departments</option>
            <option>Finance</option>
            <option>HR</option>
            <option>Adult OPD</option>
            <option>Eye</option>
            <option>Dental</option>
            <option>Child OPD/Immunization</option>
            <option>RH OPD</option>
            <option>Lab</option>
            <option>RH IPD</option>
            <option>VCT/Blood Bank</option>
            <option>Pharmacy OPD/IPD/Main Center</option>
            <option>RH IPD</option>
            <option>Child IPD</option>
            <option>Surgical OPD/IPD</option>
            <option>Adult IPD</option>
            <option>Physiotherapy</option>
            <option>TCM</option>
            <option>Security/Public Relation</option>
            <option>Health Administraion Office</option>
            <option>HIS/Registration</option>
            <option>HR/OD</option>
            <option>ECU</option>
            <option>Administartion</option>
            <option>Kitchen</option>
            <option>BBHS</option>
            <option>Training</option>
          </select>

          <input
            type="date"
            value={selectedStartedDate}
            onChange={(e) => setSelectedStartedDate(e.target.value)}
            className={ProfileCss.TbnRecord}
          />

          <input
            type="date"
            value={selectedEndDate}
            onChange={(e) => setSelectedEndDate(e.target.value)}
            className={ProfileCss.TbnRecord}
          />
        </div>

        {displayedData.length > 0 ? (
          <table className={ProfileCss.TblDisplayForm}>
            <thead className={ProfileCss.FormTbl}>
              <tr>
                <th
                  className={ProfileCss.FromContainer}
                  style={{ minWidth: "100px" }}
                >
                  Name
                </th>
                <th className={ProfileCss.FromContainer}>Staff Code</th>
                <th className={ProfileCss.FromContainer}>Gender</th>
                <th className={ProfileCss.FromContainer}>Position</th>
                <th className={ProfileCss.FromContainer}>Department</th>
                <th className={ProfileCss.FromContainer}>Type</th>
                <th className={ProfileCss.FromContainer}>Date</th>
                <th className={ProfileCss.FromContainer}>Time In</th>
                <th className={ProfileCss.FromContainer}>Time Out</th>
                <th className={ProfileCss.FromContainer}>Working Hours</th>
                <th className={ProfileCss.FromContainer}>Start Leave Day</th>
                <th className={ProfileCss.FromContainer}>End Leave Day</th>
                <th className={ProfileCss.FromContainer}>Total Leave Day</th>
                <th className={ProfileCss.FromContainer}>Approved By</th>
                <th className={ProfileCss.FromContainer}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((attendance) => (
                <tr key={attendance.id}>
                  <td className={ProfileCss.FromContainer}>
                    {attendance.name}
                  </td>
                  <td className={ProfileCss.FromContainer}>
                    {attendance.staffCode}
                  </td>
                  <td className={ProfileCss.FromContainer}>
                    {attendance.gender}
                  </td>
                  <td className={ProfileCss.FromContainer}>
                    {attendance.position}
                  </td>
                  <td className={ProfileCss.FromContainer}>
                    {attendance.department}
                  </td>
                  <td className={ProfileCss.FromContainer}>
                    {attendance.type}
                  </td>
                  <td className={ProfileCss.FromContainer}>
                    {attendance.date?.slice(0, 10)}
                  </td>
                  <td className={ProfileCss.FromContainer}>
                    {attendance.timeIn}
                  </td>
                  <td className={ProfileCss.FromContainer}>
                    {attendance.timeOut}
                  </td>
                  <td className={ProfileCss.FromContainer}>
                    {attendance.workingHours}
                  </td>
                  <td className={ProfileCss.FromContainer}>
                    {attendance.startLeaveDay
                      ? attendance.startLeaveDay?.slice(0, 10)
                      : ""}
                  </td>
                  <td className={ProfileCss.FromContainer}>
                    {attendance.endLeaveDay
                      ? attendance.endLeaveDay?.slice(0, 10)
                      : ""}
                  </td>
                  <td className={ProfileCss.FromContainer}>
                    {attendance.totalLeaveDaysThisMonth}
                  </td>
                  <td className={ProfileCss.FromContainer}>
                    {attendance.approvedBy}
                  </td>
                  <td className={ProfileCss.FromBtnContainer}>
                    <button
                      className={ProfileCss.EditBtn}
                      onClick={() => editFunction(attendance.id)}
                    >
                      Edit
                    </button>
                    <button
                      className={ProfileCss.DeleteBtn}
                      onClick={() => deleteFunction(attendance.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <td colSpan={19} style={{ textAlign: "center" }}>
                  <button
                    onClick={downloadPDF}
                    className={ProfileCss.downloadPDF}
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p>No attendance records to display.</p>
        )}
      </div>
      {totalPages > 1 && (
        <div className={ProfileCss.Attendancepagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`${ProfileCss.pageBtn} ${
                currentPage === index + 1 ? ProfileCss.activePage : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Attendance;
