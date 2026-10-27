// Lab 03 UI primitive: one button with variants, pressed feedback, a disabled state
// and accessibility semantics. The screen only decides what happens on press.
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  icon?: string;
};

export function AppButton({ label, onPress, variant = 'primary', disabled, icon }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, variant === 'primary' ? styles.labelLight : styles.labelDark]}>
        {icon ? `${icon}  ` : ''}
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.primarySoft },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
  pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.4 },
  label: { fontSize: 16, fontWeight: '700' },
  labelLight: { color: colors.white },
  labelDark: { color: colors.primary },
});
