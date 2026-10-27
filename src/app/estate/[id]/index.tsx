// Screen 3 — Estate details (Member A). FR2, FR4, FR5 (summary).
// Lab 02: typed route param with useLocalSearchParams, useMemo, controlled form + useRef focus,
// Context via useEstates(). Lab 03: Card, Badge, StatTile, SectionTitle primitives.
import { useMemo, useRef, useState } from 'react';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, type TextInputInstance } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { StatTile } from '@/components/ui/StatTile';
import { useEstates } from '@/features/estates/EstateContext';
import { netEstate, totalAssets, totalDebts } from '@/features/estates/selectors';
import { DOCUMENT_STATUS } from '@/features/estates/statusLabels';
import { colors, radius, spacing } from '@/theme/tokens';
import { formatDate, formatEGP, initials } from '@/utils/format';

export default function EstateDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { estates, heirs, entries, documents, addHeir } = useEstates();

  const [heirName, setHeirName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [nameError, setNameError] = useState('');
  const [relError, setRelError] = useState('');
  const nameRef = useRef<TextInputInstance>(null);
  const relRef = useRef<TextInputInstance>(null);

  const estate = estates.find((e) => e.id === id);
  const estateHeirs = useMemo(() => heirs.filter((h) => h.estateId === id), [heirs, id]);
  const estateDocs = useMemo(() => documents.filter((d) => d.estateId === id), [documents, id]);
  const totals = useMemo(
    () => ({
      assets: totalAssets(entries, id),
      debts: totalDebts(entries, id),
      net: netEstate(entries, id),
    }),
    [entries, id],
  );

  if (!estate) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <Card style={styles.notFound}>
          <Text style={styles.notFoundIcon}>🔍</Text>
          <Text style={styles.notFoundTitle}>Estate not found</Text>
          <Text style={styles.muted}>It may have been removed, or the link is wrong.</Text>
          <AppButton label="Back to estates" onPress={() => router.replace('/')} />
        </Card>
      </View>
    );
  }

  function saveHeir() {
    setNameError('');
    setRelError('');
    if (!heirName.trim()) {
      setNameError("Enter the heir's name.");
      nameRef.current?.focus();
      return;
    }
    if (!relationship.trim()) {
      setRelError('Enter the relationship, e.g. Son, Wife, Brother.');
      relRef.current?.focus();
      return;
    }
    addHeir(id, heirName.trim(), relationship.trim());
    setHeirName('');
    setRelationship('');
    nameRef.current?.focus();
  }

  const verifiedCount = estateDocs.filter((d) => d.status === 'verified').length;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: estate.deceasedName }} />

      {/* Header */}
      <Card style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(estate.deceasedName)}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerLabel}>Estate of</Text>
          <Text style={styles.headerName}>{estate.deceasedName}</Text>
          <Text style={styles.muted}>Died {formatDate(estate.deathDate)}</Text>
        </View>
      </Card>

      {/* Net estate summary */}
      <SectionTitle title="Summary" />
      <View style={styles.tiles}>
        <StatTile label="Assets" value={formatEGP(totals.assets)} tone="success" />
        <StatTile label="Debts" value={formatEGP(totals.debts)} tone="danger" />
      </View>
      <Card style={styles.netCard}>
        <Text style={styles.netLabel}>Net estate (assets − debts)</Text>
        <Text style={styles.netValue}>{formatEGP(totals.net)}</Text>
      </Card>

      <View style={styles.actionsRow}>
        <View style={styles.flex1}>
          <AppButton
            label="View shares"
            onPress={() => router.push({ pathname: '/estate/[id]/shares', params: { id } })}
          />
        </View>
        <View style={styles.flex1}>
          <AppButton
            label="View report"
            variant="secondary"
            onPress={() => router.push({ pathname: '/estate/[id]/report', params: { id } })}
          />
        </View>
      </View>

      {/* Heirs */}
      <SectionTitle title="Heirs" right={`${estateHeirs.length} registered`} />
      <Card style={styles.listCard}>
        {estateHeirs.length === 0 ? (
          <Text style={styles.emptyLine}>No heirs yet. Add the first one below.</Text>
        ) : (
          estateHeirs.map((heir, index) => (
            <View key={heir.id} style={[styles.listRow, index > 0 && styles.divider]}>
              <View style={styles.smallAvatar}>
                <Text style={styles.smallAvatarText}>{initials(heir.name)}</Text>
              </View>
              <Text style={styles.rowTitle}>{heir.name}</Text>
              <Badge label={heir.relationship} tone="info" />
            </View>
          ))
        )}
      </Card>

      <Card style={styles.form}>
        <Text style={styles.formTitle}>Add an heir</Text>
        <AppInput
          ref={nameRef}
          label="Full name"
          placeholder="e.g. Omar Ahmad"
          value={heirName}
          onChangeText={setHeirName}
          error={nameError}
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => relRef.current?.focus()}
        />
        <AppInput
          ref={relRef}
          label="Relationship to the deceased"
          placeholder="e.g. Son, Wife, Brother"
          value={relationship}
          onChangeText={setRelationship}
          error={relError}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={saveHeir}
        />
        <AppButton label="Add heir" icon="＋" variant="secondary" onPress={saveHeir} />
      </Card>

      {/* Document vault */}
      <SectionTitle title="Document vault" right={`${verifiedCount}/${estateDocs.length} verified`} />
      <Card style={styles.listCard}>
        {estateDocs.length === 0 ? (
          <Text style={styles.emptyLine}>No documents recorded yet.</Text>
        ) : (
          estateDocs.map((doc, index) => {
            const status = DOCUMENT_STATUS[doc.status];
            return (
              <View key={doc.id} style={[styles.listRow, index > 0 && styles.divider]}>
                <View style={styles.docIcon}>
                  <Text>📄</Text>
                </View>
                <Text style={styles.rowTitle}>{doc.title}</Text>
                <Badge label={status.label} tone={status.tone} />
              </View>
            );
          })
        )}
      </Card>
      <Text style={styles.note}>
        Capturing documents with the camera is planned for a later phase.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: spacing.xxl * 2, width: '100%', maxWidth: 640, alignSelf: 'center' },
  center: { flex: 1, justifyContent: 'center', padding: spacing.xl },
  notFound: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl },
  notFoundIcon: { fontSize: 36 },
  notFoundTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  flex1: { flex: 1 },
  muted: { fontSize: 14, color: colors.muted },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.white, fontSize: 20, fontWeight: '800' },
  headerText: { flex: 1, gap: 2 },
  headerLabel: { fontSize: 12, fontWeight: '700', color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.6 },
  headerName: { fontSize: 22, fontWeight: '800', color: colors.text },
  tiles: { flexDirection: 'row', gap: spacing.md },
  netCard: { marginTop: spacing.md, gap: 4 },
  netLabel: { fontSize: 13, fontWeight: '600', color: colors.muted },
  netValue: { fontSize: 26, fontWeight: '800', color: colors.primary },
  actionsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  listCard: { paddingVertical: spacing.sm },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  smallAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallAvatarText: { fontSize: 13, fontWeight: '800', color: colors.primary },
  docIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  emptyLine: { color: colors.muted, paddingVertical: spacing.md, textAlign: 'center' },
  form: { marginTop: spacing.md, gap: spacing.lg },
  formTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  note: { marginTop: spacing.sm, fontSize: 12, color: colors.muted, textAlign: 'center' },
});
