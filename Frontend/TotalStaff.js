import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileCss from "../css/staff.module.css";

const TotalStaff = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/department-count")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Failed to fetch department counts", err));
  }, []);

  return (
    <div className={ProfileCss.MainAttendance}>
      <h2>Staff Count by Department</h2>

      <table className={ProfileCss.AttendanceTable}>
        <thead>
          <tr>
            <th>No.</th>
            <th>Department</th>
            <th>Total Staff</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((item, index) => (
            <tr key={item.department}>
              <td>{index + 1}</td>
              <td>{item.department}</td>
              <td>{item.total_staff}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TotalStaff;
