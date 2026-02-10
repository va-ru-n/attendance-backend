// 🔹 Server start log
console.log("Server file started");

// 🔹 Imports (ALWAYS AT TOP)
const Attendance = require("./models/Attendance");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/User");
const Student = require("./models/Student");

// 🔹 App setup
const app = express();
app.use(cors());
app.use(express.json());

// 🔹 MongoDB connection
const MONGO_URL =
  "mongodb+srv://venkatavarun7989:mongo321@cluster0.t0zj7.mongodb.net/school_attendance?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// 🔹 Test route
app.get("/", (req, res) => {
  res.send("Attendance backend is running");
});

// 🔹 Login API (Teacher & Principal)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Get students by class
app.get("/students/:class", async (req, res) => {
  try {
    const className = req.params.class;

    const students = await Student.find({ class: className }).sort({
      rollNo: 1,
    });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

// 📝 Save attendance
app.post("/attendance", async (req, res) => {
  try {
    const {
      class: className,
      session,
      date,
      teacherName,
      students,
      presentCount,
      absentCount,
    } = req.body;

    // prevent duplicate attendance
    const exists = await Attendance.findOne({
      class: className,
      session,
      date,
    });

    if (exists) {
      return res.status(400).json({
        message: "Attendance already marked for this class & session",
      });
    }

    const attendance = new Attendance({
      class: className,
      session,
      date,
      teacherName,
      students,
      presentCount,
      absentCount,
    });

    await attendance.save();

    res.json({ message: "Attendance saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save attendance" });
  }
});

// 📊 Get attendance by month (principal)
app.get("/attendance/month/:month", async (req, res) => {
  try {
    const month = req.params.month; // YYYY-MM

    const records = await Attendance.find({
      date: { $regex: `^${month}` },
    }).sort({ date: 1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
});

// 🔹 Start server (ALWAYS LAST)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
