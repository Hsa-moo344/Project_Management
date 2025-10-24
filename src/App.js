import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState } from "react";

// Import Components
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
import TotalStaff from "./components/TotalStaff";
import StaffContactNav from "./components/StaffContactNav";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login */}
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />

        {/* Unauthorized Page */}
        <Route
          path="/unauthorized"
          element={
            <h2 style={{ textAlign: "center", marginTop: "50px" }}>
              🚫 Access Denied, only admin can access.
            </h2>
          }
        />

        {/* ==========================
            ADMIN (Full Access)
           ========================== */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["admin", "staff"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-staff"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AddStaff />
            </PrivateRoute>
          }
        />
        <Route
          path="/staffdatabase"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Staffdatabase />
            </PrivateRoute>
          }
        />
        <Route
          path="/fundraising"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Fundraising />
            </PrivateRoute>
          }
        />
        <Route
          path="/totalstaff"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <TotalStaff />
            </PrivateRoute>
          }
        />
        <Route
          path="/payroll"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Payroll />
            </PrivateRoute>
          }
        />
        <Route
          path="/individual"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Individual />
            </PrivateRoute>
          }
        />
        <Route
          path="/staffinfo"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <StaffInfo />
            </PrivateRoute>
          }
        />
        <Route
          path="/staffcontact"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <StaffContact />
            </PrivateRoute>
          }
        />
        <Route
          path="/staffcontactnav"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <StaffContactNav />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/profiledetail"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <ProfileDetail />
            </PrivateRoute>
          }
        />

        {/* ==========================
            STAFF (Limited Access)
           ========================== */}
        <Route
          path="/home"
          element={
            <PrivateRoute allowedRoles={["admin", "staff"]}>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <PrivateRoute allowedRoles={["admin", "staff"]}>
              <Attendance />
            </PrivateRoute>
          }
        />
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
