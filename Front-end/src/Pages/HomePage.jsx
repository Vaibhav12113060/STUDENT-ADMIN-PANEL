import React, { useEffect, useState } from "react";
import StudentTable from "../components/student/StudentTable";
import {
  getAllStudents,
  deleteStudent,
  updateStudentStatus,
  exportStudents,
} from "../services/adminServices";
import "./HomePage.css";

const HomePage = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const limit = 5;

  //  Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const { data } = await getAllStudents({
        search,
        page,
        limit,
      });

      setStudents(data.students);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, page]);

  //  Status toggle
  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      await updateStudentStatus(id, newStatus);

      setStudents((prev) =>
        prev.map((student) =>
          student._id === id ? { ...student, Status: newStatus } : student,
        ),
      );
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  //  Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      await deleteStudent(id);
      fetchStudents();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  //  Export CSV
  const handleExport = async () => {
    try {
      const res = await exportStudents();

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "students.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  return (
    <div className="home-page">
      {/* 🔹 Top bar */}
      {/* <div className="home-header">
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <button onClick={handleExport}>Export CSV</button>
      </div> */}
      <div className="home-header">
        <div className="header-inner">
          <input
            className="search-input"
            type="text"
            placeholder="Search by name, email.............."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <button className="export-btn" onClick={handleExport}>
            Export CSV
          </button>
        </div>
      </div>

      {/*  Table */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        <StudentTable
          students={students}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}

      {/*  Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;
