// Screen 9 — Estate report (Member A). FR7.
// Lab 02: typed route param, useMemo, Context via useEstates(), list rendering with stable keys.
// Reuses the same pure functions as the other screens, so every number matches.
import { useMemo } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { StatTile } from '@/components/ui/StatTile';
import { useEstates } from '@/features/estates/EstateContext';
import { netEstate, totalAssets, totalDebts } from '@/features/estates/selectors';
import { DOCUMENT_STATUS, TASK_STATUS } from '@/features/estates/statusLabels';
import { calculateShares } from '@/features/shares/calculateShares';
import type { DocumentStatus, Entry, TaskStatus } from '@/data/types';
import { colors, radius, spacing } from '@/theme/tokens';
import { formatDate, formatEGP } from '@/utils/format';

const TASK_ORDER: TaskStatus[] = ['pending', 'in_progress', 'done'];
const DOC_ORDER: DocumentStatus[] = ['missing', 'submitted', 'verified'];

export default function ReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { estates, heirs, entries, documents, tasks } = useEstates();
  const estate = estates.find((e) => e.id === id);

  const report = useMemo(() => {
    const own = entries.filter((e) => e.estateId === id);
    const net = netEstate(entries, id);
    const estateTasks = tasks.filter((t) => t.estateId === id);
    const estateDocs = documents.filter((d) => d.estateId === id);
    return {
      assets: own.filter((e) => e.kind === 'asset'),
      debts: own.filter((e) => e.kind === 'debt'),
      totalAssets: totalAssets(entries, id),
      totalDebts: totalDebts(entries, id),
      net,
      shares: calculateShares(heirs.filter((h) => h.estateId === id), net),
      tasks: estateTasks,
      taskCounts: TASK_ORDER.map((s) => ({ status: s, count: estateTasks.filter((t) => t.status === s).length })),
      docCounts: DOC_ORDER.map((s) => ({ status: s, count: estateDocs.filter((d) => d.status === s).length })),
      docTotal: estateDocs.length,
    };
  }, [entries, heirs, tasks, documents, id]);

  if (!estate) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Estate not found.</Text>
      </View>
    );
  }

  const doneTasks = report.taskCounts.find((t) => t.status === 'done')?.count ?? 0;
  const progress = report.tasks.length ? Math.round((doneTasks / report.tasks.length) * 100) : 0;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Estate report' }} />

      <View style={styles.titleBlock}>
        <Text style={styles.kicker}>ESTATE REPORT</Text>
        <Text style={styles.title}>{estate.deceasedName}</Text>
        <Text style={styles.muted}>Died {formatDate(estate.deathDate)}</Text>
      </View>

      {/* Financial summary */}
      <SectionTitle title="Financial summary" />
      <View style={styles.tiles}>
        <StatTile label="Assets" value={formatEGP(report.totalAssets)} tone="success" />
        <StatTile label="Debts" value={formatEGP(report.totalDebts)} tone="danger" />
      </View>
      <Card style={styles.netCard}>
        <Text style={styles.netLabel}>Net estate</Text>
        <Text style={styles.netValue}>{formatEGP(report.net)}</Text>
      </Card>

      <EntryTable title="Assets" rows={report.assets} tone="asset" />
      <EntryTable title="Debts" rows={report.debts} tone="debt" />

      {/* Shares */}
      <SectionTitle title="Proposed shares" right="Equal division" />
      <Card style={styles.table}>
        <View style={[styles.tr, styles.thRow]}>
          <Text style={[styles.th, styles.colName]}>Heir</Text>
          <Text style={[styles.th, styles.colPct]}>Share</Text>
          <Text style={[styles.th, styles.colAmt]}>Amount</Text>
        </View>
        {report.shares.length === 0 ? (
          <Text style={styles.emptyLine}>No heirs registered.</Text>
        ) : (
          report.shares.map((s) => (
            <View key={s.heirId} style={styles.tr}>
              <View style={styles.colName}>
                <Text style={styles.td}>{s.name}</Text>
                <Text style={styles.small}>{s.relationship}</Text>
              </View>
              <Text style={[styles.td, styles.colPct]}>{s.percentage}%</Text>
              <Text style={[styles.tdStrong, styles.colAmt]}>{formatEGP(s.amount)}</Text>
            </View>
          ))
        )}
      </Card>

      {/* Tasks */}
      <SectionTitle title="Distribution progress" right={`${progress}% done`} />
      <Card style={styles.block}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.counts}>
          {report.taskCounts.map(({ status, count }) => (
            <View key={status} style={styles.countItem}>
              <Text style={styles.countNum}>{count}</Text>
              <Badge label={TASK_STATUS[status].label} tone={TASK_STATUS[status].tone} />
            </View>
          ))}
        </View>
        {report.tasks
          .filter((t) => t.status !== 'done')
          .map((t) => (
            <View key={t.id} style={styles.taskRow}>
              <Text style={styles.td}>{t.title}</Text>
              <Text style={styles.small}>Due {formatDate(t.deadline)}</Text>
            </View>
          ))}
      </Card>

      {/* Documents */}
      <SectionTitle title="Documents" right={`${report.docTotal} total`} />
      <Card style={styles.counts}>
        {report.docCounts.map(({ status, count }) => (
          <View key={status} style={styles.countItem}>
            <Text style={styles.countNum}>{count}</Text>
            <Badge label={DOCUMENT_STATUS[status].label} tone={DOCUMENT_STATUS[status].tone} />
          </View>
        ))}
      </Card>

      <Text style={styles.footer}>
        Generated by EstateShare · figures are a proposal, not a legal ruling.
      </Text>
    </ScrollView>
  );
}

