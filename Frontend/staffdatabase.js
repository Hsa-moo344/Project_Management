import React, { useState, useEffect } from "react";
import ProfileCss from "../css/staff.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StaffDatabase() {
  const [formStaffData, setStaffFormData] = useState({
    name: "",
    gender: "",
    position: "",
    image: "", // stores image path string (for preview)
    departments: "",
    joinDate: "",
    staffCode: "",
    tags: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch all staff on mount
  const fetchStaff = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/staffdatabasefunction"
      );
      setStaffList(res.data);
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Cleanup image preview URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Form input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image input change handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle submit for create or update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const tagsArray = formStaffData.tags
      ? formStaffData.tags.split(",").map((tag) => tag.trim())
      : [];

    // Append all form data except image (append imageFile separately)
    for (const key in formStaffData) {
      if (key === "tags") {
        formData.append("tags", JSON.stringify(tagsArray));
      } else if (key !== "image") {
        formData.append(key, formStaffData[key]);
      }
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editingId) {
        // Update existing staff
        await axios.put(
          `http://localhost:8000/staffdatabasefunction/${editingId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Updated successfully!");
      } else {
        // Create new staff
        await axios.post(
          "http://localhost:8000/staffdatabasefunction",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Submitted successfully!");
      }

      // Reset form & state
      setStaffFormData({
        name: "",
        gender: "",
        position: "",
        image: "",
        departments: "",
        joinDate: "",
        staffCode: "",
        tags: "",
      });
      setImageFile(null);
      setImagePreview(null);
      setEditingId(null);
      fetchStaff();
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to submit");
    }
  };

  // Populate form for editing staff
  const handleEdit = (staff) => {
    setEditingId(staff.id);
    setStaffFormData({
      name: staff.name,
      gender: staff.gender,
      position: staff.position,
      image: staff.image, // image path string from backend
      departments: staff.departments,
      joinDate: staff.joinDate ? staff.joinDate.split("T")[0] : "",
      staffCode: staff.staffCode,
      tags: Array.isArray(staff.tags) ? staff.tags.join(", ") : staff.tags,
    });

    // Show existing image in preview
    if (staff.image) {
      setImagePreview(`http://localhost:8000${staff.image}`);
    } else {
      setImagePreview(null);
    }
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel editing, reset form
  const handleCancel = () => {
    setEditingId(null);
    setStaffFormData({
      name: "",
      gender: "",
      position: "",
      image: "",
      departments: "",
      joinDate: "",
      staffCode: "",
      tags: "",
    });
    setImageFile(null);
    setImagePreview(null);
  };

  // Delete staff by id
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        await axios.delete(`http://localhost:8000/staffdatabasefunction/${id}`);
        fetchStaff();
      } catch (err) {
        console.error("Error deleting:", err);
      }
    }
  };

  // Filtered list based on search term (name or department)
  const filteredStaff = staffList.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.departments &&
        staff.departments.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={ProfileCss.MainAttendance}>
      <h2>Mae Tao Clinic Staff Data Entry Form</h2>
      <form className={ProfileCss.profileMain} onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formStaffData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Gender:
          <select
            name="gender"
            value={formStaffData.gender}
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
            value={formStaffData.position}
            onChange={handleChange}
            required
          >
            <option value="">Position</option>
            <option>Director</option>
            <option>Assistant Director</option>
            <option>Deputy Director</option>
            <option>Assistant Deputy Director</option>
            <option>Manager</option>
            <option>Supervisor</option>
            <option>Coordinator</option>
            <option>In Charge</option>
            <option>Doctor</option>
            <option>Software Developer</option>
            <option>Medic Staff</option>
            <option>Accountant</option>
            <option>Staff</option>
          </select>
        </label>

        <label>
          Upload Image:
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>

        {imagePreview && (
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <p style={{ fontSize: "0.9rem", color: "#666" }}>Image Preview</p>
          </div>
        )}

        <label>
          Department:
          <select
            name="departments"
            value={formStaffData.departments}
            onChange={handleChange}
            required
          >
            <option>Departments</option>
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
          Joining Date:
          <input
            type="date"
            name="joinDate"
            value={formStaffData.joinDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Staff Code:
          <input
            type="text"
            name="staffCode"
            value={formStaffData.staffCode}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Tags (comma separated):
          <input
            type="text"
            name="tags"
            value={formStaffData.tags}
            onChange={handleChange}
          />
        </label>

        <div className={ProfileCss.ButtonGroup}>
          <button type="submit" className={ProfileCss.ActionButton}>
            {editingId ? "Update Staff" : "Submit"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className={ProfileCss.CancelButton}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr />

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Search by name or department"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px", padding: "5px" }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {filteredStaff.length === 0 && <p>No staff found.</p>}
        {filteredStaff.map((staff) => (
          <div
            key={staff.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "8px",
              width: "250px",
              boxShadow: "0 0 5px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <img
                src={
                  staff.image
                    ? `http://localhost:8000${staff.image}`
                    : "/default-profile.png"
                }
                alt={staff.name}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </div>
            <h3 style={{ margin: "10px 0 5px" }}>{staff.name}</h3>
            <p>Gender: {staff.gender}</p>
            <p>Position: {staff.position}</p>
            <p>Department: {staff.departments}</p>
            <p>Join Date: {staff.joinDate?.split("T")[0]}</p>
            <p>Staff Code: {staff.staffCode}</p>
            <p>
              Tags:{" "}
              {Array.isArray(staff.tags) ? staff.tags.join(", ") : staff.tags}
            </p>

            <button onClick={() => handleEdit(staff)} style={{ color: "blue" }}>
              Edit
            </button>
            <button
              onClick={() => handleDelete(staff.id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StaffDatabase;
