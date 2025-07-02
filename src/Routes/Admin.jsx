import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "../App.css";
import Navbar from "../features/Layouts/Navbar.jsx";
import Sidebar from "../features/Layouts/Sidebar.jsx";
import Dashbord from "../features/Admin/Dashbord/Dashbord.jsx";
import ClientManagement from "../features/Admin/ClientManagement/ClientManagement.jsx";
import AddClientManagement from "../features/Admin/ClientManagement/AddClientManagement.jsx";
import ViewdetailsClientManagement from "../features/Admin/ClientManagement/ViewdetailsClientManagement.jsx";
import CostEstimates from "../features/Admin/CostEstimates/CostEstimates.jsx";
import AddCostEstimates from "../features/Admin/CostEstimates/AddCostEstimates.jsx";
import Receivable from "../features/Admin/ReciveablePurchase/ReciveablePurchase.jsx";
import ReciveablePurchase from "../features/Admin/ReciveablePurchase/ReciveablePurchase.jsx";
import IssuablePurchase from "../features/Admin/IssuablePurchase/IssuablePurchase.jsx";
import AddIssuablePurchase from "../features/Admin/IssuablePurchase/AddIssuablePurchase.jsx";
import ProjectList from "../features/Admin/ProjectList/ProjectList.jsx";
import AddProjectList from "../features/Admin/ProjectList/AddProjectList.jsx";
import JobTracker from "../features/Admin/JobTracker/JobTracker.jsx";
import AddJobTracker from "../features/Admin/JobTracker/AddJobTracker.jsx";
import OvervieJobsTracker from "../features/Admin/JobTracker/OvervieJobsTracker.jsx";
import UpdateJobTracker from "../features/Admin/JobTracker/UpdateJobTracker.jsx";
import AddJobAssignment from "../features/Admin/JobTracker/AddJobAssignment.jsx";
import NewJobsList from "../features/Admin/NewJobsList/NewJobsList.jsx";
import InProgress from "../features/Admin/InProgress/InProgress.jsx";
import AddInProgress from "../features/Admin/InProgress/AddInProgress.jsx";
import Completed_Jobs from "../features/Admin/Completed_Jobs/Completed_Jobs.jsx";
import MyJobs from "../features/Admin/MyJobs/MyJobs.jsx";
import Completed_jobsView_job_details from "../features/Admin/Completed_Jobs/Completed_jobsView_job_details.jsx";
import MyJobsHolidayPackageDesign from "../features/Admin/MyJobs/MyJobsHolidayPackageDesign.jsx";
import MyJobs_Upload_Artwork from "../features/Admin/MyJobs/MyJobs_Upload_Artwork.jsx";
import TimeLogs from "../features/Admin/TimeLogs/TimeLogs.jsx";
import AddTimeLog from "../features/Admin/TimeLogs/AddTimeLog.jsx";
import Invoicing_Billing from "../features/Admin/Invoicing_Billing/Invoicing_Billing.jsx";
import AddInvoice from "../features/Admin/Invoicing_Billing/AddInvoice.jsx";
import TimesheetWorklog from "../features/Admin/TimesheetWorklog/TimesheetWorklog.jsx";
import AddTimesheetWorklog from "../features/Admin/TimesheetWorklog/AddTimesheetWorklog.jsx";
import Notiifcations from "../features/Admin/Notiifcations/Notiifcations.jsx";
import UserRoles from "../features/Admin/UserRoles/UserRoles.jsx";
import UserRoleModal from "../features/Admin/UserRoles/UserRoleModal.jsx";
import Settings from "../features/Admin/Settings/Settings.jsx";
import ProjectOverview from "../features/Admin/ProjectList/ProjectOverview.jsx";
import UpdateProjectLis from "../features/Admin/ProjectList/UpdateProjectLis.jsx";
import ProductionManager from "../features/Admin/ProductionManager.jsx/ProductionManager.jsx";
import AddProductionManager from "../features/Admin/ProductionManager.jsx/AddProductionManager.jsx";
import DesignerPanel from "../features/Admin/DesignerPanel/DesignerPanel.jsx";
import AddDesignerPanel from "../features/Admin/DesignerPanel/AddDesignerPanel.jsx";
import OvervieMyJobs from "../features/Admin/MyJobs/OvervieMyJobs.jsx";
import OvervieJobsProject from "../features/Admin/ProjectList/ProjectTabs/OvervieJobsProject.jsx";
import Profile from "../features/Admin/Profile/Profile.jsx";
import Extrahr from "../features/Admin/TimeLogs/Extrahr.jsx";
import  DProjectInProgress from "../features/Admin/Dashbord/DProjectInProgress.jsx";
import DTodayJobsDue from "../features/Admin/Dashbord/DTodayJobsDue.jsx";
import DCostEstimates from "../features/Admin/Dashbord/DCostEstimates.jsx";
import Reports from "../features/Admin/Reports/Reports.jsx";
import ProtectedRoute from "../Protecuted/Protecuted.jsx";
import 'react-toastify/dist/ReactToastify.css';
import DCompletedProject from "../features/Admin/Dashbord/DCompletedProject.jsx";
import DJobsInProgress from "../features/Admin/Dashbord/DJobsInProgress.jsx";
import ChangePassword from "../features/Layouts/ChangePassword.jsx";
import UpdateProfile from "../features/Admin/Profile/UpdateProfile.jsx";

