// Lab 03 UI primitive: a labelled, controlled input with an error state.
// forwardRef lets a screen hold a useRef to it and call focus() (Lab 02).
// Focus state is tracked with useState so the border turns blue while typing.
import { forwardRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

type Props = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
};

export const AppInput = forwardRef<TextInputInstance, Props>(function AppInput(
  { label, error, hint, style, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        placeholderTextColor="#94A3B8"
        style={[styles.input, focused && styles.inputFocused, !!error && styles.inputError, style]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: colors.textSoft },
  input: {
    minHeight: 50,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
    color: colors.text,
    outlineWidth: 0, // hides the browser's default focus ring on web
    outlineStyle: 'solid',
  },
  inputFocused: { borderColor: colors.primary, backgroundColor: colors.surface },
  inputError: { borderColor: colors.danger, backgroundColor: colors.dangerSoft },
  error: { fontSize: 13, color: colors.danger, fontWeight: '500' },
  hint: { fontSize: 13, color: colors.muted },
});
