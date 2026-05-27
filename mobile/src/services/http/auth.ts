import type { AuthResponse, LoginRequest, RegisterRequest } from "../../types/api";
import { apiRequest } from "./client";

export function registerUser(payload: RegisterRequest) {
  return apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: payload
  });
}

export function loginUser(payload: LoginRequest) {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: payload
  });
}
