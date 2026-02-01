const User = require("../models/User");

/**
 * Register user with role (Issue 2)
 */
const registerUser = async (req, res) => {
  try {
    const { uid, email } = req.user;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      return res.status(200).json(user);
    }

    user = await User.create({
      firebaseUid: uid,
      email,
      role,
      verificationLevel: 0,
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "User registration failed" });
  }
};

/**
 * Get current authenticated user
 */
const getCurrentUser = async (req, res) => {
  try {
    const { uid } = req.user;

    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Fetch user error:", error);
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};

module.exports = {
  registerUser,
  getCurrentUser,
};
