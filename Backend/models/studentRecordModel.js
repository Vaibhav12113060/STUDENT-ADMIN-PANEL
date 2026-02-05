const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    FullName: {
      type: String,
      required: [true, "Full Name is required"],
    },
    Email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    Gender: {
      type: String,
      enum: ["F", "M"],
      default: "F",
    },
    Status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    Profile: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740",
    },
    cloudinary_id: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Student", studentSchema);
