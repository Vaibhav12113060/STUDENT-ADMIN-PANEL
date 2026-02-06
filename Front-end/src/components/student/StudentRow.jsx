import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusToggle from "./StatusToggle";
import "./StudentRow.css";

const StudentRow = ({ student, onDelete, onStatusChange }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <tr className="student-row">
      <td data-label="Name">{student.FullName}</td>
      <td data-label="Email">{student.Email}</td>
      <td data-label="Gender">{student.Gender}</td>

      <td data-label="Status">
        <StatusToggle
          status={student.Status}
          onToggle={() => onStatusChange(student._id, student.Status)}
        />
      </td>

      <td data-label="Profile">
        <img
          src={student.Profile}
          alt="profile"
          className="student-profile-img"
        />
      </td>

      <td data-label="Action" className="action-cell">
        <div className="dropdown">
          <button className="dropdown-btn" onClick={() => setOpen(!open)}>
            Action ▾
          </button>

          {open && (
            <div className="dropdown-menu">
              <button onClick={() => navigate(`/student/${student._id}`)}>
                View
              </button>
              <button onClick={() => navigate(`/edit/${student._id}`)}>
                Edit
              </button>
              <button className="danger" onClick={() => onDelete(student._id)}>
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default StudentRow;
