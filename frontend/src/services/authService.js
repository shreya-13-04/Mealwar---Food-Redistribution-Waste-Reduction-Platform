import api from "./api";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

/**
 * Login using Firebase Authentication
 */
export const loginAndGetToken = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return await userCredential.user.getIdToken();
  } catch (error) {
    console.error("Firebase Login Failed:", error.message);
    throw error;
  }
};

/**
 * Register user in Firebase Authentication
 */
export const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential.user;
  } catch (error) {
    console.error("Firebase Registration Failed:", error.message);
    throw error;
  }
};

/**
 * Register user role in backend
 */
export const registerUser = async (data) => {
  try {
    const res = await api.post("/api/auth/register", data);
    return res.data;
  } catch (error) {
    console.error("Backend Registration Failed:", error.message);
    throw error;
  }
};

/**
 * Fetch current authenticated user
 */
export const fetchCurrentUser = async () => {
  try {
    const res = await api.get("/api/auth/me");
    return res.data;
  } catch (error) {
    console.error("Fetching user failed:", error.message);
    throw error;
  }
};
