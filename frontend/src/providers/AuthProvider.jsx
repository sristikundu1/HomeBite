import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  reauthenticateWithCredential,
  updatePassword as firebaseUpdatePassword,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase.config';
import { getUserByEmail, saveUser } from '../services/usersApi';

const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseOnAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setDbUser(null);

      if (currentUser?.email) {
        try {
          const response = await getUserByEmail(currentUser.email);
          setDbUser(response.data.user);
        } catch (error) {
          console.warn('Failed to load user from database:', error.message);
        }
      }

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

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    const currentUser = auth.currentUser;
    if (!currentUser?.email) throw new Error('No authenticated user');
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
    return firebaseUpdatePassword(currentUser, newPassword);
  }, []);

  const saveAuthenticatedUser = useCallback(async (firebaseUser) => {
    try {
      await saveUser(firebaseUser);
      const response = await getUserByEmail(firebaseUser.email);
      setDbUser(response.data.user);
    } catch (error) {
      console.warn('Failed to save user to database:', error.message);
    }
  }, []);

  const refreshDbUser = useCallback(async () => {
    if (!user?.email) return null;
    const response = await getUserByEmail(user.email);
    setDbUser(response.data.user);
    return response.data.user;
  }, [user?.email]);

  const onAuthStateChanged = useCallback((callback) => firebaseOnAuthStateChanged(auth, callback), []);

  const value = useMemo(
    () => ({
      user,
      dbUser,
      loading,
      login,
      register,
      logout,
      googleSignIn,
      resetPassword,
      updateUserProfile,
      changePassword,
      saveAuthenticatedUser,
      refreshDbUser,
      onAuthStateChanged
    }),
    [
      user,
      dbUser,
      loading,
      login,
      register,
      logout,
      googleSignIn,
      resetPassword,
      updateUserProfile,
      changePassword,
      saveAuthenticatedUser,
      refreshDbUser,
      onAuthStateChanged
    ]
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
