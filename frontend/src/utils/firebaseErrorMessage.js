const firebaseErrorMessages = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled before it finished.',
  'auth/requires-recent-login': 'Please sign in again before changing your password.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account was found with this email.',
  'auth/weak-password': 'Please choose a stronger password.',
  'auth/wrong-password': 'Email or password is incorrect.'
};

export function getFirebaseErrorMessage(error) {
  return firebaseErrorMessages[error?.code] || 'Something went wrong. Please try again.';
}