function Admin() {
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
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashbord />
                </ProtectedRoute>
              }
            />
            <Route path="/DJobsInProgress" element={<ProtectedRoute><DJobsInProgress/></ProtectedRoute>} />
            <Route path="/DProjectInProgress" element={<ProtectedRoute>< DProjectInProgress /></ProtectedRoute>} />
             <Route path="/DCompletedProject" element={<ProtectedRoute><DCompletedProject/></ProtectedRoute>} />
            <Route path="/DTodayJobsDue" element={<ProtectedRoute><DTodayJobsDue /></ProtectedRoute>} />
            <Route path="/DCostEstimates" element={<ProtectedRoute><DCostEstimates /></ProtectedRoute>} />

            <Route path="/clientManagement" element={<ProtectedRoute><ClientManagement /></ProtectedRoute>} />
            <Route path="/AddClientManagement" element={<ProtectedRoute><AddClientManagement /></ProtectedRoute>} />
            <Route path="/ViewdetailsClientManagement" element={<ProtectedRoute><ViewdetailsClientManagement /></ProtectedRoute>} />
            <Route path="/CostEstimates" element={<ProtectedRoute><CostEstimates /></ProtectedRoute>} />
            <Route path="/AddCostEstimates" element={<ProtectedRoute><AddCostEstimates /></ProtectedRoute>} />
            <Route path="/duplicate/AddCostEstimates/:id" element={<ProtectedRoute><AddCostEstimates /></ProtectedRoute>} />
            <Route path="/receivable" element={<ProtectedRoute><ReciveablePurchase /></ProtectedRoute>} />
            <Route path="/IssuablePurchase" element={<ProtectedRoute><IssuablePurchase /></ProtectedRoute>} />
            <Route path="/AddIssuablePurchase" element={<ProtectedRoute><AddIssuablePurchase /></ProtectedRoute>} />
            <Route path="/projectList" element={<ProtectedRoute><ProjectList /></ProtectedRoute>} />
            <Route path="/AddProjectList" element={<ProtectedRoute><AddProjectList /></ProtectedRoute>} />
            <Route path="/OvervieJobsProject" element={<ProtectedRoute><OvervieJobsProject /></ProtectedRoute>} />
            <Route path="/ProjectOverview/:id" element={<ProtectedRoute><ProjectOverview /></ProtectedRoute>} />
            <Route path="/UpdateProjectLis" element={<ProtectedRoute><UpdateProjectLis /></ProtectedRoute>} />
            <Route path="/jobTracker" element={<ProtectedRoute><JobTracker /></ProtectedRoute>} />
            <Route path="/AddJobTracker/:id" element={<ProtectedRoute><AddJobTracker /></ProtectedRoute>} />
            <Route path="/OvervieJobsTracker" element={<ProtectedRoute><OvervieJobsTracker /></ProtectedRoute>} />
            <Route path="/updateJobTracker" element={<ProtectedRoute><UpdateJobTracker /></ProtectedRoute>} />
            <Route path="/AddJobAssignment" element={<ProtectedRoute><AddJobAssignment /></ProtectedRoute>} />
            <Route path="/newJobsList" element={<ProtectedRoute><NewJobsList /></ProtectedRoute>} />
            <Route path="/inProgress" element={<ProtectedRoute><InProgress /></ProtectedRoute>} />
            <Route path="/AddInProgress" element={<ProtectedRoute><AddInProgress /></ProtectedRoute>} />
            <Route path="/completedJobs" element={<ProtectedRoute><Completed_Jobs /></ProtectedRoute>} />
            <Route path="/jobsView" element={<ProtectedRoute><Completed_jobsView_job_details /></ProtectedRoute>} />
            <Route path="/MyJobs" element={<ProtectedRoute><MyJobs /></ProtectedRoute>} />
            <Route path="/OvervieMyJobs" element={<ProtectedRoute><OvervieMyJobs /></ProtectedRoute>} />
            <Route path="/MyJobsHolidayPackageDesign" element={<ProtectedRoute><MyJobsHolidayPackageDesign /></ProtectedRoute>} />
            <Route path="/MyJobs_Upload_Artwork" element={<ProtectedRoute><MyJobs_Upload_Artwork /></ProtectedRoute>} />
            <Route path="/TimeLogs" element={<ProtectedRoute><TimeLogs /></ProtectedRoute>} />
            <Route path="/AddTimeLog" element={<ProtectedRoute><AddTimeLog /></ProtectedRoute>} />
            <Route path="/Invoicing_Billing" element={<ProtectedRoute><Invoicing_Billing /></ProtectedRoute>} />
            <Route path="/AddInvoice" element={<ProtectedRoute><AddInvoice /></ProtectedRoute>} />
            <Route path="/TimesheetWorklog" element={<ProtectedRoute><TimesheetWorklog /></ProtectedRoute>} />
            <Route path="/AddTimesheetWorklog" element={<ProtectedRoute><AddTimesheetWorklog /></ProtectedRoute>} />
            <Route path="/Notiifcations" element={<ProtectedRoute><Notiifcations /></ProtectedRoute>} />
            <Route path="/Reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/UserRoles" element={<ProtectedRoute><UserRoles /></ProtectedRoute>} />
            <Route path="/UserRoleModal" element={<ProtectedRoute><UserRoleModal /></ProtectedRoute>} />
            <Route path="/ProductionManager" element={<ProtectedRoute><ProductionManager /></ProtectedRoute>} />
            <Route path="/AddProductionManager" element={<ProtectedRoute><AddProductionManager /></ProtectedRoute>} />
            <Route path="/DesignerPanel" element={<ProtectedRoute><DesignerPanel /></ProtectedRoute>} />
            <Route path="/AddDesignerPanel" element={<ProtectedRoute><AddDesignerPanel /></ProtectedRoute>} />
            <Route path="/Settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/Extrahr" element={<ProtectedRoute><Extrahr /></ProtectedRoute>} />
            <Route path="/ChangePassword" element={<ProtectedRoute><ChangePassword/></ProtectedRoute>} />
            <Route path="/UpdateProfile" element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Admin;
