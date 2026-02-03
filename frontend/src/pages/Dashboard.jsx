import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, loading } = useAuth();

  // ✅ Prevent UI flicker during auth fetch
  if (loading) return <p>Loading dashboard...</p>;

  // ✅ Safety guard
  if (!user) return <p>Please login to continue.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>

      <p>
        Welcome, <strong>{user.email}</strong>
      </p>

      <p>
        Role: <strong>{user.role}</strong>
      </p>

      <hr style={{ margin: "1.5rem 0" }} />

      {/* ✅ Role-Aware Rendering */}
      {user.role === "FOOD_PROVIDER" && (
        <section>
          <h3>Food Provider Actions</h3>
          <p>Create surplus food listings and manage donations.</p>
        </section>
      )}

      {user.role === "NGO" && (
        <section>
          <h3>NGO Actions</h3>
          <p>Browse available food and request pickups.</p>
        </section>
      )}

      {user.role === "VOLUNTEER" && (
        <section>
          <h3>Volunteer Actions</h3>
          <p>Pickup tasks will appear here soon.</p>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
