const express = require("express");
const { addLeads, getLeads, deleteLead, updateLead, searchLeads } = require("../../controller/controller");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

leadsRoutes = express.Router();

leadsRoutes.use(authMiddleware);
leadsRoutes.use(roleMiddleware(["admin"]));

leadsRoutes.post("/add-leads", addLeads);
leadsRoutes.get("/get-leads", getLeads);
leadsRoutes.delete("/delete-lead/:id", deleteLead);
leadsRoutes.put("/update-lead/:id", updateLead);
leadsRoutes.get("/search-leads/:key", searchLeads);

module.exports = leadsRoutes;