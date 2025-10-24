import React, { useEffect, useState } from "react";
import ProfileCss from "../css/staff.module.css";
import Image from "../image/maeteo.png";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [role, setRole] = useState(""); // store user role
  const navigate = useNavigate();

  useEffect(() => {
    // Get user role from localStorage after login
    const userRole = localStorage.getItem("role");
    if (userRole) {
      setRole(userRole);
    }
  }, []);

  const handleLogout = () => {
    // Clear login data and go to login page
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className={ProfileCss.navContainer}>
      <img src={Image} alt="Mae Tao" className={ProfileCss.ImageNav} />

      <a href="/home" className={ProfileCss.navItems}>
        Home
      </a>

      <a href="/staffinfo" className={ProfileCss.navItems}>
        Staff Information Detail
      </a>

      <a href="/staffcontactnav" className={ProfileCss.navItems}>
        Staff Contact
      </a>

      <a href="/fundraising" className={ProfileCss.navItems}>
        Fundraising
      </a>

      <a href="/dashboard" className={ProfileCss.navItems}>
        Dashboard
      </a>

      <div className={ProfileCss.navRight}>
        {/* show role and logout button */}
        {role && (
          <span className={ProfileCss.userRole}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
        )}
        <button onClick={handleLogout} className={ProfileCss.logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
