import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase';
import { fetchRandomAnimeQuote } from '../utils/animeQuote';
import { mapFirebaseAuthError } from '../utils/mapFirebaseAuthError';
import './login.css';

// Top-level login page component for the app
function LoginPage({ onNavigateToSignup }) {
  // Track the current values of the two text boxes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Track the current error message (if any) and whether we’ve “logged in”
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [quote, setQuote] = useState('');
  const [character, setCharacter] = useState('');
  const [anime, setAnime] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setQuoteLoading(true);
    fetchRandomAnimeQuote()
      .then((data) => {
        if (cancelled || !data) return;
        setQuote(data.quote);
        setCharacter(data.character);
        setAnime(data.anime);
      })
      .finally(() => {
        if (!cancelled) setQuoteLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Handle the form submit button click
  const handleSubmit = async (e) => {
    // Stop the browser from doing a full page reload
    e.preventDefault();

    // Clear any previous messages before re-validating
    setError('');

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

    if (!isFirebaseConfigured || !auth) {
      setError(
        'Firebase is not configured. Copy .env.example to .env.local and add your Firebase web app keys.'
      );
      return;
    }

    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
    } catch (err) {
      setError(mapFirebaseAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="LoginPage">
      <div className="LoginLayout">
        <header className="SiteHeader">
          <h1 className="SiteTitle">Soothing Space</h1>
          <p className="SiteTagline">
            Your personal space for soothing sounds
          </p>
        </header>

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

            <button
              type="submit"
              className="PrimaryButton"
              disabled={submitting}
            >
              {submitting ? 'Signing in…' : 'Log in'}
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

        <div className="AnimeQuote" aria-live="polite">
          {quoteLoading && (
            <p className="AnimeQuote--loading">Loading quote…</p>
          )}
          {!quoteLoading && quote && (
            <>
              <blockquote className="AnimeQuoteText">&ldquo;{quote}&rdquo;</blockquote>
              <p className="AnimeQuoteFooter">
                <span className="AnimeQuoteCharacter">{character}</span>
                <span className="AnimeQuoteSep"> · </span>
                <span className="AnimeQuoteAnime">{anime}</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

