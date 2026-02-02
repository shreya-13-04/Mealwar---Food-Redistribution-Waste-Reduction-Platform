export default function Login() {
  return (
    <section className="card form-card">
      <h2>Log in</h2>
      <form onSubmit={(e) => e.preventDefault()} className="form">
        <label className="form-row">
          <span>Email</span>
          <input type="email" name="email" required placeholder="you@example.com" />
        </label>
        <label className="form-row">
          <span>Password</span>
          <input type="password" name="password" required placeholder="••••••••" />
        </label>
        <div className="form-actions">
          <button type="submit">Log In</button>
        </div>
      </form>
    </section>
  );
}
