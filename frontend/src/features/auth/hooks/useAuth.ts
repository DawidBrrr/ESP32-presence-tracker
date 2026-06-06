import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { loginUser, registerUser } from "../../../services/http/auth";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../../../types/api";

export function useAuth() {
  const [auth, setAuth] = useLocalStorage<AuthResponse | null>(
    "presence.auth",
    null
  );

  const register = async (payload: RegisterRequest) => {
    try {
      const data = await registerUser(payload);
      setAuth(data);
      return data;
    } catch (error) {
      // Clear invalid auth on registration error
      setAuth(null);
      throw error;
    }
  };

  const login = async (payload: LoginRequest) => {
    try {
      const data = await loginUser(payload);
      setAuth(data);
      return data;
    } catch (error) {
      // Clear invalid auth on login error
      setAuth(null);
      throw error;
    }
  };

  const logout = () => {
    setAuth(null);
  };

  const clearAuth = () => {
    setAuth(null);
  };

  const token = auth?.token ?? "";

  return { auth, token, register, login, logout, clearAuth };
}
