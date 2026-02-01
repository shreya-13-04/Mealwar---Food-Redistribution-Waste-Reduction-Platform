import "./App.css";
import { loginAndGetToken } from "./services/authService";

function App() {
  const handleTestLogin = async () => {
    try {
      const token = await loginAndGetToken(
        "test@gmail.com",
        "test1234"
      );

      console.log("✅ FIREBASE JWT TOKEN:");
      console.log(token);
    } catch (error) {
      console.error("❌ Firebase Login Failed:", error);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Mealwar – Authentication Test</h1>

      <p>
        This is a temporary UI to validate Firebase Authentication
        and backend JWT verification.
      </p>

      <button
        onClick={handleTestLogin}
        style={{
          padding: "10px 16px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Test Firebase Login
      </button>

      <p style={{ marginTop: "1rem", color: "#666" }}>
        Open DevTools → Console to view the JWT token.
      </p>
    </div>
  );
}

export default App;
