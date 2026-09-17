const express = require('express');
const { login, registerUser ,  createAdmin} = require('../controller/controller');

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const authRoutes = express.Router();

authRoutes.post("/create-admin", createAdmin);

authRoutes.post("/register", registerUser);

authRoutes.post("/login", login);

authRoutes.get(
  "/admin-data",
  authMiddleware,
  roleMiddleware(["admin"]),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
      user: req.decoded
    });
  }
);

authRoutes.get(
  "/team-data",
  authMiddleware,
  roleMiddleware(["team_member"]),
  (req, res) => {
    res.json({
      message: "Welcome Team Member",
      user: req.decoded
    });
  }
);


module.exports = authRoutes;