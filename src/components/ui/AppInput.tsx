// Lab concept: reusable UI primitive — labelled TextInput that forwards its ref (for useRef/focus).
import { Ref } from 'react';
import { Text, TextInput, TextInputInstance, TextInputProps, View } from 'react-native';

import { colors } from '@/src/theme/tokens';

type AppInputProps = TextInputProps & {
  label: string;
  error?: string;
  ref?: Ref<TextInputInstance>;
};

export function AppInput({ label, error, ref, ...inputProps }: AppInputProps) {
  const hasError = Boolean(error);

  return (
    <View className="mb-lg">
      <Text className="mb-xs text-sm font-semibold text-text">{label}</Text>
      <TextInput
        ref={ref}
        placeholderTextColor={colors.muted}
        className={`rounded-sm border bg-surface px-md py-md text-base text-text ${
          hasError ? 'border-danger' : 'border-border'
        }`}
        {...inputProps}
      />
      {hasError && <Text className="mt-xs text-sm text-danger">{error}</Text>}
    </View>
  );
}
