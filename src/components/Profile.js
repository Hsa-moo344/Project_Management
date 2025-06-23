import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileCss from "../css/staff.module.css";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [searchText, setSearchText] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [staffList, setStaffList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/staffdatabasefunction")
      .then((res) => setStaffList(res.data))
      .catch((err) => console.error("Error fetching staff:", err));
  }, []);

  const filteredStaff = staffList.filter((staff) => {
    const nameMatch = staff.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const tagMatch = Array.isArray(staff.tags)
      ? staff.tags.some((tag) =>
          tag.toLowerCase().includes(searchText.toLowerCase())
        )
      : false;
    const deptMatch =
      selectedDept === "All" || staff.department === selectedDept;
    return (nameMatch || tagMatch) && deptMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("username");
    if (isLoggedIn !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className={ProfileCss.profileMain}>
      <h2>Search Staff</h2>
      <p>Please search the staff profile here.</p>
      <button
        className={ProfileCss.ProfileDetailBtn}
        onClick={() => navigate("/profiledetail")}
      >
        Staff Profile Detail
      </button>

      {/* Search and Filter */}
      <div className={ProfileCss.inputContainer}>
        <div className={ProfileCss.inputWrapper}>
          <Search className={ProfileCss.searchIcon} size={18} />
          <input
            type="text"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1); // Reset to page 1 on search
            }}
            className={ProfileCss.searchInput}
          />
        </div>
        <select
          value={selectedDept}
          onChange={(e) => {
            setSelectedDept(e.target.value);
            setCurrentPage(1); // Reset to page 1 on filter
          }}
          className={ProfileCss.dropdown}
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
      </div>

      {/* Staff Cards Grid */}
      {currentItems.length > 0 ? (
        <div className={ProfileCss.staffGrid}>
          {currentItems.map((staff) => {
            const imageUrl = `http://localhost:8000${staff.image}`;
            return (
              <div key={staff.id} className={ProfileCss.staffCard}>
                <img
                  src={imageUrl}
                  alt={staff.image}
                  className={ProfileCss.profileImage}
                />
                <h3>{staff.name}</h3>
                <p>
                  <strong>Position:</strong> {staff.position}
                </p>
                <p>
                  <strong>Department:</strong> {staff.departments}
                </p>
                <div className={ProfileCss.tags}>
                  {Array.isArray(staff.tags) &&
                    staff.tags.map((tag, idx) => (
                      <strong key={idx} className={ProfileCss.tag}>
                        {tag}
                      </strong>
                    ))}
                </div>
                <p>
                  <strong>Staff Code:</strong> {staff.staffCode}
                </p>
                <p>
                  <strong>Joining Date:</strong>{" "}
                  {new Date(staff.joinDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No staff found.</p>
      )}

      {/* Pagination */}
      {filteredStaff.length > itemsPerPage && (
        <div className={ProfileCss.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
