const { addLeads, getLeads, deleteLead, updateLead, searchLeads } = require("./admin/leads");
const { getTeamMembers} = require("./admin/teamMembersController")
const { registerUser, login, createAdmin } = require("./auth/authController");
const { getTeamMemberLeads, searchTeamMemberLeads, updateTeamMemberLead } = require("./team_member/leadsController");

module.exports = {
    createAdmin,
    registerUser,
    login,
    addLeads,
    getLeads,
    deleteLead,
    updateLead,
    searchLeads,
    getTeamMembers,
    getTeamMemberLeads,
    searchTeamMemberLeads,
    updateTeamMemberLead
};