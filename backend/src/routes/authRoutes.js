const express = require("express");
const { verifyFirebaseToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/protected", verifyFirebaseToken, (req, res) => {
  res.json({
    message: "User authenticated successfully",
    user: req.user,
  });
});

module.exports = router;
