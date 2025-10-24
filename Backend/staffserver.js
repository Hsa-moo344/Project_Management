const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");

// Application secuirty for API call
// function protectRoute(allowedRoles = []) {
//   return (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "No token" });

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       if (!allowedRoles.includes(decoded.role)) {
//         return res.status(403).json({ message: "Forbidden" });
//       }

//       req.user = decoded;
//       next();
//     } catch {
//       res.status(403).json({ message: "Invalid or expired token" });
//     }
//   };
// }

// const router = express.Router();

// const attendance = require("./routes/attendance");

const app = express();
// app.use(cors());
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
// app.use("/api/attendance", attendanceRouter);
// app.use(cors({ origin: "http://localhost:3000" }));  // allow frontend
// app.use(express.json());  // parse JSON body

// Allow requests from your frontend's origin
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Serve static files from "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MySQL Connection
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "hsamoomoo",
  password: "123456",
  database: "timesheet",
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
  } else {
    console.log("Connected to MySQL database!");
    connection.release();
  }
});

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage: storage });

function formatDate(input) {
  if (!input) return null;
  const date = new Date(input);
  return date.toISOString().slice(0, 10);
}

// Fundraising
// GET all items
app.get("/api/fundraisingfunction", (req, res) => {
  pool.query(
    "SELECT * FROM fundraising ORDER BY created_at DESC",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

// Get All Payroll Records
// app.get("/payrollfunction", (req, res) => {
//   pool.query("SELECT * FROM tbl_payroll", (err, results) => {
//     if (err) {
//       console.error("Select error:", err);
//       return res.status(500).send("Error fetching payrolls");
//     }
//     res.json(results);
//   });
// });

// Get All tbl_timesheet
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM tbl_timesheet WHERE email = ? AND password = ?";
  pool.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length > 0) {
      const user = results[0];
      res.json({
        message: "Login successful",
        role: user.role,
        userId: user.id,
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });
});

// ✅ POST a new item
app.post("/api/fundraisingfunction", upload.single("image"), (req, res) => {
  const { itemId, ItemName, ItemDescription, ItemIn, ItemOut, Balance } =
    req.body;
  const image = req.file ? "/uploads/" + req.file.filename : "";

  const sql = `INSERT INTO fundraising (itemId, ItemName, ItemDescription, image, ItemIn, ItemOut, Balance) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    itemId,
    ItemName,
    ItemDescription,
    image,
    ItemIn,
    ItemOut,
    Balance,
  ];

  pool.query(sql, values, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Item created", id: result.insertId });
  });
});

// ✅ PUT (update) an item
app.put("/api/fundraisingfunction/:id", upload.single("image"), (req, res) => {
  const { itemId, ItemName, ItemDescription, ItemIn, ItemOut, Balance } =
    req.body;
  const image = req.file ? "/uploads/" + req.file.filename : null;

  let sql = `UPDATE fundraising SET itemId=?, ItemName=?, ItemDescription=?, ItemIn=?, ItemOut=?, Balance=?`;
  const params = [itemId, ItemName, ItemDescription, ItemIn, ItemOut, Balance];

  if (image) {
    sql += `, image=?`;
    params.push(image);
  }

  sql += ` WHERE id=?`;
  params.push(req.params.id);

  pool.query(sql, params, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Item updated" });
  });
});

// ✅ DELETE an item
app.delete("/api/fundraisingfunction/:id", (req, res) => {
  pool.query("DELETE FROM fundraising WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Item deleted" });
  });
});

// Login user
// app.post("/login", (req, res) => {
//   const { email, password } = req.body;
//   const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

//   pool.query(sql, [email, password], (err, results) => {
//     if (err) return res.status(500).json({ error: "Database error" });
//     if (results.length === 0)
//       return res.status(401).json({ error: "Invalid credentials" });

//     const user = results[0];
//     res.status(200).json({ email: user.email, role: user.role });
//   });
// });

//  Attendance form insert
app.post("/attendancefunction", (req, res) => {
  const {
    name,
    staffCode,
    gender,
    position,
    department,
    email,
    type,
    date,
    timeIn,
    timeOut,
    workingHours,
    startLeaveDay,
    endLeaveDay,
    totalLeaveDaysThisMonth,
    approvedBy,
  } = req.body;

  const sql = `
    INSERT INTO tbl_attendance (
      name, staffCode, gender, position, department, email, type, date,
      timeIn, timeOut, workingHours,
      startLeaveDay, endLeaveDay, totalLeaveDaysThisMonth, approvedBy
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
    sql,
    [
      name,
      staffCode,
      gender,
      position,
      department,
      email || null,
      type,
      formatDate(date),
      timeIn,
      timeOut,
      workingHours || null,
      formatDate(startLeaveDay),
      formatDate(endLeaveDay),
      totalLeaveDaysThisMonth || null,
      approvedBy,
    ],
    (err, results) => {
      if (err) {
        console.error("Insert error:", err.message);
        return res.status(500).json({ error: "Database insert failed" });
      }
      res.status(200).json({
        message: "Insert successful",
        id: results.insertId,
      });
    }
  );
});

// PUT - Update Attendance
app.put("/attendancefunction/:id", (req, res) => {
  const id = req.params.id;
  const {
    name,
    staffCode,
    gender,
    position,
    department,
    email,
    type,
    date,
    timeIn,
    timeOut,
    workingHours,
    startLeaveDay,
    endLeaveDay,
    totalLeaveDaysThisMonth,
    approvedBy,
  } = req.body;

  const sql = `
    UPDATE tbl_attendance SET
      name=?, staffCode=?, gender=?, position=?, department=?, email=?, type=?, date=?,
      timeIn=?, timeOut=?, workingHours=?, startLeaveDay=?, endLeaveDay=?,
      totalLeaveDaysThisMonth=?, approvedBy=?
    WHERE id=?
  `;

  pool.query(
    sql,
    [
      name,
      staffCode,
      gender,
      position,
      department,
      email,
      type,
      formatDate(date),
      timeIn,
      timeOut,
      workingHours,
      formatDate(startLeaveDay),
      formatDate(endLeaveDay),
      totalLeaveDaysThisMonth,
      approvedBy,
      id,
    ],
    (err) => {
      if (err) {
        console.error("Update error:", err.message);
        return res.status(500).json({ error: "Update failed" });
      }
      res.status(200).json({ message: "Attendance updated successfully" });
    }
  );
});

// DELETE - Attendance
app.delete("/attendancefunction/:id", (req, res) => {
  const id = req.params.id;
  pool.query("DELETE FROM tbl_attendance WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Delete error:", err.message);
      return res.status(500).json({ error: "Delete failed" });
    }
    res.status(200).json({ message: "Attendance deleted successfully" });
  });
});

