const { addLeads, getLeads, deleteLead, updateLead, searchLeads } = require("./leadController/leads");
const { registerUser, login, createAdmin } = require("./auth/authController");

module.exports = {
    createAdmin,
    registerUser,
    login,
    addLeads,
    getLeads,
    deleteLead,
    updateLead,
    searchLeads
};