const express = require("express");

const allRoutes = express.Router();
const adminRoutes = express.Router();
const temMembersRoutes = express.Router();

const authRoutes = require("./routes/authRoutes");
const leadsRoutes = require("./routes/admin/leads");
const teamMembersRoutes = require("./routes/admin/teamMembers");
const teamLeadsRoutes = require("./routes/teamMember/teamLeads");

allRoutes.use("/auth", authRoutes);
allRoutes.use("/admin", adminRoutes);
allRoutes.use("/team-member", temMembersRoutes);

adminRoutes.use("/leads", leadsRoutes);
adminRoutes.use("/team_member", teamMembersRoutes);

temMembersRoutes.use("/member-leads", teamLeadsRoutes);

module.exports = allRoutes;