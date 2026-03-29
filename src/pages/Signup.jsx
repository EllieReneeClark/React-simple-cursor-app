import { useState } from 'react';
import './Signup.css';

function SignupPage({ onNavigateToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Name is required.');
      return;
    }

    if (!trimmedEmail) {
      setError('Email is required.');
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    if (!emailOk) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="SignupPage">
      <div className="SignupLayout">
        <h1 className="SiteTitle">Ellie's Simple App</h1>

        <div className="SignupCard">
          <h2>Sign up</h2>

          <form className="SignupForm" onSubmit={handleSubmit}>
            <label className="Field" htmlFor="signup-name">
              Name
              <input
                id="signup-name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </label>

            <label className="Field" htmlFor="signup-email">
              Email
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label className="Field" htmlFor="signup-password">
              Password
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
            </label>

            {error && (
              <div className="Alert" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="Alert AlertSuccess" role="status">
                Account created successfully (demo).
              </div>
            )}

            <button type="submit" className="PrimaryButton">
              Sign up
            </button>

            <button
              type="button"
              className="SecondaryButton"
              onClick={onNavigateToLogin}
            >
              Already have an account? Back to log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;

