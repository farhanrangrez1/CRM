// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { adminMenuItems, employeeMenuItems, clientMenuItems } from "../Layouts/menuConfig";
import "./Sidebar.css";


import bonbonlogo from "../../assets/Supplyblack.png";
import bonbo from "../../assets/bonbo.png";
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [activeSubmenuPath, setActiveSubmenuPath] = useState(null);
  const [roleData, setRoleData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems =
    roleData === "admin"
      ? adminMenuItems
      : roleData === "employee"
        ? employeeMenuItems
        : roleData === "client"
          ? clientMenuItems
          : [];


  useEffect(() => {
    if (!location) return;
    let foundActiveMenuIndex = null;
    let foundActiveSubmenuPath = null;

    menuItems.forEach((item, i) => {
      if (item.submenu) {
        item.submenu.forEach((sub) => {
          if (location.pathname === sub.path) {
            foundActiveMenuIndex = i;
            foundActiveSubmenuPath = sub.path;
          }
        });
      } else if (location.pathname === item.path) {
        foundActiveMenuIndex = i;
        foundActiveSubmenuPath = null;
      }
    });

    setActiveMenuIndex(foundActiveMenuIndex);
    setActiveSubmenuPath(foundActiveSubmenuPath);
    if (foundActiveMenuIndex !== null) {
      setOpenMenuIndex(foundActiveMenuIndex);
    } else {
      setOpenMenuIndex(null);
    }
  }, [location.pathname, menuItems]);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    setRoleData(storedRole);
  }, []);

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleMenuClick = (index, path, isSubmenu = false) => {
    setActiveMenuIndex(index);
    if (isSubmenu) {
      setActiveSubmenuPath(path);
    } else {
      setActiveSubmenuPath(null);
    }
    navigate(path);
  };

  return (
    <div className={`sidebar ${isOpen ? "expanded" : "collapsed"}`}>
      <div className="sidebar-header">
        <div className="logo">
          {/* <span className="logo-text">Saaranik</span> */}
          <img src={bonbonlogo} alt="Bon-Bon Logo" className="img-fluid" style={{ maxWidth: "150px" }} />
        </div>
      </div>
      <ul className="menu" style={{ whiteSpace: "nowrap" }}>
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`menu-item ${item.submenu
                ? openMenuIndex === index
                  ? "open"
                  : ""
                : activeMenuIndex === index
                  ? "active"
                  : ""
              }`}
            onClick={() => {
              if (item.submenu) {
                toggleMenu(index);
              } else {
                handleMenuClick(index, item.path);
              }
            }}
          >
            <div className="menu-link menu-i">
              {item.icon}
              {isOpen && <span className="menu-text">{item.title}</span>}
              {item.submenu && isOpen && (
                <i
                  className={`fas fa-chevron-down menu-toggle-icon ${openMenuIndex === index ? "open" : ""
                    }`}
                />
              )}
            </div>
            {item.submenu && isOpen && (
              <ul className={`submenu ${openMenuIndex === index ? "open" : ""}`}>
                {item.submenu.map((subItem, subIndex) => (
                  <li
                    key={subIndex}
                    className={`submenu-item ${activeSubmenuPath === subItem.path ? "active-submenu-item" : ""
                      }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuClick(index, subItem.path, true);
                    }}
                  >
                    {subItem.title}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
