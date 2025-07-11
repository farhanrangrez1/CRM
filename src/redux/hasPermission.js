// // utils/permissionChecker.js
// export const hasPermission = (module, action) => {
//     try {
//         const user = JSON.parse(localStorage.getItem('permissions'));

//         if (!user) return false;

//         const modulePermissions = user[module];

//         if (!modulePermissions) return false;

//         return !!modulePermissions[action];
//     } catch (error) {
//         console.error('Permission check failed:', error);
//         return false;
//     }
// };

export const hasPermission = (module, action) => {
    try {
        const user = JSON.parse(localStorage.getItem('permissions'));

        if (!user) return false;

        const modulePermissions = user[module];

        if (!modulePermissions) return false;

        // Convert the permission value to boolean
        return modulePermissions[action] === "true"; // Check if the value is "true"
    } catch (error) {
        console.error('Permission check failed:', error);
        return false;
    }
};