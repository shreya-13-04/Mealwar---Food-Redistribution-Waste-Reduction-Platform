import api from './api';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase"; // wherever firebase is initialized

const auth = getAuth(app);

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (data) => api.post('/auth/register', data);
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
