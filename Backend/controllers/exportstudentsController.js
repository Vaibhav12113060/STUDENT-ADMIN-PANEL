const studentModel = require("../models/studentRecordModel");
const generateStudentExcel = require("../utils/excelGenerator");

const exportStudentsController = async (req, res) => {
  try {
    const students = await studentModel
      .find()
      .select("FullName Email Gender Status createdAt");

    const workbook = await generateStudentExcel(students);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader("Content-Disposition", "attachment; filename=students.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error exporting students",
      error: error.message,
    });
  }
};

module.exports = exportStudentsController;
