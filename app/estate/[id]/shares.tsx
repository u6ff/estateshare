// Lab concept: typed params + reusing a pure function (calculateShares); UI from primitives. Screen 7: Share calculator.
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { Card } from '@/src/components/ui/Card';
import { useEstates } from '@/src/features/estates/EstateContext';
import { ASSUMPTIONS, calculateShares } from '@/src/features/shares/calculateShares';

// Placeholder until Member B's assets/debts screens provide the real net estate.
const PLACEHOLDER_NET_ESTATE = 0;

export default function SharesScreen() {
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

  const shares = calculateShares(
    heirs.filter((h) => h.estateId === estate.id),
    PLACEHOLDER_NET_ESTATE,
  );

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-lg pb-xl gap-md">
      <Stack.Screen options={{ title: 'Share calculator' }} />

      <View>
        <Text className="text-2xl font-bold text-text">Shares for {estate.deceasedName}</Text>
        <Text className="mt-xs text-muted">Net estate: {PLACEHOLDER_NET_ESTATE} (placeholder)</Text>
      </View>

      {shares.length === 0 ? (
        <Card>
          <Text className="text-muted">Add heirs on the estate screen to see their shares.</Text>
        </Card>
      ) : (
        shares.map((s) => (
          <Card key={s.heirId} className="flex-row items-center justify-between">
            <View>
              <Text className="text-base font-semibold text-text">{s.name}</Text>
              <Text className="mt-xs text-muted">
                {s.fraction} · {s.percentage.toFixed(1)}%
              </Text>
            </View>
            <Text className="text-lg font-bold text-primary">{s.amount.toFixed(2)}</Text>
          </Card>
        ))
      )}

      <Card className="mt-md bg-gray-50">
        <Text className="mb-xs font-semibold text-text">Assumptions</Text>
        <Text className="text-sm leading-5 text-muted">{ASSUMPTIONS}</Text>
      </Card>
    </ScrollView>
  );
}
