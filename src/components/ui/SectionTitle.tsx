// Lab 03 UI primitive: a section heading with an optional count or action text on the right.
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme/tokens';

export function SectionTitle({ title, right }: { title: string; right?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {right ? <Text style={styles.right}>{right}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  right: { fontSize: 13, fontWeight: '600', color: colors.muted },
});
