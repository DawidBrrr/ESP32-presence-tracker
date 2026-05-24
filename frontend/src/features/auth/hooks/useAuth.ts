import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { loginUser, registerUser } from "../../../services/http/auth";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../../../types/api";

export function useAuth() {
  const [auth, setAuth] = useLocalStorage<AuthResponse | null>(
    "presence.auth",
    null
  );

  const register = async (payload: RegisterRequest) => {
    const data = await registerUser(payload);
    setAuth(data);
    return data;
  };

  const login = async (payload: LoginRequest) => {
    const data = await loginUser(payload);
    setAuth(data);
    return data;
  };

  const logout = () => {
    setAuth(null);
  };

  const token = auth?.token ?? "";

  return { auth, token, register, login, logout };
}
