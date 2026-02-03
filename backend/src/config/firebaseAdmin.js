const admin = require("firebase-admin");
const serviceAccount = require("../../mealwar-b21fb-firebase-adminsdk-fbsvc-80a3b98337.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
