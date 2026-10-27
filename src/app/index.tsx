// Screen 1 — Estates list (Member A).
// Lab 02: FlatList with keyExtractor, useMemo, Context via useEstates(), router.push with a route param.
// Lab 03: built from UI primitives (Card, AppButton) and theme tokens.
import { useMemo } from 'react';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { useEstates } from '@/features/estates/EstateContext';
import { netEstate } from '@/features/estates/selectors';
import { colors, radius, spacing } from '@/theme/tokens';
import { formatDate, formatEGP, initials } from '@/utils/format';

export default function EstatesScreen() {
  const { estates, heirs, entries, tasks } = useEstates();

  // Build each card's figures once, and again only when the data changes.
  const rows = useMemo(
    () =>
      estates.map((estate) => ({
        ...estate,
        heirCount: heirs.filter((h) => h.estateId === estate.id).length,
        net: netEstate(entries, estate.id),
        openTasks: tasks.filter((t) => t.estateId === estate.id && t.status !== 'done').length,
      })),
    [estates, heirs, entries, tasks],
  );

  const totalNet = rows.reduce((sum, r) => sum + r.net, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={rows}
        keyExtractor={(row) => row.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            <Text style={styles.brand}>EstateShare</Text>
            <Text style={styles.title}>Your estates</Text>
            <Text style={styles.subtitle}>
              One shared place for heirs, assets, documents and progress.
            </Text>

            <View style={styles.hero}>
              <Text style={styles.heroLabel}>Combined net value</Text>
              <Text style={styles.heroValue}>{formatEGP(totalNet)}</Text>
              <Text style={styles.heroMeta}>
                {rows.length} {rows.length === 1 ? 'estate' : 'estates'} being settled
              </Text>
            </View>

            <AppButton label="New estate" icon="＋" onPress={() => router.push('/estate/new')} />
            <Text style={styles.listLabel}>All estates</Text>
          </View>
        }
        ListEmptyComponent={
          <Card style={styles.empty}>
            <Text style={styles.emptyIcon}>🗂️</Text>
            <Text style={styles.emptyTitle}>No estates yet</Text>
            <Text style={styles.emptyText}>Create one to start tracking heirs and assets.</Text>
          </Card>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open estate of ${item.deceasedName}`}
            onPress={() => router.push({ pathname: '/estate/[id]', params: { id: item.id } })}
            style={({ pressed }) => [styles.rowWrap, pressed && styles.pressed]}
          >
            <Card style={styles.row}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials(item.deceasedName)}</Text>
              </View>
              <View style={styles.rowBody}>
                <Text style={styles.name}>{item.deceasedName}</Text>
                <Text style={styles.meta}>Died {formatDate(item.deathDate)}</Text>
                <Text style={styles.netValue}>Net {formatEGP(item.net)}</Text>
                <View style={styles.chips}>
                  <Text style={styles.chip}>
                    👥 {item.heirCount} {item.heirCount === 1 ? 'heir' : 'heirs'}
                  </Text>
                  <Text style={styles.chip}>
                    📝 {item.openTasks} open {item.openTasks === 1 ? 'task' : 'tasks'}
                  </Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Card>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl, width: '100%', maxWidth: 640, alignSelf: 'center' },
  headerWrap: { gap: spacing.lg, marginBottom: spacing.md },
  brand: { fontSize: 13, fontWeight: '800', color: colors.primary, letterSpacing: 1.2, textTransform: 'uppercase' },
  title: { fontSize: 32, fontWeight: '800', color: colors.text, marginTop: -8 },
  subtitle: { fontSize: 15, color: colors.muted, marginTop: -8, lineHeight: 21 },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: 4,
  },
  heroLabel: { color: '#C7D6FD', fontSize: 13, fontWeight: '600' },
  heroValue: { color: colors.white, fontSize: 30, fontWeight: '800' },
  heroMeta: { color: '#C7D6FD', fontSize: 13 },
  listLabel: { fontSize: 13, fontWeight: '700', color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: spacing.sm },
  rowWrap: { marginBottom: spacing.md },
  pressed: { opacity: 0.85 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 17, fontWeight: '800', color: colors.primary },
  rowBody: { flex: 1, gap: 2 },
  name: { fontSize: 17, fontWeight: '700', color: colors.text },
  meta: { fontSize: 13, color: colors.muted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: 6 },
  chip: {
    fontSize: 12,
    color: colors.textSoft,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  netValue: { fontSize: 15, fontWeight: '800', color: colors.success, marginTop: 2 },
  chevron: { fontSize: 26, color: '#CBD5E1', lineHeight: 28 },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl, gap: 6 },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  emptyText: { color: colors.muted, textAlign: 'center' },
});
