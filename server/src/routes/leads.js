const express = require("express");
const { addLeads, getLeads, deleteLead } = require("../controller/controller");

leadsRoutes = express.Router();

leadsRoutes.post("/add-leads", addLeads);
leadsRoutes.get("/get-leads", getLeads);
leadsRoutes.delete("/delete-lead/:id", deleteLead);

module.exports = leadsRoutes;