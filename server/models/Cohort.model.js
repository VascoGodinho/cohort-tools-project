const { Schema, model, Types } = require("mongoose");
const mongoose = require("mongoose");

const cohortSchema = new Schema({
  /*   _id: { type: Number, required: true, unique: true }, */
  inPrgoress: { type: Boolean, required: true },
  cohortsSlug: { type: String, required: true },
  cohortName: { type: String, required: true },
  program: { type: String, required: true },
  campus: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  programManager: { type: String, required: true },
  leadTeacher: { type: String, required: true },
  totalHours: { type: Number, min: 0 },
});

const Cohorts = mongoose.model("Cohorts", cohortSchema);

module.exports = Cohorts;
