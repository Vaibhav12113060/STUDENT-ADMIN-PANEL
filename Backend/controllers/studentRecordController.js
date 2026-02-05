const studentModel = require("../models/studentRecordModel");
const mongoose = require("mongoose");

// Add new Student Record

const addNewStudentController = async (req, res) => {
  try {
    const { FullName, Email, Gender, Status, Profile } = req.body;

    // Validation

    if (!FullName || !Email) {
      return res.status(400).send({
        success: false,
        message: "FullName & Email are required",
      });
    }

    // check already exist or not

    const existingStudent = await studentModel.findOne({ Email });

    if (existingStudent) {
      return res.status(409).send({
        success: false,
        message: "Student with this Email ID already exist",
      });
    }

    // Create New Record
    const new_record = await studentModel.create({
      FullName,
      Email,
      Gender,
      Status,
      Profile,
    });

    // Success Message
    res.status(200).send({
      success: true,
      message: "Congratulations, New Student successfully registered !!!",
      new_record,
    });
  } catch (error) {
    return res.Status(500).send({
      success: false,
      message: "Error in Add New Student Controller API",
      error: error.message,
    });
  }
};

// Display All Student Records

const displayAllRecordsController = async (req, res) => {
  try {
    const students = await studentModel.find();

    if (!students || (await students).length === 0) {
      return res.status(404).send({
        success: false,
        message: "No User is there",
      });
    }

    res.status(200).send({
      success: true,
      message: "Successfully fetched all students details",
      students,
      totalStudent: (await students).length,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in Display All Records Controller API",
      error: error.message,
    });
  }
};

const displayByStudentIDController = async (req, res) => {
  try {
    const student_id = req.params.id;

    // Validating Student ID
    if (!mongoose.Types.ObjectId.isValid(student_id)) {
      return res.status(401).send({
        success: false,
        message: "Invalid Student ID",
      });
    }

    const student = await studentModel.findById(student_id);

    if (!student) {
      return res.status(404).send({
        success: false,
        message: "Student Not Found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Successfully fetched the student details",
      student,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in Display By Student ID Controller API",
      error: error.message,
    });
  }
};

const displayStudentController = async (req, res) => {
  try {
    const searchValue = req.query.search?.trim();

    if (!searchValue) {
      return res.status(400).send({
        success: false,
        message: "Search query is required",
      });
    }

    const words = searchValue.split(" ");

    const students = await studentModel.find({
      $and: words.map((word) => ({
        FullName: { $regex: word, $options: "i" },
      })),
    });

    if (students.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Student Not Found",
      });
    }

    res.status(200).send({
      success: true,
      students,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Search error",
      error: error.message,
    });
  }
};

const EditStudentRecordController = async (req, res) => {
  try {
    const student_id = req.params.id;

    // Validating Student ID
    if (!mongoose.Types.ObjectId.isValid(student_id)) {
      return res.status(401).send({
        success: false,
        message: "Invalid Student ID",
      });
    }

    const { FullName, Email, Gender, Status, Profile } = req.body;

    // validate Stduent
    const student = await studentModel.findById(student_id);

    if (!student) {
      return res.status(404).send({
        success: false,
        message: "Student with this ID does not Exist",
      });
    }

    // Updating the field values
    if (FullName) student.FullName = FullName;
    if (Email) student.Email = Email;
    if (Gender) student.Gender = Gender;
    if (Status) student.Status = Status;
    if (Profile) student.Profile = Profile;

    await student.save();

    res.status(200).send({
      success: true,
      message: "Student Details Successfully Updated!!",
      student,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in Edit Stduent Record Controller API",
      error: error.message,
    });
  }
};

const deleteStudentRecordController = async (req, res) => {
  try {
    const student_id = req.params.id;

    // Validating Student ID
    if (!mongoose.Types.ObjectId.isValid(student_id)) {
      return res.status(401).send({
        success: false,
        message: "Invalid Student ID",
      });
    }

    const deleteStudent = await studentModel.findByIdAndDelete(student_id);

    if (!deleteStudent) {
      res.status(404).send({
        success: false,
        message: "No Student Found with this ID",
      });
    }

    res.status(200).send({
      success: true,
      message: `Successfully deleted the Record of Student ID: ${student_id}`,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in Delete Student Record Controller API",
      error: error.message,
    });
  }
};

module.exports = {
  addNewStudentController,
  displayAllRecordsController,
  displayStudentController,
  EditStudentRecordController,
  deleteStudentRecordController,
  displayByStudentIDController,
};
