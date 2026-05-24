"use client";

import { useState, type FormEvent } from "react";
import { buttonStyles, inputStyles } from "../../../components/ui/styles";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from "../../../types/api";
import type { Notice } from "../../../types/ui";

type AuthSectionProps = {
  onRegister: (payload: RegisterRequest) => Promise<AuthResponse>;
  onLogin: (payload: LoginRequest) => Promise<AuthResponse>;
  onNotice: (notice: Notice) => void;
};

export function AuthSection({
  onRegister,
  onLogin,
  onNotice
}: AuthSectionProps) {
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loginForm, setLoginForm] = useState({
    usernameOrEmail: "",
    password: ""
  });
  const [busy, setBusy] = useState(false);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);

    try {
      await onRegister(registerForm);
      onNotice({ type: "success", message: "Account created." });
      setRegisterForm({ username: "", email: "", password: "" });
    } catch (error) {
      onNotice({ type: "error", message: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);

    try {
      await onLogin(loginForm);
      onNotice({ type: "success", message: "Logged in." });
      setLoginForm({ usernameOrEmail: "", password: "" });
    } catch (error) {
      onNotice({ type: "error", message: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-lg font-semibold">Authentication</h2>
      <div className="mt-4 grid gap-6">
        <form className="grid gap-3" onSubmit={handleRegister}>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Register
          </h3>
          <input
            className={inputStyles}
            placeholder="Username"
            value={registerForm.username}
            onChange={(event) =>
              setRegisterForm((current) => ({
                ...current,
                username: event.target.value
              }))
            }
          />
          <input
            className={inputStyles}
            placeholder="Email"
            type="email"
            value={registerForm.email}
            onChange={(event) =>
              setRegisterForm((current) => ({
                ...current,
                email: event.target.value
              }))
            }
          />
          <input
            className={inputStyles}
            placeholder="Password"
            type="password"
            value={registerForm.password}
            onChange={(event) =>
              setRegisterForm((current) => ({
                ...current,
                password: event.target.value
              }))
            }
          />
          <button className={buttonStyles} disabled={busy}>
            Create account
          </button>
        </form>
        <form className="grid gap-3" onSubmit={handleLogin}>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Login
          </h3>
          <input
            className={inputStyles}
            placeholder="Username or email"
            value={loginForm.usernameOrEmail}
            onChange={(event) =>
              setLoginForm((current) => ({
                ...current,
                usernameOrEmail: event.target.value
              }))
            }
          />
          <input
            className={inputStyles}
            placeholder="Password"
            type="password"
            value={loginForm.password}
            onChange={(event) =>
              setLoginForm((current) => ({
                ...current,
                password: event.target.value
              }))
            }
          />
          <button className={buttonStyles} disabled={busy}>
            Sign in
          </button>
        </form>
      </div>
    </section>
  );
}
