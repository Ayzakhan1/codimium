const express = require("express");
const { getTeamMembers } = require("../../controller/controller");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const teamMembersRoutes = express.Router();

teamMembersRoutes.use(authMiddleware);
teamMembersRoutes.use(roleMiddleware(["admin"]));

teamMembersRoutes.get("/get-team-members", getTeamMembers);

module.exports = teamMembersRoutes;