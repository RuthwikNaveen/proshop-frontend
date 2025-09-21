import { createContext, useState, useEffect, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { auth } from '../firebase';

const AuthContext = createContext();

const ADMIN_EMAIL = 'shrilakshmima@gmail.com';

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storage = getStorage();

  const formatUser = (rawUser) => {
    if (!rawUser) return null;
    return {
      uid: rawUser.uid,
      name: rawUser.displayName,
      email: rawUser.email,
      photoURL: rawUser.photoURL,
      isAdmin: rawUser.email === ADMIN_EMAIL,
    };
  };
  
  const getFreshToken = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      return await currentUser.getIdToken(true); // 'true' forces a refresh
    }
    return null;
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserInfo(formatUser(user));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

 const register = useCallback(
    async (name, email, password) => {
      try {
        setLoading(true);
        setError(null);
        // Step 1: Create the user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Step 2: Update their profile to set their display name
        await updateProfile(userCredential.user, { displayName: name });
        
        // THIS IS THE FIX:
        // Step 3: We now manually create a user object that includes the new name,
        // ensuring the state is updated correctly without any timing issues.
        const updatedUserForState = {
            ...userCredential.user,
            displayName: name,
        };
        setUserInfo(formatUser(updatedUserForState));

      } catch (err) {
        setError(err.message);
        throw err; // Re-throw the error so the component can catch it
      } finally {
        setLoading(false);
      }
    },
    []
  );
  const googleLogin = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        loading,
        error,
        getFreshToken, // EXPOSED
        register,
        login,
        googleLogin,
        logout,
        resetPassword,
        
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

