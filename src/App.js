import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import StaffInfo from "./components/StaffInfo";
import StaffContact from "./components/StaffContact";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Attendance from "./components/Attendance";
import AddStaff from "./components/AddStaff";
import Staffdatabase from "./components/staffdatabase";
import Profile from "./components/Profile";
import Fundraising from "./components/Fundraising";
import Individual from "./components/Individual";
import ProfileDetail from "./components/ProfileDetail";
import Payroll from "./components/Payroll";
import { useState } from "react";
import TotalStaff from "./components/TotalStaff";
import Security from "./components/Security";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/login"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        {/* <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/home" />}
        /> */}
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Login admin and user */}

        <Route path="/staffinfo" element={<StaffInfo />} />
        <Route path="/staffcontact" element={<StaffContact />} />

        {/* New Routes */}
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/add-staff" element={<AddStaff />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/fundraising" element={<Fundraising />} />
        <Route path="/staffdatabase" element={<Staffdatabase />} />
        <Route path="/individual" element={<Individual />} />
        <Route path="/profiledetail" element={<ProfileDetail />} />
        <Route path="/totalstaff" element={<TotalStaff />} />
        <Route path="/security" element={<Security />} />
      </Routes>
    </>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
