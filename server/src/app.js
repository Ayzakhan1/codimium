const express = require("express");

const allRoutes = express.Router();


const authRoutes = require("./routes/authRoutes");

allRoutes.use("/auth", authRoutes);


module.exports = allRoutes;