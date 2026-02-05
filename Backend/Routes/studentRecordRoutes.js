const express = require("express");
const {
  addNewStudentController,
  displayAllRecordsController,
  EditStudentRecordController,
  deleteStudentRecordController,
  displayStudentController,
  displayByStudentIDController,
} = require("../controllers/studentRecordController");

const router = express.Router();

// Routes

// Add New Student Route

router.post("/addNewStudent", addNewStudentController);

// Display all Students Route

router.get("/getAllStudent", displayAllRecordsController);

// Display Student Details By id

// http://localhost:8000/api/v1/student/getStudentByID/69848c0ae619e4895818c610
router.get("/getStudentByID/:id", displayByStudentIDController);

// Search route
router.get("/searchStudent", displayStudentController);

// Edit Student Details By ID

router.put("/updateStudent/:id", EditStudentRecordController);

// Delete Student Details By ID

router.delete("/deleteStudent/:id", deleteStudentRecordController);

module.exports = router;
