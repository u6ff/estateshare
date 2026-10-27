// Screen 7 — Share calculator (Member A). FR5.
// Lab 02: typed route param, useMemo so the calculation only re-runs when its inputs change.
// The maths lives in a pure function (calculateShares), not in the screen.
import { useMemo } from 'react';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useEstates } from '@/features/estates/EstateContext';
import { netEstate, totalAssets, totalDebts } from '@/features/estates/selectors';
import { ASSUMPTIONS, calculateShares } from '@/features/shares/calculateShares';
import { colors, radius, spacing } from '@/theme/tokens';
import { formatEGP, initials } from '@/utils/format';

export default function SharesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { estates, heirs, entries } = useEstates();
  const estate = estates.find((e) => e.id === id);

  const net = useMemo(() => netEstate(entries, id), [entries, id]);
  const shares = useMemo(
    () => calculateShares(heirs.filter((h) => h.estateId === id), net),
    [heirs, id, net],
  );

  if (!estate) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Estate not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Proposed shares' }} />

      <View style={styles.hero}>
        <Text style={styles.heroLabel}>Net estate to distribute</Text>
        <Text style={styles.heroValue}>{formatEGP(Math.max(net, 0))}</Text>
        <View style={styles.heroRow}>
          <Text style={styles.heroMeta}>Assets {formatEGP(totalAssets(entries, id))}</Text>
          <Text style={styles.heroMeta}>Debts {formatEGP(totalDebts(entries, id))}</Text>
        </View>
      </View>

      {net < 0 && (
        <Card style={styles.warning}>
          <Text style={styles.warningText}>
            Debts are higher than assets, so there is nothing to distribute yet.
          </Text>
        </Card>
      )}

      <SectionTitle title={`Heirs of ${estate.deceasedName}`} right={`${shares.length} heirs`} />

      {shares.length === 0 ? (
        <Card style={styles.empty}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={styles.emptyTitle}>No heirs registered</Text>
          <Text style={styles.muted}>Add heirs on the estate page to see their shares.</Text>
          <AppButton label="Go to estate" variant="secondary" onPress={() => router.back()} />
        </Card>
      ) : (
        <View style={styles.list}>
          {shares.map((share) => (
            <Card key={share.heirId} style={styles.shareCard}>
              <View style={styles.shareTop}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials(share.name)}</Text>
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.name}>{share.name}</Text>
                  <Badge label={share.relationship} tone="info" />
                </View>
                <View style={styles.amountBox}>
                  <Text style={styles.amount}>{formatEGP(share.amount)}</Text>
                  <Text style={styles.muted}>
                    {share.fraction} · {share.percentage}%
                  </Text>
                </View>
              </View>
              <View
                style={styles.track}
                accessibilityRole="progressbar"
                accessibilityValue={{ min: 0, max: 100, now: share.percentage }}
              >
                <View style={[styles.fill, { width: `${share.percentage}%` }]} />
              </View>
            </Card>
          ))}
        </View>
      )}

      <SectionTitle title="Assumptions used" />
      <Card style={styles.assumptions}>
        {ASSUMPTIONS.map((line) => (
          <View key={line} style={styles.bulletRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.assumptionText}>{line}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: spacing.xxl * 2, width: '100%', maxWidth: 640, alignSelf: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  flex1: { flex: 1, gap: 4, alignItems: 'flex-start' },
  muted: { fontSize: 13, color: colors.muted },
  hero: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.xl, gap: 4 },
  heroLabel: { color: '#C7D6FD', fontSize: 13, fontWeight: '600' },
  heroValue: { color: colors.white, fontSize: 30, fontWeight: '800' },
  heroRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, marginTop: 4 },
  heroMeta: { color: '#C7D6FD', fontSize: 13 },
  warning: { marginTop: spacing.md, backgroundColor: colors.warningSoft, borderColor: '#FDE68A' },
  warningText: { color: colors.warning, fontWeight: '600' },
  list: { gap: spacing.md },
  shareCard: { gap: spacing.md },
  shareTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '800', color: colors.primary },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  amountBox: { alignItems: 'flex-end', gap: 2 },
  amount: { fontSize: 16, fontWeight: '800', color: colors.success },
  track: { height: 8, borderRadius: radius.pill, backgroundColor: colors.surfaceMuted, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.primary },
  empty: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  emptyIcon: { fontSize: 32 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  assumptions: { backgroundColor: colors.surfaceMuted, gap: spacing.sm },
  bulletRow: { flexDirection: 'row', gap: spacing.sm },
  bullet: { color: colors.primary, fontWeight: '800' },
  assumptionText: { flex: 1, fontSize: 14, color: colors.textSoft, lineHeight: 20 },
});
