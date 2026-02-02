export default function Register() {
  return (
    <section className="card form-card">
      <h2>Create account</h2>
      <form onSubmit={(e) => e.preventDefault()} className="form">
        <label className="form-row">
          <span>Name</span>
          <input type="text" name="name" required placeholder="Your name" />
        </label>
        <label className="form-row">
          <span>Email</span>
          <input type="email" name="email" required placeholder="you@example.com" />
        </label>
        <label className="form-row">
          <span>Password</span>
          <input type="password" name="password" required placeholder="Choose a password" />
        </label>
        <div className="form-actions">
          <button type="submit">Register</button>
        </div>
      </form>
    </section>
  );
}
