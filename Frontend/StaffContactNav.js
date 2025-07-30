import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileCss from "../css/staff.module.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const StaffContactForm = {
  staffCode: "",
  fullName: "",
  phoneNumber: "",
};

function StaffContactNav() {
  const [formData, setFormData] = useState(StaffContactForm);
  const [staffData, setStaffData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchData = () => {
    axios
      .get("http://localhost:8000/api/staffcontactfunction")
      .then((res) => setStaffData(res.data))
      .catch((err) =>
        console.error("Failed to fetch staff contact data:", err)
      );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8000/api/staffcontactfunction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Data submitted successfully!");
        setFormData(StaffContactForm);
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
    const contact = staffData.find((item) => item.id === id);
    if (contact) {
      setFormData({ ...contact });
      setEditId(id);
    }
  };

  const updateFunction = () => {
    if (!editId) return alert("No item selected for update");

    axios
      .put(`http://localhost:8000/api/staffcontactfunction/${editId}`, formData)
      .then(() => {
        alert("Updated successfully");
        fetchData();
        setFormData(StaffContactForm);
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
        .delete(`http://localhost:8000/api/staffcontactfunction/${id}`)
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

  const filteredData = staffData.filter(
    (item) =>
      item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.staffCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const displayedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(18);
    doc.text("Mae Tao Clinic - Staff Contact Report", 14, 15);

    const tableColumn = ["Number", "Staff Code", "Full Name", "Phone Number"];
    const tableRows = filteredData.map((row, index) => [
      index + 1,
      row.staffCode,
      row.fullName,
      row.phoneNumber,
    ]);

    autoTable(doc, {
      startY: 25,
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("staff_contact_report.pdf");
  };

  return (
    <div className={ProfileCss.MainAttendance}>
      <h2>Mae Tao Clinic - Staff Contact</h2>

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

      <h3>Staff Contact List</h3>
      <div className={ProfileCss.tableContainer}>
        <table className={ProfileCss.table}>
          <thead>
            <tr>
              <th>Staff Code</th>
              <th>Full Name</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {displayedData.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.staffCode}</td>
                <td>{contact.fullName}</td>
                <td>{contact.phoneNumber}</td>
              </tr>
            ))}
            {displayedData.length === 0 && (
              <tr>
                <td colSpan={4}>No records found.</td>
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

export default StaffContactNav;
