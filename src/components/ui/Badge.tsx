// Lab concept: reusable UI primitive — small coloured pill; the screen decides which tone to use.
import { Text, View } from 'react-native';

export type BadgeTone = 'danger' | 'warning' | 'success' | 'neutral';

const TONES: Record<BadgeTone, { box: string; label: string }> = {
  danger: { box: 'bg-red-100', label: 'text-danger' },
  warning: { box: 'bg-amber-100', label: 'text-warning' },
  success: { box: 'bg-green-100', label: 'text-success' },
  neutral: { box: 'bg-gray-100', label: 'text-muted' },
};

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  return (
    <View className={`self-start rounded-full px-md py-xs ${TONES[tone].box}`}>
      <Text className={`text-xs font-semibold capitalize ${TONES[tone].label}`}>{label}</Text>
    </View>
  );
}
