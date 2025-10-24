import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import ProfileCss from "../css/staff.module.css";
import Image from "../image/maeteo.png";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  localStorage.setItem("email", email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // You can replace this logic with your backend API
      let userRole = "";

      if (
        email === "hsamoo.moo@maetaoclinic.org" &&
        password === "@19062025@"
      ) {
        userRole = "admin";
      } else if (email === "hsamoomoo02@gmail.com" && password === "123456") {
        userRole = "staff";
      } else {
        throw new Error("Invalid credentials");
      }

      // Save role in localStorage
      localStorage.setItem("role", userRole);
      localStorage.setItem("token", "dummy_token");
      setIsLoggedIn(true);

      // Navigate based on role
      if (userRole === "admin") navigate("/dashboard");
      else navigate("/home");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className={ProfileCss.MainContainer}>
      <div className={ProfileCss.MainLoginPage}>
        <div className={ProfileCss.Mainlogin}>
          <img src={Image} alt="Mae Tao" className={ProfileCss.MaeTaoImage} />
          <h2>Staff Management System</h2>
          <p>Login with your credentials</p>
        </div>

        <div className={ProfileCss.loginRight}>
          <form onSubmit={handleSubmit} className={ProfileCss.SubLogin}>
            {error && <p className="error">{error}</p>}

            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className={ProfileCss.BtnSubmit}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
