// Screen 1 (Member A). Lab 02: FlatList, keyExtractor, router.push. Lab 03: UI primitives.
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { useEstates } from '@/features/estates/EstateContext';
import { colors, spacing } from '@/theme/tokens';

export default function EstatesScreen() {
  const { estates } = useEstates();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Estates</Text>
        <Text style={styles.subtitle}>Track every estate, heir and asset in one place.</Text>
      </View>

      <View style={styles.actions}>
        <AppButton label="New estate" onPress={() => router.push('/estate/new')} />
      </View>

      <FlatList
        data={estates}
        keyExtractor={(estate) => estate.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Card style={styles.empty}>
            <Text style={styles.emptyTitle}>No estates yet</Text>
            <Text style={styles.emptyText}>Create one to get started.</Text>
          </Card>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(`/estate/${item.id}`)}
            style={({ pressed }) => pressed && { opacity: 0.85 }}
          >
            <Card style={styles.row}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.deceasedName.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.rowText}>
                <Text style={styles.name}>{item.deceasedName}</Text>
                <Text style={styles.meta}>Died {item.deathDate}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Card>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, paddingTop: 64, paddingHorizontal: spacing.xl },
  header: { marginBottom: spacing.lg },
  title: { fontSize: 30, fontWeight: '700', color: colors.text },
  subtitle: { marginTop: spacing.xs, fontSize: 15, color: colors.muted },
  actions: { marginBottom: spacing.xl },
  list: { gap: spacing.md, paddingBottom: spacing.xxl },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700', color: colors.primary },
  rowText: { flex: 1 },
  name: { fontSize: 17, fontWeight: '600', color: colors.text },
  meta: { marginTop: 2, fontSize: 14, color: colors.muted },
  chevron: { fontSize: 24, color: colors.muted },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
  emptyText: { marginTop: spacing.xs, color: colors.muted },
});
