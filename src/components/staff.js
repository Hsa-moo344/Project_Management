const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const User = require("../models/User");

// Attendance Routes
// GET all attendance records
router.get("/attendance", async (req, res) => {
  const attendance = await Attendance.findAll();
  res.json(attendance);
});

// POST new attendance
router.post("/attendance", async (req, res) => {
  const newAttendance = await Attendance.create(req.body);
  res.json(newAttendance);
});

// Leave Routes
// GET all leave requests
router.get("/leave", async (req, res) => {
  const leaveRequests = await Leave.findAll();
  res.json(leaveRequests);
});

// POST new leave request
router.post("/leave", async (req, res) => {
  const newLeave = await Leave.create(req.body);
  res.json(newLeave);
});

// User Routes
// GET all users
router.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// POST new user (register)
router.post("/users/register", async (req, res) => {
  const { username, password_hash, role, staff_id } = req.body;
  const newUser = await User.create({
    username,
    password_hash,
    role,
    staff_id,
  });
  res.json(newUser);
});

// Login Route (authentication)
router.post("/users/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (user && user.password_hash === password) {
    // In a real app, we would use JWT for token-based authentication
    res.json({ message: "Login successful", user });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

module.exports = router;
