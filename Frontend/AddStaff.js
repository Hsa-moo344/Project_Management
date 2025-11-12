import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileCss from "../css/staff.module.css";

const initialStaffForm = {
  staffCode: "",
  fullName: "",
  gender: "",
  position: "",
  department: "",
};

function AddStaff() {
  const staffDirectory = {
    "S-0001": {
      fullName: "Dr. Cynthia Kha",
      department: "Organisational Development",
      position: "Director",
    },
  };

  const [formData, setFormData] = useState(initialStaffForm);
  const [staffData, setStaffData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 5;

  /// Filter staff by name or staffCode
  const filteredStaff = staffData.filter(
    (item) =>
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.staffCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Slice filtered data for pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  const totalPages = Math.ceil(filteredStaff.length / rowsPerPage);
  const handlePageChange = (page) => setCurrentPage(page);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "staffCode") {
      const staff = staffDirectory[value];
      if (staff) {
        setFormData({
          staffCode: value,
          fullName: staff.fullName,
          banding: staff.banding,
          gender: "",
          position: staff.position,
          department: staff.department,
          startDate: staff.startDate,
          endDate: staff.endDate,
          remark: staff.remark,
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          fullName: "",
          banding: "",
          position: "",
          department: "",
          startDate: "",
          endDate: "",
          remark: "",
        }));
      }
    } else if (name === "fullName") {
      const entry = Object.entries(staffDirectory).find(
        ([code, data]) => data.fullName === value
      );
      if (entry) {
        const [code, data] = entry;
        setFormData({
          staffCode: code,
          fullName: value,
          banding: data.banding,
          gender: "",
          position: data.position,
          department: data.department,
          startDate: data.startDate,
          endDate: data.endDate,
          remark: data.remark,
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          staffCode: "",
          position: "",
          department: "",
          startDate: "",
          endDate: "",
          remark: "",
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchData = () => {
    axios
      .get("http://localhost:8000/staffdepartment")
      .then((res) => setStaffData(res.data))
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId !== null) {
      handleUpdate();
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/staffdepartment",
        formData
      );
      if (res.status === 200 || res.status === 201) {
        alert("Staff added successfully!");
        setFormData(initialStaffForm);
        fetchData();
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit");
    }
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:8000/staffdepartment/${editId}`, formData)
      .then(() => {
        alert("Staff updated successfully");
        setFormData(initialStaffForm);
        setEditId(null);
        fetchData();
      })
      .catch((err) => {
        console.error("Update error:", err);
        alert("Update failed");
      });
  };

  const handleEdit = (id) => {
    const staff = staffData.find((s) => s.id === id);
    if (staff) {
      setFormData({
        staffCode: staff.staffCode || "",
        fullName: staff.fullName || "",
        gender: staff.gender || "",
        position: staff.position || "",
        department: staff.department || "",
        startDate: staff.startDate || "",
        endDate: staff.endDate || "",
        remark: staff.remark || "",
      });
      setEditId(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      axios
        .delete(`http://localhost:8000/staffdepartment/${id}`)
        .then(() => {
          alert("Deleted successfully");
          fetchData();
        })
        .catch((err) => {
          console.error("Delete error:", err);
          alert("Failed to delete");
        });
    }
  };

  return (
    <div className={ProfileCss.StaffMainTbl}>
      <h1 className={ProfileCss.Heading}>💹 Add Staff Page Form</h1>

      <form onSubmit={handleSubmit} className={ProfileCss.FormContainer}>
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
          Full Name:
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Banding:
          <input
            type="text"
            name="banding"
            value={formData.banding}
            onChange={handleChange}
            list="BandingOpt" // <-- must connect input to datalist
            required
          />
          <datalist id="BandingOpt">
            <option value="Band 1" />
            <option value="Band 2" />
            <option value="Band 3" />
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
        </label>

        <label>
          Gender:
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Position:
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            readOnly={!!staffDirectory[formData.staffCode]}
          />
        </label>

        <label>
          Department:
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            readOnly={!!staffDirectory[formData.staffCode]}
          />
        </label>

        <label>
          Staff Start Contract Date:
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Staff Contract End Date:
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />
        </label>

        <label>
          Remark:
          <select name="remark" value={formData.remark} onChange={handleChange}>
            <option value="">Select Remark</option>
            <option>Resign</option>
            <option>Change department</option>
            <option>Promotion</option>
            <option>Part Time</option>
            <option>Volunteer</option>
          </select>
        </label>

        <button type="submit" className={ProfileCss.submitBtn}>
          {editId ? "Update" : "Submit"}
        </button>
      </form>

      <input
        type="text"
        placeholder="Search by name or staff code"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1); // reset to page 1 when searching
        }}
        style={{ marginBottom: "10px", padding: "5px", width: "250px" }}
      />

      <table className={ProfileCss.StaffTable}>
        <thead>
          <tr>
            <th>No.</th>
            <th>Staff Code</th>
            <th>Full Name</th>
            <th>Banding</th>
            <th>Gender</th>
            <th>Position</th>
            <th>Department</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Remark</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStaff.length > 0 ? (
            currentStaff.map((item, index) => (
              <tr key={item.id}>
                <td>{indexOfFirstRow + index + 1}</td>
                <td>{item.staffCode}</td>
                <td>{item.fullName}</td>
                <td>{item.banding}</td>
                <td>{item.gender}</td>
                <td>{item.position}</td>
                <td>{item.department}</td>
                <td>{item.start_date}</td>
                <td>{item.end_date}</td>
                <td>{item.remark}</td>
                <td>
                  <button
                    onClick={() => handleEdit(item.id)}
                    className={ProfileCss.EditBtn}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className={ProfileCss.DeletetBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No staff found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 📑 Pagination */}
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AddStaff;


