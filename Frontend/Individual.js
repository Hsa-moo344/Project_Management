import React, { useState, useEffect } from "react";
import ProfileCss from "../css/staff.module.css";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Individual() {
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
    activities: "",
    approvedBy: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedStartedDate, setSelectedStartedDate] = useState(""); // Start date
  const [selectedEndDate, setSelectedEndDate] = useState(""); // End date

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(
    `${new Date().getMonth() + 1}`.padStart(2, "0")
  );

  const getLastDayOfMonth = (date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  };
  // const getLastDayOfMonth = (date) => {
  //   const d = new Date(date);
  //   return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    if (
      (name === "timeIn" || name === "timeOut") &&
      updatedFormData.timeIn &&
      updatedFormData.timeOut
    ) {
      const start = new Date(`1970-01-01T${updatedFormData.timeIn}`);
      const end = new Date(`1970-01-01T${updatedFormData.timeOut}`);

      let diff = end - start;
      if (diff < 0) {
        end.setDate(end.getDate() + 1);
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
      const response = await fetch("http://localhost:8000/individualfunction", {
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
      alert("Server error, please try again later.");
    }
  };

  const fetchData = () => {
    axios.get("http://localhost:8000/individualfunction").then((res) => {
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

  // Called when Update button clicked
  const UpdatedFunction = () => {
    if (!editId) {
      alert("No item selected for update");
      return;
    }
    axios
      .put(`http://localhost:8000/individualfunction/${editId}`, formData)
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
        .delete(`http://localhost:8000/individualfunction/${id}`)
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
    const date = item.date?.slice(0, 10) || ""; // Ensure date format is YYYY-MM-DD
    const search = searchTerm.trim().toLowerCase();

    const matchesName = search === "" || name.includes(search);

    const matchesDate =
      (!selectedStartedDate || date >= selectedStartedDate) &&
      (!selectedEndDate || date <= selectedEndDate);

    return matchesName && matchesDate;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const displayedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // const downloadPDF = () => {
  //   if (filteredData.length === 0) {
  //     alert("No data available to download!");
  //     return;
  //   }

  //   const doc = new jsPDF("landscape");
  //   const pageWidth = doc.internal.pageSize.getWidth();

  //   // ====== Header Section ======
  //   doc.setFontSize(14);
  //   doc.setFont("helvetica", "bold");
  //   doc.text("Name", 15, 20);
  //   doc.setFont("helvetica", "normal");
  //   doc.text(`: ${filteredData[0].name || ""}`, 40, 20);

  //   doc.setFont("helvetica", "bold");
  //   doc.text("Month", pageWidth / 2 + 30, 20);
  //   doc.setFont("helvetica", "normal");
  //   const monthName =
  //     new Date(filteredData[0].date).toLocaleString("default", {
  //       month: "long",
  //     }) || "";
  //   doc.text(`: ${monthName}`, pageWidth / 2 + 55, 20);

  //   doc.setFont("helvetica", "bold");
  //   doc.text("Position", 15, 30);
  //   doc.setFont("helvetica", "normal");
  //   doc.text(`: ${filteredData[0].position || ""}`, 40, 30);

  //   // ====== Table Columns ======
  //   const tableColumn = [
  //     "Day",
  //     "Date",
  //     "Attend Type",
  //     "Start Time",
  //     "Finish Time",
  //     "Activities",
  //   ];

  //   // ====== Table Data from filteredData ======
  //   const tableRows = filteredData.map((item) => {
  //     const dateObj = new Date(item.date);
  //     const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
  //     const formattedDate = dateObj.toLocaleDateString("en-GB", {
  //       day: "2-digit",
  //       month: "short",
  //       year: "2-digit",
  //     });

  //     return [
  //       dayName,
  //       formattedDate,
  //       item.type || "",
  //       item.timeIn || "",
  //       item.timeOut || "",
  //       item.activities || "",
  //     ];
  //   });

  //   // ====== Table Style ======
  //   autoTable(doc, {
  //     startY: 40,
  //     head: [tableColumn],
  //     body: tableRows,
  //     theme: "grid",
  //     styles: {
  //       halign: "center",
  //       valign: "middle",
  //       fontSize: 10,
  //       cellPadding: 3,
  //     },
  //     headStyles: {
  //       fillColor: [242, 220, 219], // light pink header
  //       textColor: [0, 0, 0],
  //       fontStyle: "bold",
  //     },
  //     bodyStyles: {
  //       fillColor: [255, 255, 204], // light yellow rows
  //     },
  //     alternateRowStyles: {
  //       fillColor: [255, 255, 204],
  //     },
  //     columnStyles: {
  //       0: { cellWidth: 25 }, // Day
  //       1: { cellWidth: 30 }, // Date
  //       2: { cellWidth: 30 }, // Attend Type
  //       3: { cellWidth: 30 }, // Start Time
  //       4: { cellWidth: 30 }, // Finish Time
  //       5: { cellWidth: 100 }, // Activities
  //     },
  //   });

  //   // ====== Footer ======
  //   const pageHeight = doc.internal.pageSize.getHeight();
  //   doc.setFontSize(10);
  //   doc.text(
  //     `Generated on: ${new Date().toLocaleDateString()}`,
  //     15,
  //     pageHeight - 10
  //   );

  //   // ====== Save File ======
  //   const fileName = `${
  //     filteredData[0].name || "Individual"
  //   }_Timesheet_${monthName}.pdf`;
  //   doc.save(fileName);
  // };
  const downloadPDF = () => {
    if (filteredData.length === 0) {
      alert("No data available to download!");
      return;
    }

    const doc = new jsPDF("landscape");
    const pageWidth = doc.internal.pageSize.getWidth();

    // ====== Header Section ======
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Individual Monthly Timesheet Report", pageWidth / 2, 15, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Name", 15, 30);
    doc.setFont("helvetica", "normal");
    doc.text(`: ${filteredData[0].name || ""}`, 45, 30);

    doc.setFont("helvetica", "bold");
    doc.text("Position", 15, 38);
    doc.setFont("helvetica", "normal");
    doc.text(`: ${filteredData[0].position || ""}`, 45, 38);

    doc.setFont("helvetica", "bold");
    doc.text("Month", pageWidth / 2 + 30, 30);
    doc.setFont("helvetica", "normal");
    const monthName =
      new Date(filteredData[0].date).toLocaleString("default", {
        month: "long",
        year: "numeric",
      }) || "";
    doc.text(`: ${monthName}`, pageWidth / 2 + 55, 30);

    // ====== Table Columns ======
    const tableColumn = [
      "No",
      "Day",
      "Date",
      "Attend Type",
      "Start Time",
      "Finish Time",
      "Working Hours",
      "Activities",
    ];

    // ====== Table Data ======
    const tableRows = filteredData.map((item, index) => {
      const dateObj = new Date(item.date);
      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
      const formattedDate = dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      });

      // Calculate working hours per day
      let workHours = "";
      if (item.timeIn && item.timeOut) {
        const start = new Date(`1970-01-01T${item.timeIn}`);
        const end = new Date(`1970-01-01T${item.timeOut}`);
        const diff = (end - start) / (1000 * 60 * 60);
        workHours = diff > 0 ? diff.toFixed(2) : "";
      }

      return [
        index + 1,
        dayName,
        formattedDate,
        item.type || "",
        item.timeIn || "",
        item.timeOut || "",
        workHours,
        item.activities || "",
      ];
    });

    // ====== Table Style ======
    autoTable(doc, {
      startY: 50,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: {
        halign: "center",
        valign: "middle",
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [242, 220, 219], // pink header
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      bodyStyles: {
        fillColor: [255, 255, 204], // yellow rows
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255],
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 20 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 30 },
        7: { cellWidth: 100 },
      },
    });

    // ====== Summary Section ======
    const finalY = doc.lastAutoTable.finalY + 10;

    const totalWorkingDays = filteredData.filter(
      (item) => item.type && item.type.toUpperCase() === "W"
    ).length;

    const totalLeaveDays = filteredData.filter(
      (item) => item.type && item.type.toUpperCase() === "L"
    ).length;

    const totalOffDays = filteredData.filter(
      (item) =>
        item.type &&
        (item.type.toUpperCase() === "DO" || item.type.toUpperCase() === "OFF")
    ).length;

    // Calculate total working hours
    const totalHours = filteredData.reduce((sum, item) => {
      if (item.timeIn && item.timeOut) {
        const start = new Date(`1970-01-01T${item.timeIn}`);
        const end = new Date(`1970-01-01T${item.timeOut}`);
        const diff = (end - start) / (1000 * 60 * 60);
        return sum + (diff > 0 ? diff : 0);
      }
      return sum;
    }, 0);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Monthly Summary", 15, finalY);

    autoTable(doc, {
      startY: finalY + 5,
      body: [
        ["Total Working Days", totalWorkingDays],
        ["Total Leave Days", totalLeaveDays],
        ["Total Off Days", totalOffDays],
        ["Total Working Hours", totalHours.toFixed(2) + " hrs"],
      ],
      theme: "grid",
      styles: { halign: "left", fontSize: 11 },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: "bold" },
        1: { cellWidth: 40 },
      },
      bodyStyles: {
        fillColor: [224, 235, 255],
      },
    });

    // ====== Signature Section ======
    let signatureY = doc.lastAutoTable.finalY + 25;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Staff Signature:", 40, signatureY);
    doc.text("Supervisor Approval:", pageWidth / 2 + 60, signatureY);

    // Draw signature lines
    doc.line(40, signatureY + 5, 100, signatureY + 5); // Staff line
    doc.line(
      pageWidth / 2 + 60,
      signatureY + 5,
      pageWidth / 2 + 120,
      signatureY + 5
    ); // Supervisor line

    // Optional note
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(
      "(Please sign after verifying the attendance and working hours.)",
      15,
      signatureY + 20
    );

    // ====== Footer ======
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      15,
      pageHeight - 10
    );

    // ====== Save PDF ======
    const fileName = `${
      filteredData[0].name || "Individual"
    }_Timesheet_${monthName}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className={ProfileCss.MainAttendance}>
      <h2>Mae Tao Clinic Individual Timesheet</h2>
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
            <option value="">Select</option>
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
            <option>Director</option>
            <option>Assistant Director</option>
            <option>Deputy Director</option>
            <option>Assistant Deputy Director</option>
            <option>Manager</option>
            <option>in charge</option>
            <option>Supervisor</option>
            <option>Shiftleader</option>
            <option>Medic Staff</option>
            <option>Accountant</option>
            <option>Volunteer</option>
            <option>Technical Support</option>
            <option>Medical Educator</option>
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
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>

        {/* Leave start date */}
        <label>
          Leave Start Date:
          <input
            type="date"
            name="startLeaveDay"
            value={formData.startLeaveDay}
            onChange={handleChange}
          />
        </label>

        {/* Leave end date */}
        <label>
          Leave End Date:
          <input
            type="date"
            name="endLeaveDay"
            value={formData.endLeaveDay}
            onChange={handleChange}
          />
        </label>

        {/* Display leave days this month */}
        <label>
          Leave Days This Month:
          <input
            type="number"
            value={formData.totalLeaveDaysThisMonth}
            readOnly
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
          Working hour:
          <input
            type="text"
            name="workingHours"
            value={formData.workingHours}
            readOnly
          />
        </label>
        <label>
          Activities:
          <textarea
            name="activities"
            value={formData.activities}
            onChange={handleChange}
            rows="5"
            cols="40"
            placeholder="Enter your activities here..."
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

      <h3 style={{ textAlign: "center" }}>Individual Staff Records List</h3>
      <div className={ProfileCss.IndividualTable}>
        <div className={ProfileCss.FilterContainer}>
          <div className={ProfileCss.FilterContainer}>
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={ProfileCss.TbnRecord}
            />

            <label>
              Select Month:
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className={ProfileCss.TbnRecord}
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const m = `${i + 1}`.padStart(2, "0");
                  const label = new Date(0, i).toLocaleString("default", {
                    month: "short",
                  });
                  return (
                    <option key={m} value={m}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </label>

            <label>
              Select Year:
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="2000"
                max="2100"
                className={ProfileCss.TbnRecord}
              />
            </label>
          </div>
        </div>
        <table className={ProfileCss.IndividualTbl}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Staff Code</th>
              <th>Gender</th>
              <th>Position</th>
              <th>Type</th>
              <th>Date</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Working Hours</th>
              <th>Leave</th>
              <th>Activities</th>
              <th>Approved By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="12">No matching records found.</td>
              </tr>
            ) : (
              filteredData.map((individual) => (
                <tr key={individual.id}>
                  <td style={{ minWidth: "100px" }}>{individual.name}</td>
                  <td>{individual.staffCode}</td>
                  <td>{individual.gender}</td>
                  <td>{individual.position}</td>
                  <td>{individual.type}</td>
                  <td>{individual.date?.slice(0, 10)}</td>
                  <td>{individual.timeIn}</td>
                  <td>{individual.timeOut}</td>
                  <td>{individual.workingHours}</td>
                  <td>{individual.totalLeaveDaysThisMonth}</td>
                  <td>{individual.activities}</td>
                  <td>{individual.approvedBy}</td>
                  <td>
                    <button
                      className={ProfileCss.editIndividual}
                      onClick={() => editFunction(individual.id)}
                    >
                      Edit
                    </button>
                    <button
                      className={ProfileCss.deleteIndividual}
                      onClick={() => deleteFunction(individual.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <tfoot>
          <tr>
            <td colSpan="9" style={{ textAlign: "center" }}>
              <button onClick={downloadPDF} className={ProfileCss.downloadPDF}>
                Download PDF
              </button>
            </td>
          </tr>
        </tfoot>
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

export default Individual;
