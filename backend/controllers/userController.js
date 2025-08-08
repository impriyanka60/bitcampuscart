// backend/controllers/userController.js
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');

// Register
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, phone, password });
    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user._id); // check this line if token fails

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  }catch (error) {
  console.error("Login Error Backend:", error.message);
  res.status(500).json({ message: "Login error", error: error.message });
}
};


// POST /api/users/register


// GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-__v");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// POST /api/users/login (optional basic version)
module.exports = { registerUser, getAllUsers, loginUser };