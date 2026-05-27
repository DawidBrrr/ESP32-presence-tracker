import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { HomeIcon } from "../../../components/ui/Icons";
import { buttonGhostStyles, buttonStyles, inputStyles } from "../../../components/ui/styles";
import { colors, shadows } from "../../../styles/theme";
import type {
  Device,
  Telemetry,
  UserDeviceCreateRequest,
  UserDeviceCreateResponse
} from "../../../types/api";
import type { Notice } from "../../../types/ui";

type DeviceSectionProps = {
  token: string;
  devices: Device[];
  presenceById: Record<string, Telemetry | undefined>;
  onAddUserDevice: (
    payload: UserDeviceCreateRequest
  ) => Promise<UserDeviceCreateResponse>;
  onDeleteDevice: (id: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  onNotice: (notice: Notice) => void;
};

const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) {
    return "Brak danych";
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleString();
};

export function DeviceSection({
  token,
  devices,
  presenceById,
  onAddUserDevice,
  onDeleteDevice,
  onRefresh,
  onNotice
}: DeviceSectionProps) {
  const [userDeviceForm, setUserDeviceForm] = useState({ id: "" });
  const [busy, setBusy] = useState(false);

  const handleAddUserDevice = async () => {
    if (!token) {
      onNotice({ type: "error", message: "Zaloguj się, aby dodać urządzenie." });
      return;
    }

    setBusy(true);

    try {
      await onAddUserDevice(userDeviceForm);
      setUserDeviceForm({ id: "" });
      await onRefresh();
      onNotice({ type: "success", message: "Urządzenie zostało dodane." });
    } catch (error) {
      onNotice({ type: "error", message: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteDevice = async (id: string) => {
    if (!token) {
      onNotice({ type: "error", message: "Zaloguj się, aby usunąć urządzenie." });
      return;
    }

    setBusy(true);

    try {
      await onDeleteDevice(id);
      await onRefresh();
      onNotice({ type: "success", message: "Urządzenie zostało usunięte." });
    } catch (error) {
      onNotice({ type: "error", message: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const handleRefresh = async () => {
    if (!token) {
      onNotice({ type: "error", message: "Zaloguj się, aby odświeżyć dane." });
      return;
    }

    setBusy(true);

    try {
      await onRefresh();
    } catch (error) {
      onNotice({ type: "error", message: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Twoje pomieszczenia</Text>
          <Text style={styles.subtitle}>Dane aktualizowane w czasie rzeczywistym.</Text>
        </View>
        <Pressable
          style={[buttonGhostStyles.base, busy && buttonGhostStyles.disabled]}
          onPress={handleRefresh}
          disabled={busy || !token}
        >
          <Text style={buttonGhostStyles.text}>Odśwież dane</Text>
        </Pressable>
      </View>

      <View style={styles.formRow}>
        <TextInput
          style={inputStyles.base}
          placeholder="Identyfikator urządzenia"
          placeholderTextColor="rgba(229, 255, 247, 0.4)"
          value={userDeviceForm.id}
          onChangeText={(text) => setUserDeviceForm({ id: text })}
        />
        <Pressable
          style={[buttonStyles.base, busy && buttonStyles.disabled]}
          onPress={handleAddUserDevice}
          disabled={busy || !token}
        >
          <Text style={buttonStyles.text}>Dodaj urządzenie</Text>
        </Pressable>
      </View>

      <View style={styles.cardGrid}>
        {devices.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Brak urządzeń. Dodaj pierwsze pomieszczenie, aby rozpocząć.
            </Text>
          </View>
        ) : (
          devices.map((device) => {
            const telemetry = presenceById[device.id];
            const countLabel = telemetry ? String(telemetry.count) : "--";
            const countText = telemetry ? "osób" : "brak danych";

            return (
              <View key={device.id} style={styles.deviceCard}>
                <View style={styles.deviceHeader}>
                  <View style={styles.deviceMeta}>
                    <View style={styles.iconBadge}>
                      <HomeIcon size={22} color={colors.accentStrong} />
                    </View>
                    <View>
                      <Text style={styles.deviceLabel}>Pokój</Text>
                      <Text style={styles.deviceName}>{device.name}</Text>
                    </View>
                  </View>
                  <Pressable onPress={() => handleDeleteDevice(device.id)}>
                    <Text style={styles.deleteText}>Usuń</Text>
                  </Pressable>
                </View>

                <View style={styles.countBlock}>
                  <Text style={styles.countValue}>{countLabel}</Text>
                  <Text style={styles.countLabel}>{countText}</Text>
                </View>

                <Text style={styles.timestamp}>
                  Ostatnia aktualizacja: {formatTimestamp(telemetry?.timestamp)}
                </Text>
              </View>
            );
          })
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
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "rgba(229, 255, 247, 0.7)"
  },
  formRow: {
    marginTop: 16,
    gap: 10
  },
  cardGrid: {
    marginTop: 16,
    gap: 14
  },
  emptyCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(68, 245, 168, 0.15)",
    backgroundColor: "rgba(8, 18, 15, 0.7)",
    padding: 16
  },
  emptyText: {
    fontSize: 13,
    color: "rgba(229, 255, 247, 0.6)"
  },
  deviceCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(68, 245, 168, 0.15)",
    backgroundColor: "rgba(8, 18, 15, 0.8)",
    padding: 16
  },
  deviceHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12
  },
  deviceMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(68, 245, 168, 0.12)"
  },
  deviceLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 2.5,
    color: "rgba(229, 255, 247, 0.6)"
  },
  deviceName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text
  },
  deleteText: {
    fontSize: 12,
    color: "rgba(248, 113, 113, 0.8)"
  },
  countBlock: {
    marginTop: 14
  },
  countValue: {
    fontSize: 30,
    fontWeight: "600",
    color: colors.accentStrong,
    textShadowColor: "rgba(68, 245, 168, 0.5)",
    textShadowRadius: 16
  },
  countLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 3,
    color: "rgba(229, 255, 247, 0.6)"
  },
  timestamp: {
    marginTop: 12,
    fontSize: 11,
    color: "rgba(229, 255, 247, 0.6)"
  }
});
