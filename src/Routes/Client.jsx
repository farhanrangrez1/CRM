import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import EmployeeDashboard from '../features/Client/Dashbord/Dashbord';
import Navbar from '../features/Layouts/Navbar';
import Sidebar from '../features/Layouts/Sidebar';

function Client() {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const location = useLocation();
  const hideLayout =
    location.pathname === "/" || location.pathname.toLowerCase() === "/signup";
  return (
    <div className="Main-App">
      {!hideLayout && <Navbar toggleSidebar={toggleSidebar} />}
      <div className={`Main-App-container ${hideLayout ? "no-sidebar" : ""}`}>
        {!hideLayout && (
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        )}
        <div className="Main-App-Content">
          <Routes>
            <Route path="/dashboard" element={<EmployeeDashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Client