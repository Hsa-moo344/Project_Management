import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCss from "../css/staff.module.css";

function AdminPage() {
  const navigate = useNavigate();
  const someCondition = true;
  const [isOpen, setIsOpen] = useState(false); // Toggle state

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("username");
    if (isLoggedIn !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <div className={ProfileCss.Dropdown}>
        <button
          className={ProfileCss.dropbtl}
          onClick={() => setIsOpen(!isOpen)}
        >
          Departments ▼
        </button>

        <div
          className={`${ProfileCss.BtlContent} ${
            isOpen ? ProfileCss.show : ""
          }`}
        >
          <div className={ProfileCss.navBtl}>
            <button
              className={ProfileCss.addButton}
              onClick={() => navigate("/attendance")}
            >
              Staff Attendance/ Staff Timesheet
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
              + Add Staff Form
            </button>

            <button
              className={ProfileCss.addButton}
              onClick={() => navigate("/staffcontact")}
            >
              Staff Contact Data Entry Form
            </button>

            <button
              className={ProfileCss.addButton}
              onClick={() => navigate("/staffdatabase")}
            >
              Staff Profile Data Entry Form
            </button>
            <button
              className={ProfileCss.addButton}
              onClick={() => navigate("/profile")}
            >
              Staff Profile Form
            </button>
            <button
              className={ProfileCss.addButton}
              onClick={() => navigate("/fundraising")}
            >
              Fundraising Form
            </button>
          </div>
        </div>
      </div>
      <h2 className={ProfileCss.MainPage}>
        Welcome to Staff Management Main Page
      </h2>
      <div>
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

export default AdminPage;
