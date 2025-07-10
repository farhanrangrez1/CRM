// utils/permissionChecker.js
export const hasPermission = (module, action) => {
    try {
        const user = JSON.parse(localStorage.getItem('login_detail'));

        if (!user) return false;

        const modulePermissions = user[module];

        if (!modulePermissions) return false;

        return !!modulePermissions[action];
    } catch (error) {
        console.error('Permission check failed:', error);
        return false;
    }
};
