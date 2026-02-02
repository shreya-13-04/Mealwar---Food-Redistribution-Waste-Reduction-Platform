export default function Login() {
  console.log('Login component rendering');
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>LOGIN PAGE - TEST</h1>
      <p>If you see this text, React is working!</p>
      
      <div className="form-card" style={{ margin: '2rem auto' }}>
        <h2>Login Form</h2>
        <form className="form">
          <div className="form-row">
            <label>Email</label>
            <input type="email" placeholder="your@email.com" />
          </div>
          <div className="form-row">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" />
          </div>
          <div className="form-actions">
            <button type="submit">Login</button>
          </div>
        </form>
        <p style={{ marginTop: '1rem' }}>
          Don't have an account? <a href="/register" style={{ color: '#007bff' }}>Register</a>
        </p>
      </div>
    </div>
  );
}
