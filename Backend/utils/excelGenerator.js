const ExcelJS = require("exceljs");

const generateStudentExcel = async (students) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Students");

  worksheet.columns = [
    { header: "Full Name", key: "FullName", width: 25 },
    { header: "Email", key: "Email", width: 30 },
    { header: "Gender", key: "Gender", width: 10 },
    { header: "Status", key: "Status", width: 15 },
    { header: "Created At", key: "createdAt", width: 25 },
  ];

  students.forEach((student) => {
    worksheet.addRow(student.toObject());
  });

  return workbook;
};

module.exports = generateStudentExcel;
