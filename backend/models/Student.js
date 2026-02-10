const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  rollNo: Number,
  name: String,
  class: String,
  status: { type: String, default: "active" },
});

module.exports = mongoose.model("Student", studentSchema);