// GET - All Attendance
app.get("/attendancefunction", (req, res) => {
  const sql = "SELECT * FROM tbl_attendance ORDER BY date DESC";
  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching:", err.message);
      return res.status(500).json({ error: "Database fetch failed" });
    }
    res.json(results);
  });
});

// Download Attendance PDF
app.get("/api/attendancefunction", (req, res) => {
  const query = `
    SELECT 
      name,
      staffCode,
      gender,
      position,
      department,
      email,
      type,
      formatDate(date),
      timeIn,
      timeOut,
      workingHours,
      formatDate(startLeaveDay),
      formatDate(endLeaveDay),
      totalLeaveDaysThisMonth,
      approvedBy,
      id
    FROM attendance`;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching attendance data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json(results);
  });
});

// POST - Insert Individual Timesheet
app.post("/individualfunction", (req, res) => {
  const {
    name,
    staffCode,
    gender,
    position,
    department,
    email,
    type,
    date,
    timeIn,
    timeOut,
    workingHours,
    startLeaveDay,
    endLeaveDay,
    totalLeaveDaysThisMonth,
    activities,
    approvedBy,
  } = req.body;

  const sql = `
    INSERT INTO tbl_individual (
      name, staffCode, gender, position, department, email, type, date,
      timeIn, timeOut, workingHours,
      startLeaveDay, endLeaveDay, totalLeaveDaysThisMonth, activities, approvedBy
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
    sql,
    [
      name,
      staffCode,
      gender,
      position,
      department,
      email || null,
      type,
      formatDate(date),
      timeIn,
      timeOut,
      workingHours || null,
      formatDate(startLeaveDay),
      formatDate(endLeaveDay),
      totalLeaveDaysThisMonth || null,
      activities || null,
      approvedBy,
    ],
    (err, results) => {
      if (err) {
        console.error("Insert error:", err.message);
        return res.status(500).json({ error: "Database insert failed" });
      }
      res
        .status(200)
        .json({ message: "Insert successful", id: results.insertId });
    }
  );
});

// PUT - Update individual
app.put("/individualfunction/:id", (req, res) => {
  const id = req.params.id;
  let {
    name,
    staffCode,
    gender,
    position,
    type,
    date,
    timeIn,
    timeOut,
    workingHours,
    totalLeaveDaysThisMonth,
    activities,
    approvedBy,
  } = req.body;

  // ✅ Format the date string to only include YYYY-MM-DD
  if (date) {
    date = new Date(date).toISOString().split("T")[0]; // "2025-06-16"
  }

  const sql = `
    UPDATE tbl_individual SET
      name = ?,
      staffCode = ?,
      gender = ?,
      position = ?,
      type = ?,
      date = ?,
      timeIn = ?,
      timeOut = ?,
      workingHours = ?,
      totalLeaveDaysThisMonth = ?,
      activities = ?,
      approvedBy = ?
    WHERE id = ?
  `;

  const values = [
    name,
    staffCode,
    gender,
    position,
    type,
    date,
    timeIn,
    timeOut,
    workingHours,
    totalLeaveDaysThisMonth || null,
    activities,
    approvedBy,
    id,
  ];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error("SQL update error:", err);
      res.status(500).send("Failed to update");
    } else {
      res.send("Updated individual timesheet successfully");
    }
  });
});

// DELETE - individual
app.delete("/individualfunction/:id", (req, res) => {
  const id = req.params.id;
  pool.query("DELETE FROM tbl_individual WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Delete error:", err.message);
      return res.status(500).json({ error: "Delete failed" });
    }
    res.status(200).json({ message: "Attendance deleted successfully" });
  });
});

// GET - All individual
app.get("/individualfunction", (req, res) => {
  pool.query("SELECT * FROM tbl_individual", (err, result) => {
    if (err) {
      console.error("Fetch error:", err.message);
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    res.status(200).json(result);
  });
});

// Staff Profile Insert with Image Upload
app.post("/staffdatabasefunction", upload.single("image"), (req, res) => {
  const { name, gender, position, departments, joinDate, staffCode, tags } =
    req.body;
  const image = req.file ? "/uploads/" + req.file.filename : null;

  const sql = `
    INSERT INTO tbl_staffprofile 
    (name, gender, position, image, departments, joinDate, staffCode, tags) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
    sql,
    [name, gender, position, image, departments, joinDate, staffCode, tags],
    (err, result) => {
      if (err) {
        console.error("Insert error:", err.message);
        return res.status(500).send("Failed to insert staff.");
      }
      res.status(200).send("Staff added successfully!");
    }
  );
});

