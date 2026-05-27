import { Pressable, StyleSheet, Text, View } from "react-native";
import { buttonStyles } from "../../../components/ui/styles";
import { colors, shadows } from "../../../styles/theme";

type DashboardHeaderProps = {
  wsStatus: string;
  username?: string;
  onLogout?: () => void;
};

const statusMap: Record<string, { label: string; color: string }> = {
  connected: { label: "Połączono", color: colors.accent },
  connecting: { label: "Łączenie", color: colors.amber },
  error: { label: "Błąd", color: colors.danger },
  disconnected: { label: "Rozłączono", color: colors.slate }
};

export function DashboardHeader({
  wsStatus,
  username,
  onLogout
}: DashboardHeaderProps) {
  const status = statusMap[wsStatus] ?? statusMap.disconnected;

  return (
    <View>
      <View style={styles.subheadingRow}>
        <View style={[styles.statusDot, { backgroundColor: status.color }]} />
        <Text style={styles.subheading}>Panel obecności</Text>
      </View>

      <View style={styles.headerRow}>
        <View style={styles.headingBlock}>
          <Text style={styles.title}>Presence Tracker</Text>
          <Text style={styles.subtitle}>
            Monitoruj obecność w pomieszczeniach w czasie rzeczywistym
          </Text>
        </View>

        <View style={styles.actions}>
          <View style={styles.statusPill}>
            <View style={[styles.statusDot, { backgroundColor: status.color }]} />
            <Text style={styles.statusLabel}>{status.label}</Text>
          </View>
          {username ? (
            <View style={styles.userBlock}>
              <Text style={styles.userLabel}>Witaj, {username}</Text>
              <Pressable style={buttonStyles.base} onPress={onLogout}>
                <Text style={buttonStyles.text}>Wyloguj</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subheadingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  subheading: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 3,
    color: "rgba(229, 255, 247, 0.7)"
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginRight: 10,
    shadowColor: colors.accent,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 }
  },
  headerRow: {
    flexDirection: "column",
    gap: 16
  },
  headingBlock: {
    maxWidth: 420
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.text
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: "rgba(229, 255, 247, 0.7)"
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(68, 245, 168, 0.2)",
    backgroundColor: "rgba(68, 245, 168, 0.08)",
    ...shadows.panel
  },
  statusLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 2.5,
    color: colors.text
  },
  userBlock: {
    alignItems: "flex-end",
    gap: 8
  },
  userLabel: {
    fontSize: 12,
    color: "rgba(229, 255, 247, 0.7)"
  }
});
