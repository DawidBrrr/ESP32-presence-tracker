import { StyleSheet } from "react-native";
import { colors } from "../../styles/theme";

export const inputStyles = StyleSheet.create({
  base: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(68, 245, 168, 0.25)",
    backgroundColor: "#0b1712",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text
  }
});

export const buttonStyles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  text: {
    color: "#0b1411",
    fontSize: 14,
    fontWeight: "600"
  },
  disabled: {
    opacity: 0.6
  }
});

export const buttonGhostStyles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(68, 245, 168, 0.3)",
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  text: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600"
  },
  disabled: {
    opacity: 0.6
  }
});
