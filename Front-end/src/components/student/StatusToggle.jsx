import React from "react";
import "./StatusToggle.css";

const StatusToggle = ({ status, onToggle }) => {
  const isActive = status === "Active";

  return (
    <button
      className={`status-toggle ${isActive ? "active" : "inactive"}`}
      onClick={onToggle}
    >
      {status}
    </button>
  );
};

export default StatusToggle;
