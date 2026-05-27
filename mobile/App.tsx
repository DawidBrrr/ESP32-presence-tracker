import { LinearGradient } from "expo-linear-gradient";
import { useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import { AuthSection } from "./src/features/auth/components/AuthSection";
import { useAuth } from "./src/features/auth/hooks/useAuth";
import { DashboardHeader } from "./src/features/dashboard/components/DashboardHeader";
import { NoticeBanner } from "./src/features/dashboard/components/NoticeBanner";
import { useNotice } from "./src/features/dashboard/hooks/useNotice";
import { DeviceSection } from "./src/features/devices/components/DeviceSection";
import { useDevices } from "./src/features/devices/hooks/useDevices";
import { TelemetrySection } from "./src/features/telemetry/components/TelemetrySection";
import { useTelemetry } from "./src/features/telemetry/hooks/useTelemetry";
import { colors } from "./src/styles/theme";
import type { Notice } from "./src/types/ui";

export default function App() {
  const { notice, showNotice, pushNotice, clearNotice } = useNotice();
  const { auth, token, register, login, logout } = useAuth();

  const handleNotice = useCallback(
    (nextNotice: Notice) => {
      pushNotice(nextNotice);
    },
    [pushNotice]
  );

  const handleTelemetryError = useCallback(
    (message: string) => {
      showNotice("error", message);
    },
    [showNotice]
  );

  const { devices, refresh, addUserDevice, removeUserDevice } = useDevices(token);

  const { latestTelemetryById, liveTelemetry, wsStatus, refreshLastTelemetry } =
    useTelemetry(token, handleTelemetryError);

  const refreshAll = useCallback(async () => {
    await Promise.all([refresh(), refreshLastTelemetry()]);
  }, [refresh, refreshLastTelemetry]);

  const isAuthenticated = Boolean(token);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[colors.bg0, colors.bg1, colors.bg0]}
        style={styles.background}
      >
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <DashboardHeader
            wsStatus={wsStatus}
            username={auth?.username}
            onLogout={logout}
          />

          <NoticeBanner notice={notice} onDismiss={clearNotice} />

          {isAuthenticated ? (
            <View style={styles.sectionStack}>
              <DeviceSection
                token={token}
                devices={devices}
                presenceById={latestTelemetryById}
                onAddUserDevice={addUserDevice}
                onDeleteDevice={removeUserDevice}
                onRefresh={refreshAll}
                onNotice={handleNotice}
              />
              <TelemetrySection liveTelemetry={liveTelemetry} wsStatus={wsStatus} />
            </View>
          ) : (
            <View style={styles.sectionStack}>
              <AuthSection
                onRegister={register}
                onLogin={login}
                onNotice={handleNotice}
              />
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg0
  },
  background: {
    flex: 1
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40
  },
  sectionStack: {
    marginTop: 24,
    gap: 20
  },
  glowTop: {
    position: "absolute",
    top: -80,
    right: -120,
    width: 320,
    height: 220,
    borderRadius: 200,
    backgroundColor: "rgba(68, 245, 168, 0.18)",
    opacity: 0.8
  },
  glowBottom: {
    position: "absolute",
    bottom: -120,
    left: -100,
    width: 320,
    height: 220,
    borderRadius: 220,
    backgroundColor: "rgba(68, 245, 168, 0.2)",
    opacity: 0.45
  }
});
