import React from "react";
import Header from "./Header";

import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Header />
      {/* <main style={{ padding: "20px" }}>
        <Outlet />
      </main> */}
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
