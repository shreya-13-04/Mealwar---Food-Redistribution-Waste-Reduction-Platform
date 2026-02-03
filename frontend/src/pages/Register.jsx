import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerWithEmail, registerUser } from "../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("FOOD_PROVIDER");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ✅ Step 1 — Create user in Firebase
      await registerWithEmail(email, password);

      // ✅ Step 2 — Store role in backend
      await registerUser({ role });

      alert("✅ Registration successful!");

      // Navigate to dashboard after registration
      navigate("/dashboard");

    } catch (error) {
      console.error("Registration Failed:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", marginBottom: "1rem", width: "100%" }}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: "1rem", width: "100%" }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ display: "block", marginBottom: "1rem", width: "100%" }}
        >
          <option value="FOOD_PROVIDER">Food Provider</option>
          <option value="NGO">NGO</option>
          <option value="VOLUNTEER">Volunteer</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
