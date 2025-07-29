export const can = (module, action) => {
    const permissions = JSON.parse(localStorage.getItem("permissions"));
    return permissions?.[module]?.[action] === "true";
};
