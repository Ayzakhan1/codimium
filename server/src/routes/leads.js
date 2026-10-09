const express = require("express");
const { addLeads, getLeads, deleteLead, updateLead } = require("../controller/controller");

leadsRoutes = express.Router();

leadsRoutes.post("/add-leads", addLeads);
leadsRoutes.get("/get-leads", getLeads);
leadsRoutes.delete("/delete-lead/:id", deleteLead);
leadsRoutes.put("/update-lead/:id", updateLead);

module.exports = leadsRoutes;updateLead