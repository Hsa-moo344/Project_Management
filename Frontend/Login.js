import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProfileCss from "../css/staff.module.css";
import Image from "../image/maeteo.png";
import axios from "axios";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/login", {
        email,
        password,
      });

      const { role } = response.data;

      localStorage.setItem("role", role);
      localStorage.setItem("token", "dummy_token"); // ADD THIS LINE

      if (role === "admin") {
        navigate("/AdminPage");
      } else {
        navigate("/HomePage");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className={ProfileCss.loginMain}>
      <div className={ProfileCss.Main}>
        <img src={Image} alt="metao" className={ProfileCss.ImageLogin} />
        <div className={ProfileCss.MianCont}>Login</div>

        {error && <p style={{ color: "#f70d3f" }}>{error}</p>}
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={handleSubmit}>Login</button>
      </div>
    </div>
  );
}

export default Login;
