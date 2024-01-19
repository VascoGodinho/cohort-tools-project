const express = require("express");
const morgan = require("morgan");
const app = express();
require("./config")(app);
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");
const mongoose = require("mongoose");
const Cohort = require("./models/Cohort.model.js");
const Student = require("./models/Student.model.js");
const { isAuthenticated } = require("./middleware/jwt.middleware"); // <== IMPORT

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const allRoutes = require("./routes");
app.use("/api", allRoutes);

const projectRouter = require("./routes/project.routes");
app.use("/api", isAuthenticated, projectRouter); // <== UPDATE

const taskRouter = require("./routes/task.routes");
app.use("/api", isAuthenticated, taskRouter); // <== UPDATE

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

require("./error-handling")(app);

const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/error-handling");

const MONGODB_URI = "mongodb://127.0.0.1:27017/cohort-tools-api";

mongoose
  .connect(MONGODB_URI)
  .then(async (x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => console.error("Error connecting to mongo", err));

// ROUTES

app.get("/", (req, res) => {
  res.send("<h1>Cohort-Tools-API</h1>");
});

app.post("/api/students", (request, response, next) => {
  console.log(request.body);
  Student.create({
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
      next(error);
    });
});

app.post("/api/cohorts", (request, response, next) => {
  console.log("Request Body:", request.body);
  Cohort.create({
    inProgress: request.body.inProgress,
    cohortSlug: request.body.cohortSlug,
    cohortName: request.body.cohortName,
    program: request.body.program,
    campus: request.body.campus,
    startDate: request.body.startDate,
    endDate: request.body.endDate,
    programManager: request.body.programManager,
    leadTeacher: request.body.leadTeacher,
    totalHours: request.body.totalHours,
  })
    .then((createdCohort) => {
      response.status(201).json(createdCohort);
    })
    .catch((error) => {
      console.error("Error creating cohort:", error);
      next(error);
    });
});
// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(cors());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.get("/api/cohorts", (req, res, next) => {
  Cohort.find()
    .then((allCohorts) => {
      res.status(200).json(allCohorts);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/students", (req, res, next) => {
  Student.find()
    .populate("cohort")
    .then((allStudents) => {
      res.status(200).json(allStudents);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/students/:studentId", (req, res, next) => {
  Student.findById(req.params.studentId)
    .populate("cohort")
    .then((students) => {
      res.status(200).json(students);
    })
    .catch((error) => {
      next(error);
    });
});

app.put("/api/students/:studentId", (req, res, next) => {
  Student.findByIdAndUpdate(req.params.studentId, req.body, { new: true })
    .then((updateStudents) => {
      res.status(200).json(updateStudents);
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/students/:studentId", (req, res, next) => {
  Student.findByIdAndDelete(req.params.studentId)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/cohorts/:cohortId", async (req, res, next) => {
  Cohort.findById(req.params.cohortId)
    .then((cohorts) => {
      res.status(200).json(cohorts);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/students/cohort/:cohortId", async (req, res, next) => {
  Student.find({ cohort: req.params.cohortId })
    .populate("cohort")
    .then((students) => {
      res.status(200).json(students);
    })
    .catch((error) => {
      next(error);
    });
});

app.put("/api/cohorts/:cohortId", (req, res, next) => {
  Cohort.findByIdAndUpdate(req.params.cohortId, req.body, { new: true })
    .then((updateCohorts) => {
      res.status(200).json(updateCohorts);
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/cohorts/:cohortId", (req, res, next) => {
  Cohort.findByIdAndDelete(req.params.cohortId)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
});

app.use(errorHandler);
app.use(notFoundHandler);
// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