//  Staff Profile Fetch
app.get("/api/staffdatabasefunction", (req, res) => {
  const sql = "SELECT * FROM tbl_staffprofile";

  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Fetch error:", err.message);
      return res.status(500).send("Failed to fetch staff.");
    }

    const parsedResult = result.map((staff) => ({
      ...staff,
      tags:
        typeof staff.tags === "string" ? JSON.parse(staff.tags) : staff.tags,
    }));

    res.status(200).json(parsedResult);
  });
});

//  Update Staff Profile
app.put("/staffdatabasefunction/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, gender, position, departments, joinDate, staffCode, tags } =
    req.body;
  const image = req.file ? "/uploads/" + req.file.filename : null;

  if (!image) {
    pool.query(
      "SELECT image FROM tbl_staffprofile WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          console.error("Fetch error:", err.message);
          return res.status(500).send("Failed to fetch existing image.");
        }
        const existingImage = results[0]?.image || null;

        const sql = `
          UPDATE tbl_staffprofile 
          SET name = ?, gender = ?, position = ?, image = ?, departments = ?, joinDate = ?, staffCode = ?, tags = ?
          WHERE id = ?
        `;

        pool.query(
          sql,
          [
            name,
            gender,
            position,
            existingImage,
            departments,
            joinDate,
            staffCode,
            tags,
            id,
          ],
          (err, result) => {
            if (err) {
              console.error("Update error:", err.message);
              return res.status(500).send("Failed to update staff.");
            }
            res.status(200).send("Staff updated successfully!");
          }
        );
      }
    );
  } else {
    const sql = `
      UPDATE tbl_staffprofile 
      SET name = ?, gender = ?, position = ?, image = ?, departments = ?, joinDate = ?, staffCode = ?, tags = ?
      WHERE id = ?
    `;

    pool.query(
      sql,
      [
        name,
        gender,
        position,
        image,
        departments,
        joinDate,
        staffCode,
        tags,
        id,
      ],
      (err, result) => {
        if (err) {
          console.error("Update error:", err.message);
          return res.status(500).send("Failed to update staff.");
        }
        res.status(200).send("Staff updated successfully!");
      }
    );
  }
});

