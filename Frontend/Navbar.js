import React from "react";
// import { Link } from "react-router-dom";
import ProfileCss from "../css/staff.module.css";
import Image from "../image/maeteo.png";

function Navbar() {
  return (
    <nav className={ProfileCss.navContainer}>
      <img src={Image} alt="metao" className={ProfileCss.ImageNav} />
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

      <a href="/login" className={ProfileCss.navItems}>
        Logout
      </a>
    </nav>
  );
}

export default Navbar;
