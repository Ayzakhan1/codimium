const User = require("../../models/user");
const bcrypt = require("bcryptjs");

// Register First Admin
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    // Check if admin already exists
    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      return res.status(403).json({
        message: "Admin is already registered"
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

    // Create Admin
const datatosave = new User({
  name,
  email,
  password: hashedPassword,
  role: "admin"
});

const response = await datatosave.save();

    res.status(201).json({
      message: "Admin registered successfully",
      user: {
        id: response._id,
        name: response.name,
        email: response.email,
        role: response.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// Login Admin / Team Member
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
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

    // Check active status
    if (!user.isActive) {
      return res.status(403).json({
        message: "Your account is inactive"
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


module.exports = {
  registerAdmin,
  login
};