// Delete staff profile
app.delete("/staffdatabasefunction/:id", (req, res) => {
  const staffId = req.params.id;

  const deleteQuery = "DELETE FROM tbl_staffprofile WHERE id = ?";

  pool.query(deleteQuery, [staffId], (err, result) => {
    if (err) {
      console.error("Error deleting staff:", err);
      return res.status(500).json({ error: "Failed to delete staff" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Staff not found" });
    }

    res.json({ message: "Staff deleted successfully" });
  });
});

// Create Payroll Record
app.post("/payrollfunction", (req, res) => {
  const {
    staffCode,
    fullName,
    department,
    banding,
    salaryYear,
    payMonth,
    workingDays,
    leaveDays,
    totalHours,
    hourlyRate,
    grossSalary,
    deductions,
    netSalary,
    paymentStatus,
  } = req.body;

  const sql = `
    INSERT INTO tbl_payroll 
    (staffCode, fullName, department, banding, salaryYear, payMonth, workingDays, leaveDays, totalHours, hourlyRate, grossSalary, deductions, netSalary, paymentStatus) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    staffCode,
    fullName,
    department,
    banding,
    salaryYear,
    payMonth,
    workingDays,
    leaveDays,
    totalHours,
    hourlyRate,
    grossSalary,
    deductions || 0, // make sure deductions is not empty string
    netSalary,
    paymentStatus || "Unpaid",
  ];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).send("Error inserting payroll");
    }
    res.send("Payroll inserted successfully");
  });
});

// Get All Payroll Records
app.get("/payrollfunction", (req, res) => {
  pool.query("SELECT * FROM tbl_payroll", (err, results) => {
    if (err) {
      console.error("Select error:", err);
      return res.status(500).send("Error fetching payrolls");
    }
    res.json(results);
  });
});

// Update Payroll by ID
app.put("/payrollfunction/:id", (req, res) => {
  const payrollId = req.params.id;
  const updatedData = req.body;

  delete updatedData.createdAt; // prevent updating createdAt if it's autogenerated

  const {
    staffCode,
    fullName,
    department,
    banding,
    salaryYear,
    payMonth,
    workingDays,
    leaveDays,
    totalHours,
    hourlyRate,
    grossSalary,
    deductions,
    netSalary,
    paymentStatus,
  } = updatedData;

  const sql = `
    UPDATE tbl_payroll SET
      staffCode = ?,
      fullName = ?,
      department = ?,
      banding = ?,
      salaryYear = ?,
      payMonth = ?,
      workingDays = ?,
      leaveDays = ?,
      totalHours = ?,
      hourlyRate = ?,
      grossSalary = ?,
      deductions = ?,
      netSalary = ?,
      paymentStatus = ?
    WHERE id = ?
  `;

  const values = [
    staffCode,
    fullName,
    department,
    banding,
    salaryYear,
    payMonth,
    workingDays,
    leaveDays,
    totalHours,
    hourlyRate,
    grossSalary,
    deductions,
    netSalary,
    paymentStatus,
    payrollId,
  ];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).send("Error updating payroll");
    }
    res.send("Payroll updated successfully");
  });
});

// Delete payroll
app.delete("/payrollfunction/:id", (req, res) => {
  pool.query("DELETE FROM tbl_payroll WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).send("Error deleting");
    }
    res.send("Deleted");
  });
});

// Download Payroll PDF
app.get("/api/payrollfunction", (req, res) => {
  const query = `
    SELECT 
      staffCode,
      fullName,
      department,
      banding,
      salaryYear,
      payMonth,
      workingDays,
      leaveDays,
      totalHours,
      hourlyRate,
      grossSalary,
      deductions,
      netSalary,
      paymentStatus
    FROM payroll`;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching payroll data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json(results);
  });
});

// Add Staff Table
// POST - Create staff
app.post("/staffdepartment", (req, res) => {
  const { staffCode, fullName, banding, gender, position, department, remark } =
    req.body;

  const sql = `
    INSERT INTO tbl_staff (staffCode, fullName, banding, gender, position, department, remark)
    VALUES (?, ?, ?, ?, ?,?,?)
  `;

  pool.query(
    sql,
    [staffCode, fullName, banding, gender, position, department, remark],
    (err, results) => {
      if (err) {
        console.error("Insert error:", err.message);
        return res.status(500).json({ error: "Database insert failed" });
      }
      res
        .status(200)
        .json({ message: "Insert successful", id: results.insertId });
    }
  );
});

// GET - get all staff
app.get("/staffdepartment", (req, res) => {
  const sql = "SELECT * FROM tbl_staff";
  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch error:", err.message);
      return res.status(500).json({ error: "Database fetch failed" });
    }
    res.status(200).json(results);
  });
});

// PUT - Update staff by ID
app.put("/staffdepartment/:id", (req, res) => {
  const { id } = req.params;
  const { staffCode, fullName, banding, gender, position, department, remark } =
    req.body;

  const sql = `
    UPDATE tbl_staff
    SET staffCode = ?, fullName = ?, banding =?, gender = ?, position = ?, department = ?, remark = ?
    WHERE id = ?
  `;

  pool.query(
    sql,
    [staffCode, fullName, banding, gender, position, department, remark, id],
    (err) => {
      if (err) {
        console.error("Update error:", err.message);
        return res.status(500).json({ error: "Update failed" });
      }
      res.status(200).json({ message: "Update successful" });
    }
  );
});

// DELETE - Delete staff by ID
app.delete("/staffdepartment/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tbl_staff WHERE id = ?";

  pool.query(sql, [id], (err) => {
    if (err) {
      console.error("Delete error:", err.message);
      return res.status(500).json({ error: "Delete failed" });
    }
    res.status(200).json({ message: "Deleted successfully" });
  });
});

// Add Staff Name and Departmetn at Staff Table
app.get("/api/staffdepartment", (req, res) => {
  const sql = `
    SELECT department, COUNT(staffCode) AS total_staff
    FROM tbl_staff
    GROUP BY department;
  `;

  pool.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Database error",
        details: err,
      });
    }
    res.json(result);
  });
});

// Dashboard staff count by department
app.get("/api/department-count", (req, res) => {
  const sql = `
    SELECT department, COUNT(staffCode) AS total_staff
    FROM tbl_staff
    GROUP BY department;
  `;

  pool.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Database error",
        details: err,
      });
    }
    res.json(result);
  });
});

// Dashboard from tbl_staff table
// API endpoint to get all staff
app.get("/api/department-count", (req, res) => {
  const sql = `
  SELECT IFNULL(department, 'Unknown') AS department, COUNT(staffCode) AS total_staff
  FROM tbl_staff
  GROUP BY department
`;
  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching staff:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Department banding
app.get("/api/department-banding", (req, res) => {
  const sql = `
    SELECT 
      IFNULL(banding, 'Unknown') AS banding,
      COUNT(staffCode) AS total
    FROM tbl_staff
    GROUP BY banding
    ORDER BY
      CASE WHEN banding = 'Unknown' THEN 1 ELSE 0 END,
      CAST(SUBSTRING(banding, 9) AS UNSIGNED);
  `;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching staff:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Banding Status
app.get("/api/banding-status-count", (req, res) => {
  const sql = `
   SELECT 
    remark, 
    COUNT(*) AS total
FROM tbl_staff
WHERE remark IN ('Resign', 'Promotion', 'change department', 'Part Time', 'Volunteer')
GROUP BY remark;
  `;
  pool.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching data:", err);
      res.status(500).send("Server error");
    } else {
      res.json(results);
    }
  });
});

// Total staff count gender
app.get("/api/Total-gender-count", (req, res) => {
  const sql = `
    SELECT 
      IFNULL(gender, 'No Gender') AS gender,
      COUNT(*) AS total
    FROM tbl_staff
    GROUP BY IFNULL(gender, 'No Gender');
  `;
  pool.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching data:", err);
      res.status(500).send("Server error");
    } else {
      res.json(results);
    }
  });
});

// API to get staff count only Health Departments
app.get("/api/staff/healthdepartments", (req, res) => {
  const sql = `
    SELECT department, COUNT(*) AS total
      FROM tbl_staff
      WHERE department IN (
        'Health Services', 'ECU', 'IPU', 'Nursing Program',
        'VCT, Blood Bank Department (HIV Program)', 'RH IPD', 'RH OPD',
        'HIS and Registration', 'Eye Program', 'Lab', 'Referral',
        'Adult & Child IPD', 'Physiotherapy & TCM Department', 'Surgical OPD',
        'Adult OPD', 'Child OPD & Immunization', 'Dental',
        'Pharmacy OPD and Central Pharmacy', 'Pharamcy IPD'
      )
      GROUP BY department;
  `;
  pool.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching data:", err);
      res.status(500).send("Server error");
    } else {
      res.json(results);
    }
  });
});

// API to get staff count only Operation Departments
app.get("/api/staff/operationdepartments", (req, res) => {
  const sql = `
    SELECT department, COUNT(*) AS total
    FROM tbl_staff
    WHERE department IN (
      'Organisational Development', 
      'Kitchen',
      'Health Training and Community Health',
      'Community Health',
      'Community Health and SRHR Program',
      'School Health',
      'Training Office',
      'Bachelor of Nursing',
      'Library'
    )
    GROUP BY department;
  `;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching data:", err);
      return res.status(500).json({ error: "Server error" });
    }
    res.json(results); // should return [{department: "Kitchen", total: 5}, ...]
  });
});

// Staff Contact Information
// ✅ GET all staff
app.get("/api/staffcontactfunction", (req, res) => {
  const sql = "SELECT * FROM tbl_contact";

  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching staff contacts:", err);
      return res.status(500).send("Failed to fetch staff contacts");
    }
    res.json(results); // sends data to React frontend
  });
});

// ✅ Insert a new staff contact
app.post("/api/staffcontactfunction", (req, res) => {
  const { staffCode, fullName, phoneNumber } = req.body;
  const sql =
    "INSERT INTO tbl_contact (staffCode, fullName, phoneNumber) VALUES (?, ?, ?)";
  pool.query(sql, [staffCode, fullName, phoneNumber], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).send("Staff Code already exists");
      }
      return res.status(500).send("Failed to insert staff contact");
    }
    res.send("Staff contact inserted successfully");
  });
});

// ✅ Update a staff contact
app.put("/api/staffcontactfunction/:id", (req, res) => {
  const { id } = req.params;
  const { staffCode, fullName, phoneNumber } = req.body;
  const sql =
    "UPDATE tbl_contact SET staffCode = ?, fullName = ?, phoneNumber = ? WHERE id = ?";
  pool.query(sql, [staffCode, fullName, phoneNumber, id], (err) => {
    if (err) return res.status(500).send("Failed to update staff contact");
    res.send("Staff contact updated successfully");
  });
});
// // ✅ Delete a staff contact
app.delete("/api/staffcontactfunction/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tbl_contact WHERE id = ?";
  pool.query(sql, [id], (err) => {
    if (err) return res.status(500).send("Failed to delete staff contact");
    res.send("Staff contact deleted successfully");
  });
});

//  Start Server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
