import type { StyleProp, ViewStyle } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { colors } from "../../styles/theme";

type IconProps = {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function HomeIcon({ size = 24, color = colors.accent, style }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <Path d="M3 10.5 12 3l9 7.5" />
      <Path d="M5 10v9h14v-9" />
      <Path d="M9 19v-6h6v6" />
    </Svg>
  );
}

export function KeyIcon({ size = 24, color = colors.accent, style }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <Circle cx="7.5" cy="12" r="3.5" />
      <Path d="M11 12h10" />
      <Path d="M19 10l2 2-2 2" />
    </Svg>
  );
}

export function PulseIcon({ size = 24, color = colors.accent, style }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <Path d="M3 12h4l2-4 4 8 2-4h4" />
    </Svg>
  );
}

export function SparkIcon({ size = 24, color = colors.accent, style }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <Path d="M12 3l2.2 5.2L19 10l-4.8 1.8L12 17l-2.2-5.2L5 10l4.8-1.8L12 3z" />
    </Svg>
  );
}
