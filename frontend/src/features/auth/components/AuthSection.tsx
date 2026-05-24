"use client";

import { useState, type FormEvent } from "react";
import { KeyIcon, SparkIcon } from "../../../components/ui/Icons";
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
      onNotice({ type: "success", message: "Konto zostało utworzone." });
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
      onNotice({ type: "success", message: "Zalogowano." });
      setLoginForm({ usernameOrEmail: "", password: "" });
    } catch (error) {
      onNotice({ type: "error", message: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel rounded-3xl p-8">
      <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-emerald-200/70">
            <span className="status-dot text-emerald-400" />
            Strefa dostępu
          </div>
          <h2 className="text-3xl font-semibold text-emerald-50">
            Zaloguj się do panelu obecności
          </h2>
          <p className="text-sm text-emerald-100/70">
            Odbieraj sygnały z czujników, monitoruj pomieszczenia i reaguj na
            zmiany w czasie rzeczywistym.
          </p>
          <div className="grid gap-3 text-sm text-emerald-100/70">
            <div className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-400" />
              <span>Błyskawiczne aktualizacje danych.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-400" />
              <span>Czytelny interfejs użytkownika.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-400" />
              <span>Bezpieczne logowanie</span>
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded-2xl border border-emerald-500/20 bg-[#08120f]/80 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <KeyIcon className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-50">
                  Logowanie
                </h3>
                <p className="text-xs text-emerald-100/60">
                  Dostęp do panelu użytkownika
                </p>
              </div>
            </div>
            <form className="mt-4 grid gap-3" onSubmit={handleLogin}>
              <input
                className={inputStyles}
                placeholder="Login lub e-mail"
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
                placeholder="Hasło"
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
                Zaloguj się
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-[#08120f]/80 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <SparkIcon className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-50">
                  Rejestracja
                </h3>
                <p className="text-xs text-emerald-100/60">
                  Utwórz nowe konto
                </p>
              </div>
            </div>
            <form className="mt-4 grid gap-3" onSubmit={handleRegister}>
              <input
                className={inputStyles}
                placeholder="Nazwa użytkownika"
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
                placeholder="Adres e-mail"
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
                placeholder="Hasło"
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
                Utwórz konto
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
