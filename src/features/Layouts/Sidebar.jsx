// // src/components/Sidebar.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { adminMenuItems, employeeMenuItems, clientMenuItems } from "../Layouts/menuConfig";
// import "./Sidebar.css";


// import bonbonlogo from "../../assets/Supplyblack.png";
// import bonbo from "../../assets/bonbo.png";
// import { hasPermission } from "../../redux/hasPermission";
// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   const [openMenuIndex, setOpenMenuIndex] = useState(null);
//   const [activeMenuIndex, setActiveMenuIndex] = useState(null);
//   const [activeSubmenuPath, setActiveSubmenuPath] = useState(null);
//   const [roleData, setRoleData] = useState(null);

//   const navigate = useNavigate();
//   const location = useLocation();

//   // const menuItems =
//   //   roleData === "admin"
//   //     ? adminMenuItems
//   //     : roleData === "employee"
//   //       ? employeeMenuItems
//   //       : roleData === "client"
//   //         ? clientMenuItems
//   //         : [];

//   const getFilteredMenuItems = (menuList) => {
//     return menuList
//       .filter((item) => {
//         if (!item.permissionKey) return true; // show if no permission check needed
//         return hasPermission(item.permissionKey, "view");
//       })
//       .map((item) => {
//         if (item.submenu) {
//           return {
//             ...item,
//             submenu: item.submenu,
//           };
//         }
//         return item;
//       });
//   };

//   const menuItems =
//     roleData === "admin"
//       ? getFilteredMenuItems(adminMenuItems)
//       : roleData === "employee"
//         ? getFilteredMenuItems(adminMenuItems)
//         : roleData === "client"
//           ? getFilteredMenuItems(adminMenuItems)
//           : [];

//   useEffect(() => {
//     if (!location) return;
//     let foundActiveMenuIndex = null;
//     let foundActiveSubmenuPath = null;

//     menuItems.forEach((item, i) => {
//       if (item.submenu) {
//         item.submenu.forEach((sub) => {
//           if (location.pathname === sub.path) {
//             foundActiveMenuIndex = i;
//             foundActiveSubmenuPath = sub.path;
//           }
//         });
//       } else if (location.pathname === item.path) {
//         foundActiveMenuIndex = i;
//         foundActiveSubmenuPath = null;
//       }
//     });

//     setActiveMenuIndex(foundActiveMenuIndex);
//     setActiveSubmenuPath(foundActiveSubmenuPath);
//     if (foundActiveMenuIndex !== null) {
//       setOpenMenuIndex(foundActiveMenuIndex);
//     } else {
//       setOpenMenuIndex(null);
//     }
//   }, [location.pathname, menuItems]);

//   useEffect(() => {
//     const storedRole = localStorage.getItem("userRole");
//     setRoleData(storedRole);
//   }, []);

//   const toggleMenu = (index) => {
//     setOpenMenuIndex(openMenuIndex === index ? null : index);
//   };

//   const handleMenuClick = (index, path, isSubmenu = false) => {
//     setActiveMenuIndex(index);
//     if (isSubmenu) {
//       setActiveSubmenuPath(path);
//     } else {
//       setActiveSubmenuPath(null);
//     }
//     navigate(path);
//   };

//   return (
//     <div className={`sidebar ${isOpen ? "expanded" : "collapsed"}`}>
//       <div className="sidebar-header">
//         <div className="logo">
//           {/* <span className="logo-text">Saaranik</span> */}
//           <img src={bonbonlogo} alt="Bon-Bon Logo" className="img-fluid" style={{ maxWidth: "150px" }} />
//         </div>
//       </div>
//       <ul className="menu" style={{ whiteSpace: "nowrap" }}>
//         {menuItems.map((item, index) => (
//           <li
//             key={index}
//             className={`menu-item ${item.submenu
//               ? openMenuIndex === index
//                 ? "open"
//                 : ""
//               : activeMenuIndex === index
//                 ? "active"
//                 : ""
//               }`}
//             onClick={() => {
//               if (item.submenu) {
//                 toggleMenu(index);
//               } else {
//                 handleMenuClick(index, item.path);
//               }
//             }}
//           >
//             <div className="menu-link menu-i">
//               {item.icon}
//               {isOpen && <span className="menu-text">{item.title}</span>}
//               {item.submenu && isOpen && (
//                 <i
//                   className={`fas fa-chevron-down menu-toggle-icon ${openMenuIndex === index ? "open" : ""
//                     }`}
//                 />
//               )}
//             </div>
//             {item.submenu && isOpen && (
//               <ul className={`submenu ${openMenuIndex === index ? "open" : ""}`}>
//                 {item.submenu.map((subItem, subIndex) => (
//                   <li
//                     key={subIndex}
//                     className={`submenu-item ${activeSubmenuPath === subItem.path ? "active-submenu-item" : ""
//                       }`}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleMenuClick(index, subItem.path, true);
//                     }}
//                   >
//                     {subItem.title}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;

// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { adminMenuItems, employeeMenuItems, clientMenuItems } from "../Layouts/menuConfig";
// import "./Sidebar.css";
// import bonbonlogo from "../../assets/Supplyblack.png";
// import { hasPermission } from "../../redux/hasPermission";

// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   const [openMenuIndex, setOpenMenuIndex] = useState(null);
//   const [activeMenuIndex, setActiveMenuIndex] = useState(null);
//   const [activeSubmenuPath, setActiveSubmenuPath] = useState(null);
//   const [roleData, setRoleData] = useState(null);

//   const navigate = useNavigate();
//   const location = useLocation();

//   const getFilteredMenuItems = (menuList) => {
//     return menuList
//       .filter((item) => {
//         return item.permissionKey ? hasPermission(item.permissionKey, "view") : false;
//       })
//       .map((item) => {
//         if (item.submenu) {
//           const filteredSubmenu = item.submenu.filter(sub => hasPermission(sub.permissionKey, "view"));
//           return {
//             ...item,
//             submenu: filteredSubmenu.length > 0 ? filteredSubmenu : null,
//           };
//         }
//         return item;
//       })
//       .filter(item => item.submenu !== null || item.permissionKey ? hasPermission(item.permissionKey, "view") : false);
//   };


//   const menuItems =
//     roleData === "admin"
//       ? getFilteredMenuItems(adminMenuItems)
//       : roleData === "employee"
//         ? getFilteredMenuItems(employeeMenuItems)
//         : roleData === "client"
//           ? getFilteredMenuItems(clientMenuItems)
//           : [];

//   useEffect(() => {
//     if (!location) return;
//     let foundActiveMenuIndex = null;
//     let foundActiveSubmenuPath = null;

//     menuItems.forEach((item, i) => {
//       if (item.submenu) {
//         item.submenu.forEach((sub) => {
//           if (location.pathname === sub.path) {
//             foundActiveMenuIndex = i;
//             foundActiveSubmenuPath = sub.path;
//           }
//         });
//       } else if (location.pathname === item.path) {
//         foundActiveMenuIndex = i;
//         foundActiveSubmenuPath = null;
//       }
//     });

//     setActiveMenuIndex(foundActiveMenuIndex);
//     setActiveSubmenuPath(foundActiveSubmenuPath);
//     if (foundActiveMenuIndex !== null) {
//       setOpenMenuIndex(foundActiveMenuIndex);
//     } else {
//       setOpenMenuIndex(null);
//     }
//   }, [location.pathname, menuItems]);

//   useEffect(() => {
//     const storedRole = localStorage.getItem("userRole");
//     setRoleData(storedRole);
//   }, []);

//   const toggleMenu = (index) => {
//     setOpenMenuIndex(openMenuIndex === index ? null : index);
//   };

//   const handleMenuClick = (index, path, isSubmenu = false) => {
//     setActiveMenuIndex(index);
//     if (isSubmenu) {
//       setActiveSubmenuPath(path);
//     } else {
//       setActiveSubmenuPath(null);
//     }
//     navigate(path);
//   };

