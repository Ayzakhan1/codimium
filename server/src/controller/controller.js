const { registerUser, login, createAdmin } = require("./auth/authController");

module.exports = {
    createAdmin,
    registerUser,
    login
};