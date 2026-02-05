const express = require("express");
const {
  addNewStudentController,
  displayAllRecordsController,
  EditStudentRecordController,
  deleteStudentRecordController,
  displayStudentController,
  displayByStudentIDController,
  updateStudentStatusController,
} = require("../controllers/studentRecordController");

const upload = require("../middlewares/uploadMiddleware");
const exportStudentsController = require("../controllers/exportstudentsController");

const router = express.Router();

// Routes

// Add New Student Route (Profile Image Mandatory)

// router.post("/addNewStudent", addNewStudentController);

router.post(
  "/addNewStudent",
  upload.single("Profile"),
  addNewStudentController,
);

// Display all Students Route

/*

GET /getAllStudent
GET /getAllStudent?search=vaib
GET /getAllStudent?page=2&limit=5
GET /getAllStudent?search=vaib&page=1&limit=5

*/

router.get("/getAllStudent", displayAllRecordsController);

// Display Student Details By id

// http://localhost:8000/api/v1/student/getStudentByID/69848c0ae619e4895818c610
router.get("/getStudentByID/:id", displayByStudentIDController);

// Search route
router.get("/searchStudent", displayStudentController);

// Edit Student Details By ID (Profile Image Optional)

router.put(
  "/updateStudent/:id",
  upload.single("Profile"),
  EditStudentRecordController,
);

// Update Student Status By id

router.patch("/updateStatus/:id", updateStudentStatusController);

// Delete Student Details By ID

router.delete("/deleteStudent/:id", deleteStudentRecordController);

// Export Students Records into CSV

router.get("/export", exportStudentsController);

module.exports = router;
