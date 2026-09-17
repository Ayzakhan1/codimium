const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= CREATE ADMIN =================

const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    // Check if admin already exists
    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      return res.status(400).json({
        message: "Admin already exists"
      });
    }

    // Check email already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User with this email already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    const response = await admin.save();

    // Generate JWT
    const token = jwt.sign(
      {
        userId: response._id,
        role: response.role
      },
      process.env.JWT_KEY
    );

    res.status(201).json({
      message: "Admin created successfully",
      user: {
        id: response._id,
        name: response.name,
        email: response.email,
        role: response.role
      },
      auth: token
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ================= REGISTER =================

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    // Check existing user
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User with this email already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const datatosave = new User({
      name,
      email,
      password: hashedPassword,
      role: "team_member"
    });

    const response = await datatosave.save();

    // Generate JWT
    const token = jwt.sign(
      {
        userId: response._id,
        role: response.role
      },
      process.env.JWT_KEY
    );

    // Response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: response._id,
        name: response.name,
        email: response.email,
        role: response.role
      },
      auth: token
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// ================= LOGIN =================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_KEY
    );

    // Response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      auth: token
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


module.exports = {
  createAdmin,
  registerUser,
  login
};