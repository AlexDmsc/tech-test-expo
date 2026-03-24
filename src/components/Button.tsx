import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, radius } from '@/constants/theme';

import { Text } from './Text';

export type ButtonColor = 'blue' | 'green' | 'neutral';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  children: string;
  onPress?: () => void;
  disabled?: boolean;
  color?: ButtonColor;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const colorMap: Record<ButtonColor, { bg: string; text: string }> = {
  blue: { bg: Colors.accentBlue, text: '#fff' },
  green: { bg: Colors.accentGreen, text: '#1B5E20' },
  neutral: { bg: Colors.foregroundMuted, text: '#fff' },
};

const sizeMap: Record<ButtonSize, { paddingH: number; paddingV: number; fontSize: number }> = {
  sm: { paddingH: 12, paddingV: 8, fontSize: 14 },
  md: { paddingH: 20, paddingV: 12, fontSize: 16 },
  lg: { paddingH: 24, paddingV: 16, fontSize: 18 },
};

export function Button({
  children,
  onPress,
  disabled = false,
  color = 'blue',
  size = 'md',
  fullWidth = false,
}: ButtonProps) {
  const { bg, text } = colorMap[color];
  const { paddingH, paddingV, fontSize } = sizeMap[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        backgroundColor: bg,
        paddingHorizontal: paddingH,
        paddingVertical: paddingV,
        borderRadius: radius.md,
        opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
        ...(fullWidth && { alignSelf: 'stretch' as const }),
      })}>
      <View style={styles.content}>
        <Text style={[styles.label, { color: text, fontSize }]}>{children}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
  },
});
