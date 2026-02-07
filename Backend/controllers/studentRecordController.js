const studentModel = require("../models/studentRecordModel");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinaryConfig");
const upload = require("../middlewares/uploadMiddleware");
const fs = require("fs");

// Add new Student Record

const addNewStudentController = async (req, res) => {
  try {
    const {
      FirstName,
      LastName,
      Email,
      Gender,
      Status,
      Phone,
      Location,
      Course,
      DOB,
    } = req.body;

    // Validation

    if (!FirstName || !LastName || !Email) {
      return res.status(400).send({
        success: false,
        message: "First Name, Last Name & Email are required",
      });
    }

    const FullName = `${FirstName.trim()} ${LastName.trim()}`;

    // check for required file
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "Profile image is required",
      });
    }

    // check already exist or not

    const existingStudent = await studentModel.findOne({ Email });

    if (existingStudent) {
      // Delete the local file after upload from the profiles folder because when we create new student then it also stores into local storage
      fs.unlink(req.file.path, (err) => {
        if (err) console.log("Failed to delete local file:", err);
      });

      return res.status(409).send({
        success: false,
        message: "Student with this Email ID already exist",
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profiles",
    });

    // Delete the local file after upload from the profiles folder because when we create new student then it also stores into local storage

    fs.unlink(req.file.path, (err) => {
      if (err) console.log("Failed to delete local file:", err);
    });

    // Create New Record
    // const new_record = await studentModel.create({
    //   FullName,
    //   Email,
    //   Gender,
    //   Status,
    //   Profile: result.secure_url,
    //   cloudinary_id: result.public_id,
    // });

    const new_record = await studentModel.create({
      FullName,
      Email,
      Gender,
      Status,
      Phone,
      Location,
      Course,
      DOB,
      Profile: result.secure_url,
      cloudinary_id: result.public_id,
    });

    // Success Message
    res.status(200).send({
      success: true,
      message: "Congratulations, New Student successfully registered !!!",
      new_record,
    });
  } catch (error) {
    //  Cleanup if something crashes

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).send({
      success: false,
      message: "Error in Add New Student Controller API",
      error: error.message,
    });
  }
};

const displayAllRecordsController = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const query = search
      ? {
          $or: [
            { FullName: { $regex: search, $options: "i" } },
            { Email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const students = await studentModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalStudents = await studentModel.countDocuments(query);

    res.status(200).send({
      success: true,
      students,
      totalStudents,
      currentPage: page,
      totalPages: Math.ceil(totalStudents / limit),
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching students",
      error: error.message,
    });
  }
};

// Display Student Details By ID

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

// Display Student Details By Name
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

// Modify Student Details

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

    const {
      FirstName,
      LastName,
      Email,
      Gender,
      Status,
      Phone,
      Location,
      Course,
      DOB,
    } = req.body;

    // Check existing email

    if (Email && Email !== student.Email) {
      const emailExists = await studentModel.findOne({ Email });
      if (emailExists) {
        return res.status(409).send({
          success: false,
          message: "Email already in use",
        });
      }
    }

    // validate Stduent
    const student = await studentModel.findById(student_id);

    if (!student) {
      return res.status(404).send({
        success: false,
        message: "Student with this ID does not Exist",
      });
    }

    // Updating the field values
    if (FirstName || LastName) {
      const first = FirstName || student.FullName.split(" ")[0];
      const last = LastName || student.FullName.split(" ").slice(1).join(" ");

      student.FullName = `${first} ${last}`.trim();
    }

    if (Email) student.Email = Email;
    if (Gender) student.Gender = Gender;
    if (Status) student.Status = Status;
    if (Phone) student.Phone = Phone;
    if (Location) student.Location = Location;
    if (Course) student.Course = Course;
    if (DOB) student.DOB = DOB;

    // If new image uploaded → replace
    // if (req.file) {
    //   const result = await cloudinary.uploader.upload(req.file.path, {
    //     folder: "profiles",
    //   });
    //   student.Profile = result.secure_url;
    // }

    if (req.file) {
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profiles",
      });

      // Delete local file (VERY IMPORTANT)
      fs.unlink(req.file.path, (err) => {
        if (err) console.log("Failed to delete local file:", err);
      });

      // Delete OLD Cloudinary image
      if (student.cloudinary_id) {
        await cloudinary.uploader.destroy(student.cloudinary_id);
      }

      // Save new image
      student.Profile = result.secure_url;
      student.cloudinary_id = result.public_id;
    }

    // update into the record
    await student.save();

    res.status(200).send({
      success: true,
      message: "Student Details Successfully Updated!!",
      student,
    });
  } catch (error) {
    //  Cleanup if something crashes

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).send({
      success: false,
      message: "Error in Edit Stduent Record Controller API",
      error: error.message,
    });
  }
};

// Update Student Status

const updateStudentStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { Status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid Student ID",
      });
    }

    if (!Status) {
      return res.status(400).send({
        success: false,
        message: "Status is required",
      });
    }

    const student = await studentModel.findByIdAndUpdate(
      id,
      { Status },
      { new: true },
    );

    if (!student) {
      return res.status(404).send({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Status updated successfully",
      student,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating status",
      error: error.message,
    });
  }
};

//  Delete Student Details

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

    if (deleteStudent.cloudinary_id) {
      await cloudinary.uploader.destroy(deleteStudent.cloudinary_id);
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
  updateStudentStatusController,
  deleteStudentRecordController,
  displayByStudentIDController,
};
