// Lab 03 UI primitive: a small figure tile (label + value) for summaries.
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

type Tone = 'success' | 'danger' | 'primary';

const TONES: Record<Tone, { bg: string; fg: string }> = {
  success: { bg: colors.successSoft, fg: colors.success },
  danger: { bg: colors.dangerSoft, fg: colors.danger },
  primary: { bg: colors.primarySoft, fg: colors.primary },
};

export function StatTile({ label, value, tone }: { label: string; value: string; tone: Tone }) {
  const t = TONES[tone];
  return (
    <View style={[styles.tile, { backgroundColor: t.bg }]}>
      <Text style={[styles.label, { color: t.fg }]}>{label}</Text>
      <Text style={[styles.value, { color: t.fg }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, borderRadius: radius.md, padding: spacing.md, gap: 4, minWidth: 0 },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  value: { fontSize: 15, fontWeight: '800' },
});