//   return (
//     <div className={`sidebar ${isOpen ? "expanded" : "collapsed"}`}>
//       <div className="sidebar-header">
//         <div className="logo">
//           <img src={bonbonlogo} alt="Bon-Bon Logo" className="img-fluid" style={{ maxWidth: "150px" }} />
//         </div>
//       </div>
//       <ul className="menu" style={{ whiteSpace: "nowrap" }}>
//         {menuItems.map((item, index) => (
//           <li
//             key={index}
//             className={`menu-item ${item.submenu
//               ? openMenuIndex === index
//                 ? "open"
//                 : ""
//               : activeMenuIndex === index
//                 ? "active"
//                 : ""
//               }`}
//             onClick={() => {
//               if (item.submenu) {
//                 toggleMenu(index);
//               } else {
//                 handleMenuClick(index, item.path);
//               }
//             }}
//           >
//             <div className="menu-link menu-i">
//               {item.icon}
//               {isOpen && <span className="menu-text">{item.title}</span>}
//               {item.submenu && isOpen && (
//                 <i
//                   className={`fas fa-chevron-down menu-toggle-icon ${openMenuIndex === index ? "open" : ""
//                     }`}
//                 />
//               )}
//             </div>
//             {item.submenu && isOpen && (
//               <ul className={`submenu ${openMenuIndex === index ? "open" : ""}`}>
//                 {item.submenu.map((subItem, subIndex) => (
//                   <li
//                     key={subIndex}
//                     className={`submenu-item ${activeSubmenuPath === subItem.path ? "active-submenu-item" : ""
//                       }`}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleMenuClick(index, subItem.path, true);
//                     }}
//                   >
//                     {subItem.title}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { adminMenuItems, employeeMenuItems, clientMenuItems } from "../Layouts/menuConfig";
import "./Sidebar.css";
import bonbonlogo from "../../assets/Supplyblack.png";
import { hasPermission } from "../../redux/hasPermission";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [activeSubmenuPath, setActiveSubmenuPath] = useState(null);
  const [roleData, setRoleData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();


  // const getFilteredMenuItems = (menuList) => {
  //   return menuList
  //     .map((item) => {
  //       // Check if the item has a permissionKey
  //       const hasPermissionKey = item.permissionKey ? hasPermission(item.permissionKey, "view") : true;
  //       console.log(`Checking item: ${item.title}, has permission: ${hasPermissionKey}`);

  //       let filteredSubmenu = null;
  //       if (item.submenu) {
  //         // Ensure submenu items have permission keys if required
  //         const submenuItems = item.submenu.filter(sub => {
  //           const hasSubPermission = sub.permissionKey ? hasPermission(sub.permissionKey, "view") : true;
  //           console.log(`Checking submenu item: ${sub.title}, has permission: ${hasSubPermission}`);
  //           return hasSubPermission; // Only include submenu items with permission
  //         });
  //         filteredSubmenu = submenuItems.length > 0 ? submenuItems : null; // Show submenu if there are visible items
  //       }

  //       // Determine if the item should be visible based on permissions
  //       const isVisible = hasPermissionKey || (filteredSubmenu && filteredSubmenu.length > 0);
  //       console.log(`Item: ${item.title}, visible: ${isVisible}`);

  //       return {
  //         ...item,
  //         submenu: filteredSubmenu,
  //         visible: isVisible,
  //       };
  //     })
  //     .filter(item => item.visible); // Only return items that are visible
  // };

  const getFilteredMenuItems = (menuList) => {
    return menuList
      .map((item) => {
        // Check parent menu permission
        const hasPermissionKey = item.permissionKey ? hasPermission(item.permissionKey, "view") : true;

        let filteredSubmenu = null;

        if (item.submenu) {
          let submenuItems;

          // ✅ If parent has permission, skip individual submenu permission checks
          if (hasPermissionKey) {
            submenuItems = item.submenu; // All submenus allowed
          } else {
            // 🔒 If parent has no permission, still check submenus (optional)
            submenuItems = item.submenu.filter(sub => {
              const hasSubPermission = sub.permissionKey ? hasPermission(sub.permissionKey, "view") : true;

              return hasSubPermission;
            });
          }

          filteredSubmenu = submenuItems.length > 0 ? submenuItems : null;
        }

        // If parent has permission or at least one submenu is visible, show it
        const isVisible = hasPermissionKey || (filteredSubmenu && filteredSubmenu.length > 0);

        return {
          ...item,
          submenu: filteredSubmenu,
          visible: isVisible,
        };
      })
      .filter(item => item.visible); // Return only visible items
  };


  // const menuItems =
  //   roleData === "admin"
  //     ? getFilteredMenuItems(adminMenuItems)
  //     : roleData === "employee"
  //       ? getFilteredMenuItems(employeeMenuItems)
  //       : roleData === "client"
  //         ? getFilteredMenuItems(clientMenuItems)
  //         : [];
  const menuItems = useMemo(() => {
    if (roleData === "admin") return getFilteredMenuItems(adminMenuItems);
    if (roleData === "employee") return getFilteredMenuItems(employeeMenuItems);
    if (roleData === "client") return getFilteredMenuItems(clientMenuItems);
    return [];
  }, [roleData]);

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