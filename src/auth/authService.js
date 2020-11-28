import jwtDecode from "jwt-decode";
import api from "../commons/api";
const TOKEN_KEY = "jwt";

export const login = async (email, password) => {
  const result = await api.post("/auth/login", { email, password });
  localStorage.setItem(TOKEN_KEY, result.data.accessToken);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export function getCurrentUser() {
  try {
    const token = getToken();
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
}

export const isAuthenticated = () => {
  const user = getCurrentUser();
  if (!user) {
    return false;
  }
  if (user.exp < Date.now() / 1000) {
    logout();
    return false;
  }
  return true;
};
