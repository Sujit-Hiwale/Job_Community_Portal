import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile from Firestore
  const loadUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));

      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfile(data);
        setUserRole(data.role);
      } else {
        setProfile(null);
        setUserRole(null);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  // Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        await loadUserProfile(user.uid);
      } else {
        setProfile(null);
        setUserRole(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up user + create Firestore profile
  const signUp = async (email, password, name, role = "user") => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(userCredential.user, { displayName: name });

    // Save to Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      email,
      name,
      role,
      createdAt: new Date(),
    });

    await loadUserProfile(userCredential.user.uid);

    return userCredential;
  };

  // Login
  const signIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await loadUserProfile(userCredential.user.uid);
    return userCredential;
  };

  // Logout
  const signOut = async () => {
    await firebaseSignOut(auth);
    setProfile(null);
    setUserRole(null);
  };

  const value = {
    currentUser,
    profile,
    userRole,
    signUp,
    signIn,
    signOut,
    isJobSeeker: () => userRole === "job-seeker",
    isCompany: () => userRole === "company",
    isRecruiter: () => userRole === "recruiter",
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
