const express = require("express");
const morgan = require("morgan");
const app = express();
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");
const mongoose = require("mongoose");
const Cohorts = require("./models/Cohort.model.js");
const Students = require("./models/Student.model.js");
const cohorts = require("./cohorts.json");
const students = require("./students.json");
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
const MONGODB_URI = "mongodb://127.0.0.1:27017/cohort-tools-api";

mongoose
  .connect(MONGODB_URI)
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));
// ROUTES
//  GET  / route - This is just an example route
app.get("/", (req, res) => {
  res.send("<h1>Cohort-Tools-API</h1>");
});

app.post("/api/students", (request, response) => {
  console.log(request.body);
  Students.create({
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email,
    phone: request.body.phone,
    linkedinUrl: request.body.linkedinUrl,
    languages: request.body.languages,
    program: request.body.program,
    background: request.body.background,
    image: request.body.image,
    cohort: request.body.cohort,
    projects: request.body.projects,
  })
    .then((createdStudent) => {
      response.status(201).json(createdStudent);
    })
    .catch((error) => {
      response
        .status(500)
        .json({ message: "Error while creating a new student" });
    });
});

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.get("/api/cohorts", (req, res) => {
  res.json(cohorts);
});

app.get("/api/students", (req, res) => {
  res.json(students);
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
