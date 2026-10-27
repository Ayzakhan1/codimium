const express = require('express');
const { login, registerUser ,  createAdmin} = require('../controller/controller');

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const authRoutes = express.Router();

authRoutes.post("/create-admin", createAdmin);

authRoutes.post("/register", registerUser);

authRoutes.post("/login", login);




module.exports = authRoutes;