// src/config/menuConfig.js

import {
  FaHome,
  FaFileInvoiceDollar,
  FaShoppingCart,
  FaProjectDiagram,
  FaIndustry,
  FaPencilRuler,
  FaFileAlt,
  FaClock,
  FaBell,
  FaChartLine,
  FaUsersCog,
  FaCog,
  FaTasks,
  FaClipboardList,
  FaCheckCircle,
  FaHistory,
  FaUsers,
  FaUserCircle,
  FaSitemap
} from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";
import { FaDiagramProject } from "react-icons/fa6";
import { FaRegBell } from "react-icons/fa";

// Admin Menu
// export const adminMenuItems = [
//   {
//     title: "Dashboard",
//     icon: <FaHome className="menu-icon" />,
//     path: "/admin/dashboard",
//   },
//   {
//     title: "Praposal",
//     icon: <FaSitemap className="menu-icon" />,
//     path: "/admin/LeadFlow",
//   },
//   {
//     title: "Projects & Jobs",
//     icon: <FaProjectDiagram className="menu-icon" />,
//     submenu: [
//       { title: "Project View", path: "/admin/projectView" },
//       { title: "Temp Poles", path: "/admin/TempPoles" },
//       { title: "Projects Details", path: "/admin/projectList" },
//       // { title: "Job Tracker", path: "/admin/JobTracker" }
//     ],
//   },
//   {
//     title: "Production",
//     icon: <FaIndustry className="menu-icon" />,
//     submenu: [
//       { title: "Assign Job", path: "/admin/newJobsList" },
//       { title: "In Progress", path: "/admin/inProgress" },
//       { title: "Completed", path: "/admin/completedJobs" },
//     ],
//   },
//   // {
//   //   title: "Designer Panel",
//   //   icon: <FaPencilRuler className="menu-icon" />,
//   //   submenu: [
//   //     { title: "My Jobs", path: "/admin/MyJobs" },
//   //     { title: "Time Logs", path: "/admin/TimeLogs" },
//   //   ],
//   // },
//   {
//     title: "Cost Estimates",
//     icon: <FaFileInvoiceDollar className="menu-icon" />,
//     path: "/admin/CostEstimates",
//   },
//   // {
//   //   title: "Purchase Orders",
//   //   icon: <FaShoppingCart className="menu-icon" />,
//   //   submenu: [
//   //     { title: "Receivable POs", path: "/admin/receivable" },
//   //     // { title: "Issuable POs", path: "/admin/IssuablePurchase" },
//   //   ],
//   // },
//   {
//     title: "Invoicing & Billing",
//     icon: <FaFileAlt className="menu-icon" />,
//     path: "/admin/Invoicing_Billing",
//   },
//   // {
//   //   title: "Timesheet & Worklog",
//   //   icon: <FaClock className="menu-icon" />,
//   //   path: "/admin/TimesheetWorklog",
//   // },
//   {
//     title: "Client/Supplier",
//     icon: <FaUsersCog className="menu-icon" />,
//     path: "/admin/clientManagement",
//   },
//   {
//     title: "Reports & Analytics",
//     icon: <FaChartLine className="menu-icon" />,
//     path: "/admin/Reports",
//   },
//   {
//     title: "User Permissions",
//     icon: <FaUsersCog className="menu-icon" />,
//     path: "/admin/UserRoles",
//   },
//   {
//     title: "Notifications",
//     icon: <FaBell className="menu-icon" />,
//     path: "/admin/Notiifcations",
//   },
//   {
//     title: "Profile",
//     icon: <FaUserCircle className="menu-icon" />,
//     path: "/admin/profile",
//   },
//   {
//     title: "Settings",
//     icon: <FaCog className="menu-icon" />,
//     path: "/admin/Settings",
//   },
// ];

