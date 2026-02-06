import API from "./api";

// Get all students
export const getAllStudents = (params) => {
  return API.get("/student/getAllStudent", { params });
};

// Get student by ID
export const getStudentById = (id) => {
  return API.get(`/student/getStudentByID/${id}`);
};

// Add new student
export const addStudent = (formData) => {
  return API.post("/student/addNewStudent", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update student
export const updateStudent = (id, formData) => {
  return API.put(`/student/updateStudent/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update status

export const updateStudentStatus = (id, Status) => {
  return API.patch(`/student/updateStatus/${id}`, { Status });
};

// Delete student
export const deleteStudent = (id) => {
  return API.delete(`/student/deleteStudent/${id}`);
};

// Search student
export const searchStudent = (query) => {
  return API.get("/student/searchStudent", {
    params: { search: query },
  });
};

// Export CSV
export const exportStudents = () => {
  return API.get("/student/export", {
    responseType: "blob", // VERY important for files
  });
};
