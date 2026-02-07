import "./DetailedStudentPage.css";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentById } from "../services/adminServices";

const DetailedStudentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [showImage, setShowImage] = useState(false); // 🔹 NEW (only addition)

  useEffect(() => {
    const fetchStudent = async () => {
      const { data } = await getStudentById(id);
      setStudent(data.student);
    };
    fetchStudent();
  }, [id]);

  const formatDOB = (dob) => {
    if (!dob) return "-";
    const date = new Date(dob);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!student) return <p className="loading">Loading...</p>;

  return (
    <div className="view-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="view-card">
        {/* ===== Profile Header ===== */}
        <div className="profile-header">
          <img
            src={student.Profile}
            alt="Profile"
            className="profile-img"
            onClick={() => setShowImage(true)} // 🔹 NEW
          />

          <h2>{student.FullName}</h2>

          <span className={`status-badge ${student.Status}`}>
            {student.Status}
          </span>
        </div>

        {/* ===== Details Grid ===== */}
        <div className="details-grid">
          <div className="detail-box">
            <span>Email</span>
            <p>{student.Email}</p>
          </div>

          <div className="detail-box">
            <span>Gender</span>
            <p>{student.Gender}</p>
          </div>

          <div className="detail-box">
            <span>Phone</span>
            <p>{student.Phone || "-"}</p>
          </div>

          <div className="detail-box">
            <span>Location</span>
            <p>{student.Location || "-"}</p>
          </div>

          <div className="detail-box">
            <span>Course</span>
            <p>{student.Course || "-"}</p>
          </div>

          <div className="detail-box">
            <span>Date of Birth</span>
            <p>{formatDOB(student.DOB)}</p>
          </div>
        </div>
      </div>

      {/* ===== Image Preview Modal (NEW, isolated) ===== */}
      {showImage && (
        <div className="image-modal" onClick={() => setShowImage(false)}>
          <span className="close-btn" onClick={() => setShowImage(false)}>
            ×
          </span>

          <img
            src={student.Profile}
            alt="Full Profile"
            className="modal-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default DetailedStudentPage;
