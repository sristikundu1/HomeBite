import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase.config';

const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseOnAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = useCallback((email, password) => signInWithEmailAndPassword(auth, email, password), []);

  const register = useCallback((email, password) => createUserWithEmailAndPassword(auth, email, password), []);

  const logout = useCallback(() => signOut(auth), []);

  const googleSignIn = useCallback(() => signInWithPopup(auth, googleProvider), []);

  const resetPassword = useCallback((email) => sendPasswordResetEmail(auth, email), []);

  const updateUserProfile = useCallback((profile) => updateProfile(auth.currentUser, profile), []);

  const onAuthStateChanged = useCallback((callback) => firebaseOnAuthStateChanged(auth, callback), []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      googleSignIn,
      resetPassword,
      updateUserProfile,
      onAuthStateChanged
    }),
    [user, loading, login, register, logout, googleSignIn, resetPassword, updateUserProfile, onAuthStateChanged]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
