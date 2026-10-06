const { addLeads, getLeads, deleteLead } = require("./leadController/leads");
const { registerUser, login, createAdmin } = require("./auth/authController");

module.exports = {
    createAdmin,
    registerUser,
    login,
    addLeads,
    getLeads,
    deleteLead
};