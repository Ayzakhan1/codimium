const express = require('express');
const { login, registerAdmin } = require('../controller/controller');


const authRoutes = express.Router();

authRoutes.post("/register-admin", registerAdmin);

authRoutes.post("/login", login);


module.exports = authRoutes;