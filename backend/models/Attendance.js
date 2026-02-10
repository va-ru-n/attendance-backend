const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  class: String,
  session: String, // morning / afternoon
  date: String, // YYYY-MM-DD
  teacherName: String,

  students: [
    {
      rollNo: Number,
      name: String,
      status: String, // present / absent
    },
  ],

  presentCount: Number,
  absentCount: Number,
});

module.exports = mongoose.model("Attendance", attendanceSchema);
