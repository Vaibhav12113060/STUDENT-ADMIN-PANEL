import React from "react";
import StudentRow from "./StudentRow";
import "./StudentTable.css";

const StudentTable = ({ students, onDelete, onStatusChange }) => {
  return (
    <table className="student-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Gender</th>
          <th>Status</th>
          <th>Profile</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {students.length === 0 ? (
          <tr>
            <td colSpan="6" className="no-data">
              No Students Found
            </td>
          </tr>
        ) : (
          students.map((student) => (
            <StudentRow
              key={student._id}
              student={student}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default StudentTable;
