const express = require("express");
const teamLeadsRoutes = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const {
  getTeamMemberLeads,
   searchTeamMemberLeads,
  updateTeamMemberLead,
} = require("../../controller/team_member/leadsController");

teamLeadsRoutes.get(
  "/my-leads",
  authMiddleware,
  roleMiddleware(["team_member"]),
  getTeamMemberLeads
);
teamLeadsRoutes.get(
  "/search/:key",
  authMiddleware,
  roleMiddleware(["team_member"]),
  searchTeamMemberLeads
);

teamLeadsRoutes.put(
  "/update-lead/:id",
  authMiddleware,
  roleMiddleware(["team_member"]),
  updateTeamMemberLead
);

module.exports = teamLeadsRoutes;
