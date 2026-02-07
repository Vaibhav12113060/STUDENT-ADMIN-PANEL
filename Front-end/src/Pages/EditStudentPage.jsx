import "./EditStudentPage.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentById, updateStudent } from "../services/adminServices";

const EditStudentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Gender: "M",
    Phone: "",
    Location: "",
    Course: "",
    DOB: "",
  });

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchStudent = async () => {
  //     const res = await getStudentById(id);
  //     setForm(res.data);
  //   };
  //   fetchStudent();
  // }, [id]);

  useEffect(() => {
    const fetchStudent = async () => {
      const res = await getStudentById(id);
      const student = res.data.student;

      const nameParts = student.FullName?.split(" ") || [];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setForm({
        FirstName: firstName,
        LastName: lastName,
        Email: student.Email || "",
        Gender: student.Gender || "M",
        Phone: student.Phone || "",
        Location: student.Location || "",
        Course: student.Course || "",
        DOB: student.DOB
          ? new Date(student.DOB).toISOString().split("T")[0]
          : "",
      });
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });
    if (profile) formData.append("Profile", profile);

    try {
      await updateStudent(id, formData);
      navigate("/");
    } catch (err) {
      console.error("Update failed", err);
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
        <h3>Edit Student</h3>

        <div className="form-row">
          <label>
            First Name
            <input
              type="text"
              name="FirstName"
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
            value={form.Email}
            onChange={handleChange}
          />
        </label>

        <label>
          Gender
          <select name="Gender" value={form.Gender} onChange={handleChange}>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </label>

        <label>
          Phone
          <input
            type="text"
            name="Phone"
            value={form.Phone}
            onChange={handleChange}
          />
        </label>

        <label>
          Location
          <input
            type="text"
            name="Location"
            value={form.Location}
            onChange={handleChange}
          />
        </label>

        <label>
          Course
          <input
            type="text"
            name="Course"
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
          Profile Image (optional)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfile(e.target.files[0])}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Student"}
        </button>
      </form>
    </div>
  );
};

export default EditStudentPage;
