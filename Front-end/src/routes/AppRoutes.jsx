import React from "react";
import { Route, Routes } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import HomePage from "../Pages/HomePage";
import AddNewStudentPage from "../Pages/AddNewStudentPage";
import EditStudentPage from "../Pages/EditStudentPage";
import DetailedStudent from "../Pages/DetailedStudentPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddNewStudentPage />} />
        <Route path="/student/:id" element={<DetailedStudent />} />
        <Route path="/edit/:id" element={<EditStudentPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
