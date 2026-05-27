import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Notice } from "../../../types/ui";
import { colors, shadows } from "../../../styles/theme";

type NoticeBannerProps = {
  notice: Notice | null;
  onDismiss?: () => void;
};

const getNoticeStyles = (notice: Notice) => {
  if (notice.type === "error") {
    return { borderColor: "rgba(248, 113, 113, 0.5)", textColor: "#fee2e2" };
  }

  if (notice.type === "success") {
    return { borderColor: "rgba(68, 245, 168, 0.45)", textColor: "#ecfdf5" };
  }

  return { borderColor: "rgba(68, 245, 168, 0.25)", textColor: colors.text };
};

export function NoticeBanner({ notice, onDismiss }: NoticeBannerProps) {
  if (!notice) {
    return null;
  }

  const palette = getNoticeStyles(notice);

  return (
    <View style={[styles.container, { borderColor: palette.borderColor }]}>
      <Text style={[styles.text, { color: palette.textColor }]}>
        {notice.message}
      </Text>
      {onDismiss ? (
        <Pressable onPress={onDismiss}>
          <Text style={styles.dismiss}>Zamknij</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: colors.panel,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...shadows.panel
  },
  text: {
    fontSize: 13,
    flex: 1
  },
  dismiss: {
    fontSize: 11,
    color: "rgba(229, 255, 247, 0.7)"
  }
});
