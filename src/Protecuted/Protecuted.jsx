// import React, { useEffect, useState } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { decryptToken } from './decode';

// const ProtectedRoute = ({ children }) => {
//      const pathname = useLocation()
//      console.log(pathname);
     
//      const loc =localStorage.getItem("userRole")



//     const [isAuthenticated, setIsAuthenticated] = useState(null);
       

//     useEffect(() => {
//         const checkAuth = async () => {
//             // Retrieve the encrypted token and IV from localStorage
//             const myToken = localStorage.getItem('encode');
//             const iv = localStorage.getItem('iv'); // Assuming you have stored the IV in localStorage

//             if (myToken && iv) {
//                 // Decrypt the token using the token and IV
//                 const decryptTokens = await decryptToken(myToken, iv);
//                 console.log(JSON.parse(decryptTokens))
//                 if (JSON.parse(decryptTokens) && JSON.parse(decryptTokens).startsWith("ey")) {
//                     setIsAuthenticated(true);  // Token is valid
//                     console.log("isAuthenticated",isAuthenticated)
//                 } else {
//                     setIsAuthenticated(false); // Invalid token
//                 }
//             } else {
//                 setIsAuthenticated(false);  // No token or IV found
//             }
//         };

//         checkAuth();
//     }, []);  // This effect runs only once, when the component is mounted

//     if (isAuthenticated === null) {
//         // Optionally, you can return a loading spinner or message until the check is done
//         return <div>Loading...</div>;
//     }

//     return isAuthenticated ? children : <Navigate to="/" />;
// };

// export default ProtectedRoute;



import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { decryptToken } from './decode';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const pathname = location.pathname;

  const userRole = localStorage.getItem("userRole");
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(null); // NEW: for role-based access

  useEffect(() => {
    const checkAuth = async () => {
      const myToken = localStorage.getItem('encode');
      const iv = localStorage.getItem('iv');

      if (myToken && iv) {
        const decryptTokens = await decryptToken(myToken, iv);
        const parsedToken = JSON.parse(decryptTokens);

        if (parsedToken && parsedToken.startsWith("ey")) {
          setIsAuthenticated(true);

          // Role-based route check
          if (
            (userRole === "admin" && pathname.startsWith("/admin")) ||
            (userRole === "employee" && pathname.startsWith("/employee"))||
            (userRole === "client" && pathname.startsWith("/client"))
          ) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false); // Role is not allowed to access this route
          }
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [pathname, userRole]);

  if (isAuthenticated === null ) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!isAuthorized) {
    return <div>Unauthorized Access</div>;
  }

  return children;
};

export default ProtectedRoute;



// import React, { useEffect, useState } from 'react';
// import { Navigate,useLocation } from 'react-router-dom';
// import { decryptToken } from './decode';

// const ProtectedRoute = ({ children }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(null);
//   const location = useLocation();
//   const pathname = location.pathname;
  
//    const userRole = localStorage.getItem("userRole");
//   const [isAuthorized, setIsAuthorized] = useState(null);
//     useEffect(() => {
//         const checkAuth = async () => {
//             // Retrieve the encrypted token and IV from localStorage
//             const myToken = localStorage.getItem('encode');
//             const iv = localStorage.getItem('iv'); // Assuming you have stored the IV in localStorage

//             if (myToken && iv) {
//                 // Decrypt the token using the token and IV
//                 const decryptTokens = await decryptToken(myToken, iv);
//                 console.log(JSON.parse(decryptTokens))
//                 if (JSON.parse(decryptTokens) && JSON.parse(decryptTokens).startsWith("ey")) {
//                     setIsAuthenticated(true);  // Token is valid
//                     console.log("isAuthenticated",isAuthenticated)
//                 } else {
//                     setIsAuthenticated(false); // Invalid token
//                 }
//             } else {
//                 setIsAuthenticated(false);  // No token or IV found
//             }
//         };

//         checkAuth();
//     }, []);  // This effect runs only once, when the component is mounted

//     if (isAuthenticated === null) {
//         // Optionally, you can return a loading spinner or message until the check is done
//         return <div>Loading...</div>;
//     }

//     return isAuthenticated ? children : <Navigate to="/" />;
// };

// export default ProtectedRoute;





// import React, { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { decryptToken } from './decode';

// const ProtectedRoute = ({ children }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(null);

//     useEffect(() => {
//         const checkAuth = async () => {
//             // Retrieve the encrypted token and IV from localStorage
//             const myToken = localStorage.getItem('encode');
//             const iv = localStorage.getItem('iv'); // Assuming you have stored the IV in localStorage

//             if (myToken && iv) {
//                 // Decrypt the token using the token and IV
//                 const decryptTokens = await decryptToken(myToken, iv);
//                 console.log(JSON.parse(decryptTokens))
//                 if (JSON.parse(decryptTokens) && JSON.parse(decryptTokens).startsWith("ey")) {
//                     setIsAuthenticated(true);  // Token is valid
//                     console.log("isAuthenticated",isAuthenticated)
//                 } else {
//                     setIsAuthenticated(false); // Invalid token
//                 }
//             } else {
//                 setIsAuthenticated(false);  // No token or IV found
//             }
//         };

//         checkAuth();
//     }, []);  // This effect runs only once, when the component is mounted

//     if (isAuthenticated === null) {
//         // Optionally, you can return a loading spinner or message until the check is done
//         return <div>Loading...</div>;
//     }

//     return isAuthenticated ? children : <Navigate to="/" />;
// };

// export default ProtectedRoute;
