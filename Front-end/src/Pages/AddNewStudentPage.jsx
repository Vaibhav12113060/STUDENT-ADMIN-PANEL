import "./AddNewStudentPage.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addStudent } from "../services/adminServices";

const AddNewStudentPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Gender: "F",
    Phone: "",
    Location: "",
    Course: "",
    DOB: "",
  });

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile) {
      alert("Profile image is required");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });
    formData.append("Profile", profile);

    try {
      await addStudent(formData);
      navigate("/");
    } catch (err) {
      console.error("Add student failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <form className="student-card" onSubmit={handleSubmit}>
        <h3>Add Student</h3>

        <div className="form-row">
          <label>
            First Name
            <input
              type="text"
              name="FirstName"
              placeholder="e.g. Rahul"
              value={form.FirstName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Last Name
            <input
              type="text"
              name="LastName"
              placeholder="e.g. Sharma"
              value={form.LastName}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <label>
          Email
          <input
            type="email"
            name="Email"
            placeholder="e.g. rahul.sharma@gmail.com"
            value={form.Email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Gender
          <select name="Gender" value={form.Gender} onChange={handleChange}>
            <option value="F">Female</option>
            <option value="M">Male</option>
          </select>
        </label>

        <label>
          Phone
          <input
            type="text"
            name="Phone"
            placeholder="10-digit mobile number (e.g. 9876543210)"
            value={form.Phone}
            onChange={handleChange}
          />
        </label>

        <label>
          Location
          <input
            type="text"
            name="Location"
            placeholder="City, State (e.g. Bengaluru, KA)"
            value={form.Location}
            onChange={handleChange}
          />
        </label>

        <label>
          Course
          <input
            type="text"
            name="Course"
            placeholder="e.g. Computer Science"
            value={form.Course}
            onChange={handleChange}
          />
        </label>

        <label>
          Date of Birth
          <input
            type="date"
            name="DOB"
            value={form.DOB}
            onChange={handleChange}
          />
        </label>

        <label>
          Profile Image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfile(e.target.files[0])}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Student"}
        </button>
      </form>
    </div>
  );
};

export default AddNewStudentPage;
