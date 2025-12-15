import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import axios from "axios";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const setUserFromBackend = (profileData) => {
    setProfile(profileData);
    setUserRole(profileData?.role || null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user) {
        setProfile(null);
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/login`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserFromBackend(res.data.profile);
      } catch (err) {
        console.error("Error loading user profile:", err);
        setProfile(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    const token = await cred.user.getIdToken();
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/login`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUserFromBackend(res.data.profile);
    return cred;
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setCurrentUser(null);
    setProfile(null);
    setUserRole(null);
  };

  const value = {
    currentUser,
    profile,
    userRole,
    signIn,
    signOut,
    setUserFromBackend,
    isJobSeeker: () => userRole === "job-seeker",
    isCompany: () => userRole === "company",
    isRecruiter: () => userRole === "recruiter",
    isAdmin: () => userRole === "admin" || userRole === "super-admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}