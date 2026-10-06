const express = require("express");

const allRoutes = express.Router();


const authRoutes = require("./routes/authRoutes");
const leadsRoutes = require("./routes/leads");



allRoutes.use("/auth", authRoutes);
allRoutes.use("/leads", leadsRoutes);

module.exports = allRoutes;