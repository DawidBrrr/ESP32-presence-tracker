import { StyleSheet, Text, View } from "react-native";
import { PulseIcon } from "../../../components/ui/Icons";
import { colors, shadows } from "../../../styles/theme";
import type { Telemetry } from "../../../types/api";

type TelemetrySectionProps = {
  liveTelemetry: Telemetry[];
  wsStatus: string;
};

const statusMap: Record<string, { label: string; color: string }> = {
  connected: { label: "Połączono", color: colors.accent },
  connecting: { label: "Łączenie", color: colors.amber },
  error: { label: "Błąd", color: colors.danger },
  disconnected: { label: "Rozłączono", color: colors.slate }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleTimeString();
};

export function TelemetrySection({ liveTelemetry, wsStatus }: TelemetrySectionProps) {
  const status = statusMap[wsStatus] ?? statusMap.disconnected;

  return (
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <View>
          <View style={styles.tagRow}>
            <PulseIcon size={16} color={colors.accentStrong} />
            <Text style={styles.tagText}>Logi na żywo</Text>
          </View>
          <Text style={styles.subtitle}>Historia aktualizacji z urządzeń.</Text>
        </View>
        <View style={styles.statusPill}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={styles.statusLabel}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.list}>
        {liveTelemetry.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Czekam na aktualizacje z urządzeń.</Text>
          </View>
        ) : (
          liveTelemetry.map((item) => (
            <View key={`${item.id}-${item.timestamp}-live`} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardId}>
                  <PulseIcon size={14} color={colors.accentStrong} />
                  <Text style={styles.cardIdText}>{item.id}</Text>
                </View>
                <Text style={styles.cardTime}>{formatTimestamp(item.timestamp)}</Text>
              </View>
              <Text style={styles.cardValue}>{item.count}</Text>
              <Text style={styles.cardLabel}>osób</Text>
            </View>
          ))
        )}
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
  headerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  tagText: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 3.5,
    color: "rgba(229, 255, 247, 0.7)"
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    color: "rgba(229, 255, 247, 0.7)"
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(68, 245, 168, 0.2)",
    backgroundColor: "rgba(68, 245, 168, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    shadowColor: colors.accent,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 }
  },
  statusLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 2.5,
    color: colors.text
  },
  list: {
    marginTop: 16,
    gap: 12
  },
  emptyCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(68, 245, 168, 0.15)",
    backgroundColor: "rgba(8, 18, 15, 0.7)",
    padding: 14
  },
  emptyText: {
    fontSize: 13,
    color: "rgba(229, 255, 247, 0.6)"
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(68, 245, 168, 0.15)",
    backgroundColor: "rgba(8, 18, 15, 0.7)",
    padding: 14
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10
  },
  cardId: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  cardIdText: {
    fontSize: 12,
    color: "rgba(229, 255, 247, 0.7)"
  },
  cardTime: {
    fontSize: 11,
    color: "rgba(229, 255, 247, 0.6)"
  },
  cardValue: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: "600",
    color: colors.accentStrong,
    textShadowColor: "rgba(68, 245, 168, 0.45)",
    textShadowRadius: 12
  },
  cardLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 3,
    color: "rgba(229, 255, 247, 0.6)"
  }
});
