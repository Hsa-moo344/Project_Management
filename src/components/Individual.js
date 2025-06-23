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

  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Mae Tao Clinic - Staff Individual Report", 14, 15);

    const tableColumn = ["Number", ...Object.keys(initialForm)];

    const tableRows = filteredData.map((row, index) => [
      index + 1,
      ...Object.keys(initialForm).map((key) => {
        const value = row[key] || "";
        if (typeof value === "string" && value.includes("T")) {
          return value.split("T")[0];
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
        lineWidth: 0.3,
      },
      styles: {
        fontSize: 9,
        cellPadding: 2,
        overflow: "linebreak",
        columnWidth: "wrap",
      },
      columnStyles: {
        0: { cellWidth: 10 },
        ...Object.keys(initialForm).reduce((acc, key, i) => {
          acc[i + 1] = {
            cellWidth: key === "activities" ? 25 : 18,
          };
          return acc;
        }, {}),
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      didDrawPage: function () {
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

    doc.save("Individual_Report.pdf");
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
