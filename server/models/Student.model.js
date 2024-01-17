const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  linkedinUrl: { type: String, required: true },
  languages: { type: [String] },
  program: { type: String, required: true },
  background: { type: String, required: true },
  image: { type: String, required: true },
  cohort: { type: Number, min: 0 },
  projects: { type: [String] },
});

const Students = mongoose.model("Students", studentSchema);

module.exports = Students;
