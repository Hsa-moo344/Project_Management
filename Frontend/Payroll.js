import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileCss from "../css/staff.module.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const PayRollForm = {
  staffCode: "",
  fullName: "",
  banding: "",
  salaryYear: "",
  payMonth: "",
  workingDays: "",
  leaveDays: "",
  totalHours: "",
  hourlyRate: "",
  grossSalary: "",
  deductions: "",
  netSalary: "",
  paymentStatus: "",
};

function Payroll() {
  const [PayRollData, setPayRollData] = useState(PayRollForm);
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...PayRollData, [name]: value };

    const grossSalary =
      parseFloat(name === "grossSalary" ? value : updatedData.grossSalary) || 0;
    const deductions =
      parseFloat(name === "deductions" ? value : updatedData.deductions) || 0;

    if (name === "grossSalary" || name === "deductions") {
      updatedData.netSalary = (grossSalary - deductions).toFixed(2);
    }

    setPayRollData(updatedData);
  };

  const fetchData = () => {
    axios
      .get("http://localhost:8000/payrollfunction")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to fetch payroll data:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/payrollfunction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(PayRollData),
      });

      if (response.ok) {
        alert("Data submitted successfully!");
        setPayRollData(PayRollForm);
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

  const editFunction = (id) => {
    const payrollItem = data.find((item) => item.id === id);
    if (payrollItem) {
      setPayRollData({ ...payrollItem });
      setEditId(id);
    }
  };

  const UpdateFunction = () => {
    if (!editId) {
      alert("No item selected for update");
      return;
    }

    axios
      .put(`http://localhost:8000/payrollfunction/${editId}`, PayRollData)
      .then(() => {
        alert("Updated successfully");
        fetchData();
        setPayRollData(PayRollForm);
        setEditId(null);
      })
      .catch((err) => {
        console.error("Update failed", err);
        alert("Update failed");
      });
  };

  const deleteFunction = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      axios
        .delete(`http://localhost:8000/payrollfunction/${id}`)
        .then(() => {
          alert("Deleted successfully");
          fetchData();
        })
        .catch((err) => {
          console.error("Delete failed", err);
          alert("Failed to delete");
        });
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.staffCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const displayedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // Donwload PDF version
  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    // Add custom header
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Mae Tao Clinic - Payroll Report", 14, 15);

    // Prepare table headers (add "Number" as the first column)
    const tableColumn = [
      "Number",
      ...Object.keys(PayRollForm).map((key) =>
        key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
      ),
    ];

    // Prepare table rows with numbering
    const tableRows = filteredData.map((row, index) => [
      index + 1, // Row number
      ...Object.keys(PayRollForm).map((key) => row[key]),
    ]);

    autoTable(doc, {
      startY: 25,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [128, 128, 128], // Gray header
        textColor: [255, 255, 255], // White text
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
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245], // Light gray for alternate rows
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

    doc.save("payroll_report_landscape.pdf");
  };

  return (
    <div className={ProfileCss.MainAttendance}>
      <h2>Mae Tao Clinic Payroll Staff</h2>

      <input
        type="text"
        placeholder="Search by Name or Code"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className={ProfileCss.searchBox}
      />

      <form className={ProfileCss.Attend} onSubmit={handleSubmit}>
        {Object.entries(PayRollForm).map(([key]) => (
          <label key={key}>
            {key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
            :
            {key === "payMonth" || key === "paymentStatus" ? (
              <select
                name={key}
                value={PayRollData[key]}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select {key === "payMonth" ? "Month" : "Status"}
                </option>
                {(key === "payMonth"
                  ? [
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ]
                  : ["Pending", "Paid"]
                ).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : key === "banding" ? (
              <>
                <input
                  type="text"
                  list="BandingOpt"
                  name="banding"
                  value={PayRollData.banding}
                  onChange={handleChange}
                  required
                />
                <datalist id="BandingOpt">
                  <option value="Band 1" />
                  <option value="Band 2" />
                  <option value="Band 4" />
                  <option value="Band 5" />
                  <option value="Band 6" />
                  <option value="Band 7" />
                  <option value="Band 8" />
                  <option value="Band 9" />
                  <option value="Band 10" />
                  <option value="Band 11" />
                  <option value="Band 12" />
                  <option value="Band 13" />
                </datalist>
              </>
            ) : (
              <input
                type={
                  key.includes("Days") ||
                  key.includes("Hours") ||
                  key.includes("Rate") ||
                  key.includes("Salary") ||
                  key === "deductions"
                    ? "number"
                    : "text"
                }
                name={key}
                value={PayRollData[key]}
                onChange={handleChange}
                required={key !== "deductions"}
                step="any"
                min={key === "deductions" ? 0 : undefined}
              />
            )}
          </label>
        ))}

        <button type="submit" className={ProfileCss.submitBtn}>
          Submit
        </button>
        <button
          type="button"
          onClick={UpdateFunction}
          className={ProfileCss.submitBtn}
          disabled={!editId}
          title={!editId ? "Select a record to update" : ""}
        >
          Update
        </button>
      </form>

      <h3>Payroll Records List</h3>
      <div className={ProfileCss.tableContainer}>
        <table className={ProfileCss.table}>
          <thead>
            <tr>
              {Object.keys(PayRollForm).map((key) => (
                <th key={key}>
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedData.map((payroll) => (
              <tr key={payroll.id}>
                {Object.keys(PayRollForm).map((key) => (
                  <td key={key}>{payroll[key]}</td>
                ))}
                <td>
                  <button
                    onClick={() => editFunction(payroll.id)}
                    className={ProfileCss.editPayroll}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteFunction(payroll.id)}
                    className={ProfileCss.deletePayroll}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {displayedData.length === 0 && (
              <tr>
                <td colSpan={Object.keys(PayRollForm).length + 1}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button onClick={downloadPDF} className={ProfileCss.submitBtn}>
          Download PDF
        </button>
      </div>

      {totalPages > 1 && (
        <div className={ProfileCss.pagination}>
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

export default Payroll;
