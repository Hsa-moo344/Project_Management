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
    "S-001": {
      fullName: "Mg Mg",
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

  // ✅ Filter staff by name or staffCode
  const filteredStaff = staffData.filter(
    (item) =>
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.staffCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Slice filtered data for pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstRow, indexOfLastRow);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "staffCode") {
      const staff = staffDirectory[value];
      if (staff) {
        setFormData({
          staffCode: value,
          fullName: staff.fullName,
          gender: "",
          position: staff.position,
          department: staff.department,
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          fullName: "",
          position: "",
          department: "",
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
          gender: "",
          position: data.position,
          department: data.department,
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          staffCode: "",
          position: "",
          department: "",
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
          Remark:
          <select name="remark" value={formData.remark} onChange={handleChange}>
            <option value="">Select Remark</option>
            <option>Resign</option>
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
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "250px" }}
      />

      <table className={ProfileCss.StaffTable}>
        <thead>
          <tr>
            <th>No.</th>
            <th>Staff Code</th>
            <th>Full Name</th>
            <th>Gender</th>
            <th>Position</th>
            <th>Department</th>
            <th>Remark</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStaff.map((item, index) => (
            <tr key={item.id}>
              <td>{indexOfFirstRow + index + 1}</td>
              <td>{item.staffCode}</td>
              <td>{item.fullName}</td>
              <td>{item.gender}</td>
              <td>{item.position}</td>
              <td>{item.department}</td>
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
          ))}
        </tbody>
      </table>

      <div>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>Page {currentPage}</span>

        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(staffData.length / rowsPerPage) ? prev + 1 : prev
            )
          }
          disabled={currentPage >= Math.ceil(staffData.length / rowsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AddStaff;