// A small sub-component reused for the assets and debts tables (Lab 02: props).
function EntryTable({ title, rows, tone }: { title: string; rows: Entry[]; tone: 'asset' | 'debt' }) {
  return (
    <>
      <SectionTitle title={title} right={`${rows.length} items`} />
      <Card style={styles.table}>
        {rows.length === 0 ? (
          <Text style={styles.emptyLine}>None recorded.</Text>
        ) : (
          rows.map((row, i) => (
            <View key={row.id} style={[styles.tr, i === 0 && styles.firstRow]}>
              <View style={styles.colName}>
                <Text style={styles.td}>{row.name}</Text>
                <Text style={styles.small}>
                  {row.category} · {row.location}
                </Text>
              </View>
              <Text style={[styles.tdStrong, tone === 'asset' ? styles.pos : styles.neg]}>
                {tone === 'debt' ? '− ' : ''}
                {formatEGP(row.value)}
              </Text>
            </View>
          ))
        )}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: spacing.xxl * 2, width: '100%', maxWidth: 640, alignSelf: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { fontSize: 14, color: colors.muted },
  titleBlock: { gap: 2 },
  kicker: { fontSize: 12, fontWeight: '800', color: colors.primary, letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  tiles: { flexDirection: 'row', gap: spacing.md },
  netCard: { marginTop: spacing.md, gap: 4 },
  netLabel: { fontSize: 13, fontWeight: '600', color: colors.muted },
  netValue: { fontSize: 26, fontWeight: '800', color: colors.primary },
  table: { paddingVertical: spacing.xs },
  tr: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  firstRow: { borderTopWidth: 0 },
  thRow: { borderTopWidth: 0, paddingBottom: spacing.sm },
  th: { fontSize: 12, fontWeight: '700', color: colors.muted, textTransform: 'uppercase' },
  colName: { flex: 1 },
  colPct: { width: 60, textAlign: 'right' },
  colAmt: { width: 120, textAlign: 'right' },
  td: { fontSize: 15, color: colors.text, fontWeight: '500' },
  tdStrong: { fontSize: 15, fontWeight: '800', color: colors.text },
  small: { fontSize: 12, color: colors.muted, marginTop: 2 },
  pos: { color: colors.success },
  neg: { color: colors.danger },
  emptyLine: { color: colors.muted, paddingVertical: spacing.md, textAlign: 'center' },
  block: { gap: spacing.md },
  track: { height: 10, borderRadius: radius.pill, backgroundColor: colors.surfaceMuted, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.success },
  counts: { flexDirection: 'row', justifyContent: 'space-around', gap: spacing.sm },
  countItem: { alignItems: 'center', gap: 6 },
  countNum: { fontSize: 22, fontWeight: '800', color: colors.text },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footer: { marginTop: spacing.xl, fontSize: 12, color: colors.muted, textAlign: 'center' },
});
