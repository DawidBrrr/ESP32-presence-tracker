import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { KeyIcon, SparkIcon } from "../../../components/ui/Icons";
import { buttonStyles, inputStyles } from "../../../components/ui/styles";
import { colors, shadows } from "../../../styles/theme";
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

  const handleRegister = async () => {
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

  const handleLogin = async () => {
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
    <View style={styles.panel}>
      <View style={styles.panelGrid}>
        <View style={styles.infoColumn}>
          <View style={styles.infoTag}>
            <View style={styles.statusDot} />
            <Text style={styles.infoTagText}>Strefa dostępu</Text>
          </View>
          <Text style={styles.heading}>Zaloguj się do panelu obecności</Text>
          <Text style={styles.description}>
            Odbieraj sygnały z czujników, monitoruj pomieszczenia i reaguj na
            zmiany w czasie rzeczywistym.
          </Text>
          <View style={styles.featureList}>
            <View style={styles.featureRow}>
              <View style={styles.bullet} />
              <Text style={styles.featureText}>
                Błyskawiczne aktualizacje danych.
              </Text>
            </View>
            <View style={styles.featureRow}>
              <View style={styles.bullet} />
              <Text style={styles.featureText}>Czytelny interfejs użytkownika.</Text>
            </View>
            <View style={styles.featureRow}>
              <View style={styles.bullet} />
              <Text style={styles.featureText}>Bezpieczne logowanie</Text>
            </View>
          </View>
        </View>

        <View style={styles.formColumn}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBadge}>
                <KeyIcon size={20} color={colors.accentStrong} />
              </View>
              <View>
                <Text style={styles.cardTitle}>Logowanie</Text>
                <Text style={styles.cardSubtitle}>Dostęp do panelu użytkownika</Text>
              </View>
            </View>
            <View style={styles.form}>
              <TextInput
                style={inputStyles.base}
                placeholder="Login lub e-mail"
                placeholderTextColor="rgba(229, 255, 247, 0.4)"
                value={loginForm.usernameOrEmail}
                onChangeText={(text) =>
                  setLoginForm((current) => ({ ...current, usernameOrEmail: text }))
                }
              />
              <TextInput
                style={inputStyles.base}
                placeholder="Hasło"
                placeholderTextColor="rgba(229, 255, 247, 0.4)"
                secureTextEntry
                value={loginForm.password}
                onChangeText={(text) =>
                  setLoginForm((current) => ({ ...current, password: text }))
                }
              />
              <Pressable
                style={[buttonStyles.base, busy && buttonStyles.disabled]}
                onPress={handleLogin}
                disabled={busy}
              >
                <Text style={buttonStyles.text}>Zaloguj się</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBadge}>
                <SparkIcon size={20} color={colors.accentStrong} />
              </View>
              <View>
                <Text style={styles.cardTitle}>Rejestracja</Text>
                <Text style={styles.cardSubtitle}>Utwórz nowe konto</Text>
              </View>
            </View>
            <View style={styles.form}>
              <TextInput
                style={inputStyles.base}
                placeholder="Nazwa użytkownika"
                placeholderTextColor="rgba(229, 255, 247, 0.4)"
                value={registerForm.username}
                onChangeText={(text) =>
                  setRegisterForm((current) => ({ ...current, username: text }))
                }
              />
              <TextInput
                style={inputStyles.base}
                placeholder="Adres e-mail"
                placeholderTextColor="rgba(229, 255, 247, 0.4)"
                keyboardType="email-address"
                value={registerForm.email}
                onChangeText={(text) =>
                  setRegisterForm((current) => ({ ...current, email: text }))
                }
              />
              <TextInput
                style={inputStyles.base}
                placeholder="Hasło"
                placeholderTextColor="rgba(229, 255, 247, 0.4)"
                secureTextEntry
                value={registerForm.password}
                onChangeText={(text) =>
                  setRegisterForm((current) => ({ ...current, password: text }))
                }
              />
              <Pressable
                style={[buttonStyles.base, busy && buttonStyles.disabled]}
                onPress={handleRegister}
                disabled={busy}
              >
                <Text style={buttonStyles.text}>Utwórz konto</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    borderRadius: 24,
    padding: 20,
    ...shadows.panel
  },
  panelGrid: {
    gap: 24
  },
  infoColumn: {
    gap: 12
  },
  infoTag: {
    flexDirection: "row",
    alignItems: "center"
  },
  infoTagText: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 3.5,
    color: "rgba(229, 255, 247, 0.7)"
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginRight: 10,
    backgroundColor: colors.accent
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.text
  },
  description: {
    fontSize: 14,
    color: "rgba(229, 255, 247, 0.7)",
    lineHeight: 20
  },
  featureList: {
    gap: 8
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10
  },
  bullet: {
    marginTop: 6,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.accent
  },
  featureText: {
    fontSize: 13,
    color: "rgba(229, 255, 247, 0.7)",
    flex: 1
  },
  formColumn: {
    gap: 16
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(68, 245, 168, 0.2)",
    backgroundColor: "rgba(8, 18, 15, 0.8)",
    padding: 16
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(68, 245, 168, 0.12)"
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text
  },
  cardSubtitle: {
    fontSize: 12,
    color: "rgba(229, 255, 247, 0.6)"
  },
  form: {
    marginTop: 12,
    gap: 10
  }
});
