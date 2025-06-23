import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCss from "../css/staff.module.css";

function Home() {
  const navigate = useNavigate();
  const someCondition = true;

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("username");
    if (isLoggedIn !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      {/* <div className={ProfileCss.Dropdown}>
        <button className={ProfileCss.dropbtl}>Departments</button>
        <div className={ProfileCss.BtlContent}>
          <a href="#">Finance</a>
          <a href="#">Security/Public Relation</a>
          <a href="#">Administration/HR</a>
          <a href="#">Organizational Development</a>
          <a href="#">HIS/Registration</a>
          <a href="#">Health Adminstration Office</a>
          <a href="#">Eye</a>
          <a href="#">Adult OPD</a>
          <a href="#">Dental</a>
          <a href="#">Child OPD/Immunization</a>
          <a href="#">RH OPD</a>
          <a href="#">VCT/Blood Bank</a>
          <a href="#">Pharmacy OPD/Main Cental</a>
          <a href="#">Physio/TCM</a>
          <a href="#">RH IPD</a>
          <a href="#">Child IPD</a>
          <a href="#">Adult IPD</a>
          <a href="#">Surgical IPD</a>
        </div>
      </div> */}
      <h2 className={ProfileCss.MainPage}>
        Welcome to Staff Management Main Page
      </h2>

      <div className={ProfileCss.navBtl}>
        <button
          className={ProfileCss.addButton}
          onClick={() => {
            if (someCondition) {
              navigate("/attendance");
            } else {
              navigate("/Dashboard");
            }
          }}
        >
          Staff Attendance/Timesheet
        </button>
        <button
          className={ProfileCss.addButton}
          onClick={() => navigate("/individual")}
        >
          Individual Timesheet
        </button>
        <button
          className={ProfileCss.addButton}
          onClick={() => navigate("/payroll")}
        >
          Staff Payroll
        </button>

        <button
          className={ProfileCss.addButton}
          onClick={() => navigate("/add-staff")}
        >
          + Add Staff Table
        </button>

        <button
          className={ProfileCss.addButton}
          onClick={() => navigate("/staffdatabase")}
        >
          Staff Profile Database
        </button>

        <button
          className={ProfileCss.addButton}
          onClick={() => navigate("/profile")}
        >
          Staff Profile
        </button>
        <button
          className={ProfileCss.addButton}
          onClick={() => navigate("/fundraising")}
        >
          Fundraising
        </button>
      </div>
      <div>
        {/* <h2>Staff Management Main Board</h2> */}
        <p>
          Mae Tao Clinic (MTC) is a community-based organization that has served
          the migrant community and internally displaced populations for more
          than 30 years. Located in Mae Sot District in Tak Province, on the
          border of Thailand and Burma, MTC is not immune to global events. The
          COVID-19 pandemic, conflicts in Burma and other parts of the world,
          and climate change, have all caused significant disruptions. The
          severity and scale of these developments have been unprecedented and
          brought hardship to the communities.
        </p>
        <br />
        <p>
          The challenging and uncertain future calls for a renewed focus and
          refreshed strategies, even as MTC sought to reorganize and reallocate
          resources to deal with immediate challenges. Since 2020, MTC has, in
          close collaboration with other dedicated partner organizations and the
          support of donors, focused its efforts on addressing the public health
          crisis and emergency humanitarian situation. As the world continues to
          adjust to a post-pandemic way of living, MTC has returned to re-focus
          its commitment towards sustainable development. Guiding the
          organization through these turbulent times are a renewed vision,
          mission and values.
          <strong>
            In 2019, around 390 staff are working in Mae Tao Clinic from the
            health to education to training to Burma Based Health Services.
          </strong>
        </p>
        <br />
      </div>
    </div>
  );
}

export default Home;
