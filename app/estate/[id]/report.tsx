// Lab concept: typed params + Context + pure function combined into summary cards. Screen 9: Estate report.
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { Card } from '@/src/components/ui/Card';
import { useEstates } from '@/src/features/estates/EstateContext';
import { calculateShares } from '@/src/features/shares/calculateShares';

// Placeholder totals until Member B's assets/debts screens exist.
const PLACEHOLDER_TOTALS = { assets: 0, debts: 0, netEstate: 0 };

function StatCard({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <Card className="min-w-[45%] flex-1">
      <Text className="text-sm text-muted">{label}</Text>
      <Text className="mt-xs text-2xl font-bold text-text">{value}</Text>
      {note && <Text className="mt-xs text-xs text-muted">{note}</Text>}
    </Card>
  );
}

export default function ReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { estates, heirs } = useEstates();

  const estate = estates.find((e) => e.id === id);
  if (!estate) {
    return (
      <View className="flex-1 bg-background p-lg">
        <Text className="text-2xl font-bold text-text">Estate not found</Text>
      </View>
    );
  }

  const estateHeirs = heirs.filter((h) => h.estateId === estate.id);
  const shares = calculateShares(estateHeirs, PLACEHOLDER_TOTALS.netEstate);

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-lg pb-xl">
      <Stack.Screen options={{ title: 'Estate report' }} />

      <Text className="text-3xl font-bold text-text">{estate.deceasedName}</Text>
      <Text className="mt-xs text-muted">Died {estate.deathDate || 'unknown'}</Text>

      <View className="mt-xl flex-row flex-wrap gap-md">
        <StatCard label="Total assets" value={PLACEHOLDER_TOTALS.assets} note="Placeholder" />
        <StatCard label="Total debts" value={PLACEHOLDER_TOTALS.debts} note="Placeholder" />
        <StatCard label="Net estate" value={PLACEHOLDER_TOTALS.netEstate} note="Placeholder" />
        <StatCard label="Heirs" value={estateHeirs.length} />
        <StatCard label="Open tasks" value={0} note="Member B" />
      </View>

      <Text className="mb-sm mt-xl text-lg font-bold text-text">Heir shares</Text>
      <Card className="gap-sm">
        {shares.length === 0 ? (
          <Text className="text-muted">No heirs yet.</Text>
        ) : (
          shares.map((s) => (
            <View key={s.heirId} className="flex-row justify-between">
              <Text className="text-text">{s.name}</Text>
              <Text className="text-muted">
                {s.fraction} ({s.percentage.toFixed(1)}%) = {s.amount.toFixed(2)}
              </Text>
            </View>
          ))
        )}
      </Card>
    </ScrollView>
  );
}
