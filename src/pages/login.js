import { useState } from 'react';
import './login.css';

// Top-level login page component for the app
function LoginPage({ onNavigateToSignup }) {
  // Track the current values of the two text boxes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Track the current error message (if any) and whether we’ve “logged in”
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle the form submit button click
  const handleSubmit = (e) => {
    // Stop the browser from doing a full page reload
    e.preventDefault();

    // Clear any previous messages before re-validating
    setError('');
    setSuccess(false);

    // Basic validation rules:
    // 1. Email must not be empty
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Email is required.');
      return;
    }

    // 2. Email must roughly match a normal email shape
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    if (!emailOk) {
      setError('Please enter a valid email address.');
      return;
    }

    // 3. Password must not be empty
    if (!password) {
      setError('Password is required.');
      return;
    }

    // If all checks pass, pretend the login succeeded
    setSuccess(true);
  };

  return (
    <div className="LoginPage">
      <div className="LoginLayout">
        <h1 className="SiteTitle">Ellie's Simple App</h1>

        <div className="LoginCard">
          <h2>Log in</h2>

          <form className="LoginForm" onSubmit={handleSubmit}>
            <label className="Field" htmlFor="email">
              Email
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label className="Field" htmlFor="password">
              Password
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
              />
            </label>

            {error && (
              <div className="Alert" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="Alert AlertSuccess" role="status">
                Logged in successfully (demo).
              </div>
            )}

            <button type="submit" className="PrimaryButton">
              Log in
            </button>

            <button
              type="button"
              className="SecondaryButton"
              onClick={onNavigateToSignup}
            >
              Don&apos;t have an account? Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