export const adminMenuItems = [
  {
    title: "Dashboard",
    icon: <FaHome className="menu-icon" />,
    path: "/admin/dashboard"
  },
  {
    title: "Proposal",
    icon: <FaSitemap className="menu-icon" />,
    path: "/admin/LeadFlow",
    permissionKey: "proposal",
  },
  // {
  //   title: "Projects & Jobs",
  //   icon: <FaProjectDiagram className="menu-icon" />,
  //   permissionKey: "projectsAndJobs",
  //   submenu: [
  //     { title: "Project View", path: "/admin/projectView" },
  //     { title: "Temp Poles", path: "/admin/TempPoles" },
  //     { title: "Projects Details", path: "/admin/projectList" },
  //   ],
  // },
  {
    title: "Projects & Jobs",
    icon: <FaProjectDiagram className="menu-icon" />,
    permissionKey: "projectsAndJobs",
    submenu: [
      { title: "Project View", path: "/admin/projectView", permissionKey: "projectView" },
      { title: "Temp Poles", path: "/admin/TempPoles", permissionKey: "tempPoles" },
      // { title: "Projects Details", path: "/admin/projectList", permissionKey: "projectsDetails" },
    ],
  },
  {
    title: "Tasks",
    icon: <FaIndustry className="menu-icon" />,
    permissionKey: "tasks",
    submenu: [
      { title: "View all Task", path: "/admin/newJobsList", permissionKey: "assignJob" },
      { title: "In Progress", path: "/admin/inProgress", permissionKey: "inProgress" },
      { title: "Completed", path: "/admin/completedJobs", permissionKey: "completed" },
    ],
  },
  // {
  //   title: "Cost Estimates",
  //   icon: <FaFileInvoiceDollar className="menu-icon" />,
  //   path: "/admin/CostEstimates",
  // },
  // {
  //   title: "Invoicing & Billing",
  //   icon: <FaFileAlt className="menu-icon" />,
  //   path: "/admin/Invoicing_Billing",
  //   permissionKey: "invoiceAndBilling",
  // },
  {
    title: "Client / Supplier",
    icon: <FaUsersCog className="menu-icon" />,
    path: "/admin/clientManagement",
    permissionKey: "client",
  },
  // {
  //   title: "Reports & Analytics",
  //   icon: <FaChartLine className="menu-icon" />,
  //   path: "/admin/Reports",
  //   permissionKey: "reports",
  // },
  {
    title: "User / Employee",
    icon: <FaUsersCog className="menu-icon" />,
    path: "/admin/UserRoles",
    permissionKey: "user",
  },
  // {
  //   title: "Notifications",
  //   icon: <FaBell className="menu-icon" />,
  //   path: "/admin/Notiifcations",
  // },
  {
    title: "Profile",
    icon: <FaUserCircle className="menu-icon" />,
    path: "/admin/profile",
  },
  // {
  //   title: "Settings",
  //   icon: <FaCog className="menu-icon" />,
  //   path: "/admin/Settings",
  // },
];


//Employee Menu

export const employeeMenuItems = [
  {
    title: "Employee Dashboard",
    icon: <FaHome className="menu-icon" />,
    path: "/employee/dashboard",
  },
  {
    title: "My Tasks",
    icon: <FaTasks className="menu-icon" />,
    path: "/employee/myJobs",
  },
  {
    title: "Time Tracking",
    icon: <FaClock className="menu-icon" />,
    path: "/employee/TimeTracking",
  },
  // {
  //   title: "Pick Task",
  //   icon: <FaClipboardList className="menu-icon" />,
  //   path: "/employee/picktask",
  // },
  // {
  //   title: "Submit Task",
  //   icon: <FaCheckCircle className="menu-icon" />,
  //   path: "/submittask",
  // },
  {
    title: "View Project Details",
    icon: <FaProjectDiagram className="menu-icon" />,
    path: "/employee/projectList",
  },
  {
    title: "Job History",
    icon: <FaHistory className="menu-icon" />,
    path: "/employee/jobhistory",
  },

  {
    title: "Notifications",
    icon: <FaBell className="menu-icon" />,
    path: "/employee/Notification",
  },
  {
    title: "Profile",
    icon: <FaUserCircle className="menu-icon" />,
    path: "/employee/Profile",
  },

  {
    title: "Settings",
    icon: <FaCog className="menu-icon" />,
    path: "/employee/Settings",
  },
];

// Client Menu
export const clientMenuItems = [
  {
    title: "Dashboard",
    icon: <FaHome className="menu-icon" />,
    path: "/client/dashboard",
  },
  {
    title: "Select Project",
    icon: <FaProjectDiagram className="menu-icon" />,
    path: "/employee/projectList",
  },
  {
    title: "Select Job",
    icon: <FaUsersLine className="menu-icon" />,
    path: "/admin/ProjectOverview",
  },
  {
    title: "Notifications",
    icon: <FaBell className="menu-icon" />,
    path: "/employee/Notification",
  },
  {
    title: "Settings",
    icon: <FaCog className="menu-icon" />,
    path: "/admin/Settings",
  },
];
