const express = require("express");
const { verifyFirebaseToken } = require("../middlewares/authMiddleware");
const {
  registerUser,
  getCurrentUser,
} = require("../controllers/authController");

const router = express.Router();

/**
 * Test protected route (Issue 1 proof)
 */
router.get("/protected", verifyFirebaseToken, (req, res) => {
  res.json({
    message: "User authenticated successfully",
    user: req.user,
  });
});

/**
 * Register user with role (Issue 2)
 */
router.post("/register", verifyFirebaseToken, registerUser);

/**
 * Get current user profile
 */
router.get("/me", verifyFirebaseToken, getCurrentUser);

module.exports = router;
