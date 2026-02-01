const admin = require("../config/firebaseAdmin");

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing token" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken;
    next();
  } catch (error) {
  console.error("Token verification failed:", error);
  return res.status(401).json({ message: "Invalid token" });
}

};

module.exports = { verifyFirebaseToken };
