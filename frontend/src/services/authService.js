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
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const token = await userCredential.user.getIdToken();
  console.log("FIREBASE ID TOKEN:", token);

  return token;
};

/**
 * Register user in Firebase Authentication
 */
export const registerWithEmail = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
};

/**
 * Register user role in backend
 */
export const registerUser = async (data) => {
  const res = await api.post("/api/auth/register", data);
  return res.data;
};

/**
 * Fetch current authenticated user
 */
export const fetchCurrentUser = async () => {
  const res = await api.get("/api/auth/me");
  return res.data;
};
