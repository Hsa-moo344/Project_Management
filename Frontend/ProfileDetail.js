import React, { useState } from "react";
import axios from "axios";
import ProfileCss from "../css/staff.module.css";
import MaeTao from "../image/maeteoclinic.webp";

function ProfileDetail() {
  const [photo, setPhoto] = useState(null);
  const [maritalStatus, setMaritalStatus] = useState("");
  const [staffCode, setStaffCode] = useState("");

  // Staff profile
  const [formProfile, setFormProfile] = useState({
    name: "",
    staffCode: "",
    dateofbirth: "",
    gender: "",
    ethnicity: "",
    religion: "",
    placeofbirth: "",
    country: "",
    township: "",
    village: "",
    currentaddress: "",
    classification_id: "",
    classification_number: "",
    father_name: "",
    father_ethnicity: "",
    father_religion: "",
    mother_name: "",
    mother_ethnicity: "",
    mother_religion: "",
    applyed_department_and_job: "",
    applyed_date: "",
    employment_date: "",
  });

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
      education_level: level,
      institution: "",
      major: "",
      place: "",
      period: "",
      certificate: "",
    }))
  );

  const maritalOptions = [
    "Married",
    "Single",
    "Divorced",
    "Widow",
    "Widower",
    "Other",
  ];

  const [maritalRecords, setMaritalRecords] = useState([
    { spouse_name: "", spouse_gender: "", date_of_birth: "", relationship: "" },
  ]);

  const [workExperience, setWorkExperience] = useState([
    {
      main_responsibility: "",
      from_year: "",
      to_year: "",
      organization: "",
      place: "",
    },
  ]);

  const [trainingSection, setTrainingSection] = useState([
    { training_title: "", training_period: "", place: "", organizer: "" },
  ]);

  const [skills, setSkills] = useState({
    English: { Writing: "", Reading: "", Speaking: "" },
    Myanmar: { Writing: "", Reading: "", Speaking: "" },
    Thai: { Writing: "", Reading: "", Speaking: "" },
    Native_Other_Language: { Writing: "", Reading: "", Speaking: "" },
    Other: { Writing: "", Reading: "", Speaking: "" },
  });

  const handleLanguageChange = (language, skill, level) => {
    setSkills((prev) => ({
      ...prev,
      [language]: { ...prev[language], [skill]: level },
    }));
  };
  const levels = ["Fluent", "Intermediate", "Basic"];

  const [computerSkillSection, setComputerSkillSection] = useState([
    {
      microsoft_word: "",
      microsoft_excel: "",
      powerpoint: "",
      email: "",
      internet: "",
      basic_maintenance: "",
      photoshop: "",
      access_database: "",
    },
  ]);

  const Computer_levels = ["Advance", "Good", "Fair", "Poor"];
  const [selectedLevels, setSelectedLevels] = useState({});

  const handleComputerChange = (skill, level) => {
    setSelectedLevels((prev) => ({
      ...prev,
      [skill]: level,
    }));
  };

  // ===== Photo Upload =====
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  // ===== Input Handlers =====
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...educationData];
    updated[index][field] = value;
    setEducationData(updated);
  };

  const handleDependentChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...maritalRecords];
    updated[index][name] = value;
    setMaritalRecords(updated);
  };

  const addDependent = () => {
    setMaritalRecords([
      ...maritalRecords,
      {
        spouse_name: "",
        spouse_gender: "",
        date_of_birth: "",
        relationship: "",
      },
    ]);
  };

  // ===== Work Experience =====
  const handleWorkExperienceChange = (index, field, value) => {
    const updated = [...workExperience];
    updated[index][field] = value;
    setWorkExperience(updated);
  };

  const addWorkExperience = () => {
    setWorkExperience([
      ...workExperience,
      {
        main_responsibility: "",
        from_year: "",
        to_year: "",
        organization: "",
        place: "",
      },
    ]);
  };

  const removeWorkExperience = (index) => {
    const updated = [...workExperience];
    updated.splice(index, 1);
    setWorkExperience(updated);
  };

  // ===== Training Period =====
  const handleTrainingPeriodChange = (index, field, value) => {
    const updated = [...trainingSection];
    updated[index][field] = value;
    setTrainingSection(updated);
  };

  const addTrainingPeriod = () => {
    setTrainingSection([
      ...trainingSection,
      { training_title: "", training_period: "", place: "", organizer: "" },
    ]);
  };

  const removeTrainingPeriod = (index) => {
    const updated = [...trainingSection];
    updated.splice(index, 1);
    setTrainingSection(updated);
  };

  // ===== Computer Skill =====
  const handleComputerSkillChange = (index, field, value) => {
    const updated = [...computerSkillSection];
    updated[index][field] = value;
    setComputerSkillSection(updated);
  };

  const addComputerSkill = () => {
    setComputerSkillSection([
      ...computerSkillSection,
      {
        microsoft_word: "",
        microsoft_excel: "",
        email: "",
        internet: "",
        basic_maintenance: "",
        photoshop: "",
        access_database: "",
      },
    ]);
  };

  const removeComputerSkill = (index) => {
    const updated = [...computerSkillSection];
    updated.splice(index, 1);
    setComputerSkillSection(updated);
  };

  // Apperoval section
  const [formApprovalData, setFormApprovalData] = useState({
    applier_name: "",
    applier_phone: "",
    approved_name: "",
    approved_position: "",
    approved_org: "",
    approved_phone: "",
    receiver_name: "",
    receiver_position: "",
    receiver_org: "",
    receiver_phone: "",
  });

  const handleApprovalChange = (e) => {
    setFormApprovalData({
      ...formApprovalData,
      [e.target.name]: e.target.value,
    });
  };

  // ===== Submit Form =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const profileRes = await axios.post(
        "http://localhost:8000/api/hrprofile",
        formProfile
      );
      const profile_id = profileRes.data.insertId;

      for (const edu of educationData) {
        await axios.post("http://localhost:8000/api/educationprofile", {
          profile_id,
          staffCode: formProfile.staffCode,
          ...edu,
        });
      }

      if (maritalStatus === "Married") {
        await axios.post("http://localhost:8000/api/maritalStatus", {
          staffCode: formProfile.staffCode,
          maritalRecords,
        });
      }

      await axios.post("http://localhost:8000/api/workExperience", {
        staffCode: formProfile.staffCode,
        workExperience: workExperience.map((w) => ({
          main_responsibility: w.main_responsibility || "",
          from_year: w.from_year || "",
          to_year: w.to_year || "",
          organization: w.organization || "",
          place: w.place || "",
        })),
      });

      await axios.post("http://localhost:8000/api/trainingPeriodSection", {
        staffCode: formProfile.staffCode,
        trainingSection,
      });

      await axios.post("http://localhost:8000/api/languageSkill", {
        staffCode: formProfile.staffCode,
        skills,
      });

      await axios.post("http://localhost:8000/api/computerSkill", {
        staffCode: formProfile.staffCode,
        computerSkillSection: selectedLevels,
      });

      await axios.post("http://localhost:8000/api/approvalSection", {
        staffCode: formProfile.staffCode,
        ...formApprovalData,
      });

      alert("All information saved successfully!");
      // Reset all
      setFormProfile({
        name: "",
        staffCode: "",
        dateofbirth: "",
        gender: "",
        ethnicity: "",
        religion: "",
        placeofbirth: "",
        country: "",
        township: "",
        village: "",
        currentaddress: "",
        classification_id: "",
        classification_number: "",
        father_name: "",
        father_ethnicity: "",
        father_religion: "",
        mother_name: "",
        mother_ethnicity: "",
        mother_religion: "",
        applyed_department_and_job: "",
        applyed_date: "",
        employment_date: "",
      });
      setEducationData(
        educationLevels.map((level) => ({
          education_level: level,
          institution: "",
          major: "",
          place: "",
          period: "",
          certificate: "",
        }))
      );
      setMaritalStatus("");
      setMaritalRecords([
        {
          spouse_name: "",
          spouse_gender: "",
          date_of_birth: "",
          relationship: "",
        },
      ]);
      setWorkExperience([
        {
          main_responsibility: "",
          from_year: "",
          to_year: "",
          organization: "",
          place: "",
        },
      ]);
      setTrainingSection([
        { training_title: "", training_period: "", place: "", organizer: "" },
      ]);
    } catch (err) {
      console.error("Error saving data:", err);
      alert("❌ Failed to save data. Check backend connection!");
    }
  };

  return (
    <div className={ProfileCss.MainProfileDetail}>
      {/* ===== Header ===== */}
      <img src={MaeTao} alt="Clinic Logo" className={ProfileCss.LogoMTC} />
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

      {/* ===== Form ===== */}
      <div className={ProfileCss.formProfileDetail}>
        <h3>MTC Staff Profile Form</h3>

        {/* Profile photo */}
        <div className={ProfileCss.profileHeader}>
          <div className={ProfileCss.profilePhotoSection}>
            <img
              src={photo || "https://via.placeholder.com/150"}
              alt="Staff Profile"
              className={ProfileCss.profilePhoto}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className={ProfileCss.photoInput}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className={ProfileCss.formContainer}>
          {/* ===== Personal Info ===== */}
          <h4>🧍‍♂️ Personal Information</h4>
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
            Staff Code:
            <input
              type="text"
              name="staffCode"
              value={formProfile.staffCode}
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
              <option value="">Select Gender</option>
              {["Male", "Female", "Other"].map((v) => (
                <option key={v}>{v}</option>
              ))}
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
              <option value="">Select Ethnicity</option>
              {[
                "Karen",
                "Burmese",
                "Kachin",
                "Chin",
                "Mon",
                "Pa Long",
                "Shan",
                "Rakhain",
                "Karenni",
                "Pa O",
              ].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>

          <label>
            Religion:
            <select
              name="religion"
              value={formProfile.religion}
              onChange={handleProfileChange}
              required
            >
              <option value="">Select Religion</option>
              {["Buddhist", "Christian", "Muslim", "Other"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label>
            Place of Birth:
            <input
              type="text"
              name="placeofbirth"
              value={formProfile.placeofbirth}
              onChange={handleProfileChange}
            />
          </label>

          <label>
            Country:
            <select
              name="country"
              value={formProfile.country}
              onChange={handleProfileChange}
              required
            >
              <option value="">Select Country</option>
              {["Thailand", "Myanmar", "Other"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>

          <label>
            Township:
            <input
              type="text"
              name="township"
              value={formProfile.township}
              onChange={handleProfileChange}
            />
          </label>

          <label>
            Village:
            <input
              type="text"
              name="village"
              value={formProfile.village}
              onChange={handleProfileChange}
            />
          </label>

          <label>
            Current Address:
            <input
              type="text"
              name="currentaddress"
              value={formProfile.currentaddress}
              onChange={handleProfileChange}
            />
          </label>

          {/* ===== New Fields ===== */}
          <label>
            Classification ID:
            <input
              type="text"
              name="classification_id"
              value={formProfile.classification_id}
              onChange={handleProfileChange}
            />
          </label>

          <label>
            Classification Number:
            <input
              type="number"
              name="classification_number"
              value={formProfile.classification_number}
              onChange={handleProfileChange}
            />
          </label>

          <label>
            Father Name:
            <input
              type="text"
              name="father_name" // ← corrected from "Father Name"
              value={formProfile.father_name}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            Father Ethnicity:
            <select
              name="father_ethnicity"
              value={formProfile.father_ethnicity}
              onChange={handleProfileChange}
            >
              <option value="">Select Father Ethnicity</option>
              {[
                "Karen",
                "Burmese",
                "Kachin",
                "Chin",
                "Mon",
                "Pa Long",
                "Shan",
                "Rakhain",
                "Karenni",
                "Pa O",
              ].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>

          <label>
            Father Religion:
            <select
              name="father_religion"
              value={formProfile.father_religion}
              onChange={handleProfileChange}
            >
              <option value="">Select Father Religion</option>
              {["Buddhist", "Christian", "Muslim", "Other"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>

          <label>
            Mother Name:
            <input
              type="text"
              name="mother_name"
              value={formProfile.mother_name}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            Mother Ethnicity:
            <select
              name="mother_ethnicity"
              value={formProfile.mother_ethnicity}
              onChange={handleProfileChange}
            >
              <option value="">Select Mother Ethnicity</option>
              {[
                "Karen",
                "Burmese",
                "Kachin",
                "Chin",
                "Mon",
                "Pa Long",
                "Shan",
                "Rakhain",
                "Karenni",
                "Pa O",
              ].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>

          <label>
            Mother Religion:
            <select
              name="mother_religion"
              value={formProfile.mother_religion}
              onChange={handleProfileChange}
            >
              <option value="">Select Mother Religion</option>
              {["Buddhist", "Christian", "Muslim", "Other"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          {/* Apply for the department and job, date and employment date */}

          <label>
            Post Applied department and job:
            <input
              type="text"
              name="applyed_department_and_job"
              value={formProfile.applyed_department_and_job}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            Application Date:
            <input
              type="date"
              name="applyed_date"
              value={formProfile.applyed_date}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            Employment Date:
            <input
              type="date"
              name="employment_date"
              value={formProfile.employment_date}
              onChange={handleProfileChange}
            />
          </label>

          {/* ===== Education ===== */}
          <h4>🎓 Education Background</h4>
          {educationData.map((edu, index) => (
            <div key={index} className={ProfileCss.educationRow}>
              <strong>{edu.education_level}</strong>
              <label>
                Education Level:
                <select
                  value={edu.education_level}
                  onChange={(e) =>
                    handleEducationChange(
                      index,
                      "education_level",
                      e.target.value
                    )
                  }
                >
                  <option value="">Choose Education Level</option>
                  {educationLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>

              <input
                type="text"
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) =>
                  handleEducationChange(index, "institution", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Major"
                value={edu.major}
                onChange={(e) =>
                  handleEducationChange(index, "major", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Place"
                value={edu.place}
                onChange={(e) =>
                  handleEducationChange(index, "place", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Period (e.g., 2010-2015)"
                value={edu.period}
                onChange={(e) =>
                  handleEducationChange(index, "period", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Certificate"
                value={edu.certificate}
                onChange={(e) =>
                  handleEducationChange(index, "certificate", e.target.value)
                }
              />
            </div>
          ))}

          {/* ===== Marital Status ===== */}
          <h4>💍 Marital Status</h4>
          <div className={ProfileCss.statusOptions}>
            {maritalOptions.map((status, idx) => (
              <div
                key={idx}
                className={`${ProfileCss.statusBox} ${
                  maritalStatus === status ? ProfileCss.activeStatus : ""
                }`}
                onClick={() => setMaritalStatus(status)}
              >
                {status}
              </div>
            ))}
          </div>

          {/* ===== Dependents ===== */}
          {(maritalStatus === "Married" ||
            maritalStatus === "Widow" ||
            maritalStatus === "Divorced" ||
            maritalStatus === "Widower") && (
            <div className={ProfileCss.dependentSection}>
              <h5>Dependents</h5>
              <table className={ProfileCss.dependentTable}>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Date of Birth</th>
                    <th>Relationship</th>
                  </tr>
                </thead>
                <tbody>
                  {maritalRecords.map((record, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <input
                          type="text"
                          name="spouse_name"
                          value={record.spouse_name}
                          onChange={(e) => handleDependentChange(index, e)}
                        />
                      </td>
                      <td>
                        <select
                          name="spouse_gender"
                          value={record.spouse_gender}
                          onChange={(e) => handleDependentChange(index, e)}
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="date"
                          name="date_of_birth"
                          value={record.date_of_birth}
                          onChange={(e) => handleDependentChange(index, e)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="relationship"
                          value={record.relationship}
                          onChange={(e) => handleDependentChange(index, e)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button type="button" onClick={addDependent}>
                Add Dependent
              </button>
            </div>
          )}

          {/* ===== Work Experience Section ===== */}
          <h4>💼 Work Experience</h4>
          <table className={ProfileCss.workTable}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Main Responsibility</th>
                <th>From Year</th>
                <th>To Year</th>
                <th>Organization</th>
                <th>Place</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {workExperience.map((work, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      type="text"
                      value={work.main_responsibility}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          index,
                          "main_responsibility",
                          e.target.value
                        )
                      }
                      placeholder="Enter responsibility"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={work.from_year}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          index,
                          "from_year",
                          e.target.value
                        )
                      }
                      placeholder="YYYY"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={work.to_year}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          index,
                          "to_year",
                          e.target.value
                        )
                      }
                      placeholder="YYYY"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={work.organization}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          index,
                          "organization",
                          e.target.value
                        )
                      }
                      placeholder="Organization"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={work.place}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          index,
                          "place",
                          e.target.value
                        )
                      }
                      placeholder="Place"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => removeWorkExperience(index)}
                      className={ProfileCss.removeBtn}
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="button"
            onClick={addWorkExperience}
            className={ProfileCss.addBtn}
          >
            ➕ Add Work Experience
          </button>

          {/* ===== Training Period Section ===== */}
          <h4>💼 Training Period</h4>
          <table className={ProfileCss.workTable}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Training Title</th>
                <th>Training Period</th>
                <th>Place</th>
                <th>Organizer</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {trainingSection.map((training, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      type="text"
                      value={training.training_title}
                      onChange={(e) =>
                        handleTrainingPeriodChange(
                          index,
                          "training_title",
                          e.target.value
                        )
                      }
                      placeholder="Training Title"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={training.training_period}
                      onChange={(e) =>
                        handleTrainingPeriodChange(
                          index,
                          "training_period",
                          e.target.value
                        )
                      }
                      placeholder="YYYY or Month-Year"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={training.place}
                      onChange={(e) =>
                        handleTrainingPeriodChange(
                          index,
                          "place",
                          e.target.value
                        )
                      }
                      placeholder="Place"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={training.organizer}
                      onChange={(e) =>
                        handleTrainingPeriodChange(
                          index,
                          "organizer",
                          e.target.value
                        )
                      }
                      placeholder="Organizer"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => removeTrainingPeriod(index)}
                      className={ProfileCss.removeBtn}
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="button"
            onClick={addTrainingPeriod}
            className={ProfileCss.addBtn}
          >
            ➕ Add Training Period
          </button>

          {/* Language skills */}
          <h4>🌐 Language Proficiency</h4>
          <table className={ProfileCss.languageTable}>
            <thead>
              <tr>
                <th rowSpan="2">Language</th>
                <th colSpan="3">Writing</th>
                <th colSpan="3">Reading</th>
                <th colSpan="3">Speaking</th>
              </tr>
              <tr>
                {["Writing", "Reading", "Speaking"].map((skill) =>
                  levels.map((level) => (
                    <th key={`${skill}-${level}`}>{level}</th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {Object.keys(skills).map((language) => (
                <tr key={language}>
                  <td>{language}</td>
                  {["Writing", "Reading", "Speaking"].map((skill) =>
                    levels.map((level) => (
                      <td key={`${language}-${skill}-${level}`}>
                        <input
                          type="radio"
                          name={`${language}-${skill}`}
                          value={level}
                          checked={skills[language][skill] === level}
                          onChange={() =>
                            handleLanguageChange(language, skill, level)
                          }
                        />
                      </td>
                    ))
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* ===== Computer Skill Section ===== */}
          <h4>💻 Computer Skills</h4>
          <table className={ProfileCss.languageTable}>
            <thead>
              <tr>
                <th>Computer Skill</th>
                {Computer_levels.map((level) => (
                  <th key={level}>{level}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                "Microsoft Word",
                "Microsoft Excel",
                "PowerPoint",
                "Email",
                "Internet",
                "Basic Maintenance (Install Windows, Printer)",
                "Photoshop",
                "Access Database",
              ].map((skill) => (
                <tr key={skill}>
                  <td>{skill}</td>
                  {Computer_levels.map((level) => (
                    <td key={`${skill}-${level}`}>
                      <input
                        type="radio"
                        name={skill}
                        value={level}
                        checked={selectedLevels[skill] === level}
                        onChange={() => handleComputerChange(skill, level)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Approved by, applier, receiver */}
          <div>
            <h4>✅ Approved Section</h4>
            <div className={ProfileCss.approvalSection}>
              {/* Applier */}
              <div className={ProfileCss.approvalForm}>
                <table className={ProfileCss.approvalTable}>
                  <thead>
                    <tr>
                      <th>Applier</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Signature: __________________</td>
                    </tr>
                    <tr>
                      <td>
                        Name:{" "}
                        <input
                          type="text"
                          name="applier_name"
                          value={formApprovalData.applier_name}
                          onChange={handleApprovalChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Phone Number:{" "}
                        <input
                          type="text"
                          name="applier_phone"
                          value={formApprovalData.applier_phone}
                          onChange={handleApprovalChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Approved By */}
              <div className={ProfileCss.approvalForm}>
                <table className={ProfileCss.approvalTable}>
                  <thead>
                    <tr>
                      <th>Approved by</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Signature: __________________</td>
                    </tr>
                    <tr>
                      <td>
                        Name:{" "}
                        <input
                          type="text"
                          name="approved_name"
                          value={formApprovalData.approved_name}
                          onChange={handleApprovalChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Position:{" "}
                        <input
                          type="text"
                          name="approved_position"
                          value={formApprovalData.approved_position}
                          onChange={handleApprovalChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Organization:{" "}
                        <input
                          type="text"
                          name="approved_org"
                          value={formApprovalData.approved_org}
                          onChange={handleApprovalChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Phone Number:{" "}
                        <input
                          type="text"
                          name="approved_phone" // ✅ fixed here
                          value={formApprovalData.approved_phone}
                          onChange={handleApprovalChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Receiver */}
              <div className={ProfileCss.approvalForm}>
                <table className={ProfileCss.approvalTable}>
                  <thead>
                    <tr>
                      <th>Receiver</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Signature: __________________</td>
                    </tr>
                    <tr>
                      <td>
                        Name:{" "}
                        <input
                          type="text"
                          name="receiver_name"
                          value={formApprovalData.receiver_name}
                          onChange={handleApprovalChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Position:{" "}
                        <input
                          type="text"
                          name="receiver_position"
                          value={formApprovalData.receiver_position}
                          onChange={handleApprovalChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Organization:{" "}
                        <input
                          type="text"
                          name="receiver_org"
                          value={formApprovalData.receiver_org}
                          onChange={handleApprovalChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Phone Number:{" "}
                        <input
                          type="text"
                          name="receiver_phone"
                          value={formApprovalData.receiver_phone}
                          onChange={handleApprovalChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <button type="submit" className={ProfileCss.submitButton}>
            Submit All Information
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileDetail;
