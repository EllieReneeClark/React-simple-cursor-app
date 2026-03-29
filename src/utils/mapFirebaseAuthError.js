/**
 * Turn Firebase Auth errors into short, user-friendly messages.
 */
export function mapFirebaseAuthError(error) {
  const code = error?.code;

  switch (code) {
    case 'auth/invalid-email':
      return 'That email address doesn’t look valid.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again in a few minutes.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    default:
      return error?.message || 'Something went wrong. Please try again.';
  }
}
