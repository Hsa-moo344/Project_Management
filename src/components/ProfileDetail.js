import React, { useState, useEffect } from "react";
import ProfileCss from "../css/staff.module.css";
import MaeTao from "../image/maeteoclinic.webp";

function ProfileDetail() {
  const [formProfile, setFormProfile] = useState({
    name: "",
    dateofbirth: "",
    gender: "",
    ethnicity: "",
    religion: "",
    placeofbirth: "",
    country: "",
    township: "",
    village: "",
    currentaddress: "",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const educationLevels = [
    "Primary School",
    "Middle School",
    "High School",
    "Post-Ten",
    "Diploma (College)",
    "Bachelor (University)",
    "Master",
    "PhD",
    "Others",
  ];

  const [educationData, setEducationData] = useState(
    educationLevels.map((level) => ({
      level,
      institution: "",
      major: "",
      place: "",
      period: "",
      certificate: "",
    }))
  );

  const handleEducationChange = (index, field, value) => {
    const updatedData = [...educationData];
    updatedData[index][field] = value;
    setEducationData(updatedData);
  };

  const [staff, setStaff] = useState({
    name: "John Doe",
    department: "IT",
    position: "Developer",
    image: "john.jpg", // or a full URL if available
  });

  const imageUrl = staff.image
    ? `http://localhost:5000/uploads/${staff.image}`
    : "http://localhost:5000/uploads/default.jpg";

  const [maritalData, setMaritalData] = useState([
    {
      married: "",
      single: "",
      divorced: "",
      widow: "",
      widower: "",
      other: "",
    },
  ]);

  // Marital Status
  const handleMaritalChange = (index, field, value) => {
    const updatedData = [...maritalData];
    updatedData[index][field] = value;
    setMaritalData(updatedData);
  };

  const dependents = Array.from({ length: 7 }, (_, index) => ({
    no: index + 1,
    name: "",
    gender: "",
    dob: "",
    relationship: "",
  }));

  return (
    <div className={ProfileCss.MainProfileDetail}>
      {/* const imageUrl = `http://localhost:8000${staff.image}`; */}
      <img src={MaeTao} alt="Clinic Logo" />
      <address className={ProfileCss.AddressMTC}>
        702 Moo 1, Tha Sai Luad, Mae Sot District, Tak Province 63110, Thailand
        — Tel: +66 (0) 613 19 8130 — Email:{" "}
        <a href="mailto:info@maetaoclinic.org">info@maetaoclinic.org</a> —
        Website:{" "}
        <a
          href="http://www.maetaoclinic.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.maetaoclinic.org
        </a>
      </address>
      <div className={ProfileCss.formProfileDetail}>
        <h3>MTC Staff Profile Form</h3>

        <img
          src={imageUrl}
          alt={staff.name}
          className="w-32 h-32 object-cover rounded-full mb-4"
        />
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formProfile.name}
            onChange={handleProfileChange}
            required
          />
        </label>
        <label>
          Date of Birth:
          <input
            type="date"
            name="dateofbirth"
            value={formProfile.dateofbirth}
            onChange={handleProfileChange}
            required
          />
        </label>
        <label>
          Gender:
          <select
            name="gender"
            value={formProfile.gender}
            onChange={handleProfileChange}
            required
          >
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          Ethnicity:
          <select
            name="ethnicity"
            value={formProfile.ethnicity}
            onChange={handleProfileChange}
            required
          >
            <option value="">Ethnicity</option>
            <option value="1">Karen</option>
            <option value="2">Burmese</option>
            <option value="3">Kachin</option>
            <option value="4">Chin</option>
            <option value="5">Mon</option>
            <option value="6">Pa Long</option>
            <option value="7">Shan</option>
            <option value="8">Rakhain</option>
            <option value="9">Karenni</option>
            <option value="10">Pa O</option>
          </select>
        </label>
        <label>
          Regligion:
          <select
            name="regligion"
            value={formProfile.regligion}
            onChange={handleProfileChange}
            required
          >
            <option value="">Regligion</option>
            <option value="1">Buddisht</option>
            <option value="2">Christian</option>
            <option value="3">Muslim</option>
            <option value="4">Other</option>
          </select>
        </label>
        <label>
          Place of Birth:
          <input
            type="text"
            name="placeobirth"
            value={formProfile.placeofbirth}
            onChange={handleProfileChange}
            required
          />
        </label>
        <label>
          Coutnry:
          <select
            name="coutnry"
            value={formProfile.country}
            onChange={handleProfileChange}
            required
          >
            <option value="">Country</option>
            <option>Thailand</option>
            <option>Myanmar</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          Township:
          <input
            type="township"
            name="township"
            value={formProfile.township}
            onChange={handleProfileChange}
          />
        </label>
        <label>
          Village:
          <input
            type="village"
            name="village"
            value={formProfile.village}
            onChange={handleProfileChange}
          />
        </label>
        <label>
          Current Address:
          <input
            type="currentaddress"
            name="currentaddress"
            value={formProfile.currentaddress}
            onChange={handleProfileChange}
          />
        </label>
      </div>
      {/* Qualification/Education */}
      <div className={ProfileCss.TblEducation}>
        <h3>Educational Background</h3>
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Education Level</th>
              <th>Institution</th>
              <th>Major</th>
              <th>Place</th>
              <th>Period</th>
              <th>Certificate/Diploma Y/N</th>
            </tr>
          </thead>
          <tbody>
            {educationData.map((edu, index) => (
              <tr key={index}>
                <td>{edu.level}</td>
                <td>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        "institution",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={edu.major}
                    onChange={(e) =>
                      handleEducationChange(index, "major", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={edu.place}
                    onChange={(e) =>
                      handleEducationChange(index, "place", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={edu.period}
                    onChange={(e) =>
                      handleEducationChange(index, "period", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={edu.certificate}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        "certificate",
                        e.target.value
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Marital Status */}
      <div className={ProfileCss.maritalProfile}>
        <h3>Marital Status</h3>
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Married</th>
              <th>Single</th>
              <th>Divorced</th>
              <th>Widow</th>
              <th>Widower</th>
              <th>Other</th>
            </tr>
          </thead>
          <tbody>
            {maritalData.map((marital, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={marital.married}
                    onChange={(e) =>
                      handleMaritalChange(index, "married", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={marital.single}
                    onChange={(e) =>
                      handleMaritalChange(index, "single", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={marital.divorced}
                    onChange={(e) =>
                      handleMaritalChange(index, "divorced", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={marital.widow}
                    onChange={(e) =>
                      handleMaritalChange(index, "widow", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={marital.widower}
                    onChange={(e) =>
                      handleMaritalChange(index, "widower", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={marital.other}
                    onChange={(e) =>
                      handleMaritalChange(index, "other", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProfileDetail;
