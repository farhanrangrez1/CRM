import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "../features/Layouts/Navbar.jsx";
import Sidebar from "../features/Layouts/Sidebar.jsx";
import Dashbord from '../features/Employee/Dashbord/Dashbord';
import Job_History from '../features/Employee/Job_History/Job_History.jsx';
import ProjectList from '../features/Employee/ProjectList/ProjectList.jsx';
import PickTask from '../features/Employee/PickTask/PickTask.jsx';
import MyJobs from '../features/Employee/MyJobs/MyJobs.jsx';
import ProtectedRoute from "../Protecuted/Protecuted.jsx";
import TimeLogs from '../features/Employee/TimeLogs/TimeLogs.jsx';
import AddTimeLog from '../features/Employee/TimeLogs/AddTimeLog.jsx';
import Notification from '../features/Employee/Notiifcations/Notiifcations.jsx';
import Profile from '../features/Employee/Profile/Profile.jsx';
import SettingsPage from '../features/Employee/Settings/Settings.jsx';
import ChangePassword from '../features/Layouts/ChangePassword.jsx';
import UpdateProfile from '../features/Employee/Profile/UpdateProfile.jsx';

function Employee() {
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
            <Route path="dashboard" element={<ProtectedRoute><Dashbord /></ProtectedRoute>} />
            <Route path="/jobhistory" element={<ProtectedRoute><Job_History /></ProtectedRoute>} />
            <Route path="/projectList" element={<ProtectedRoute><ProjectList /></ProtectedRoute>} />
            <Route path="/picktask" element={<ProtectedRoute><PickTask /></ProtectedRoute>} />
            <Route path="/myJobs" element={<ProtectedRoute><MyJobs /></ProtectedRoute>} />
            <Route path="/TimeTracking" element={<ProtectedRoute><TimeLogs /></ProtectedRoute>} />
            <Route path="/AddTimeLog" element={<ProtectedRoute><AddTimeLog /></ProtectedRoute>} />
            <Route path="/Notification" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
            <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/Settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/changePassword" element={<ProtectedRoute><ChangePassword/></ProtectedRoute>} />
            <Route path="/UpdateProfile" element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Employee;
