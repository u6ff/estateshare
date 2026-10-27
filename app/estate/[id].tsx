// Lab concept: typed params — useLocalSearchParams<{ id: string }>() reads the route id; UI from primitives. Screen 3: Estate details.
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { AppButton } from '@/src/components/ui/AppButton';
import { AppInput } from '@/src/components/ui/AppInput';
import { Badge, BadgeTone } from '@/src/components/ui/Badge';
import { Card } from '@/src/components/ui/Card';
import { useEstates } from '@/src/features/estates/EstateContext';

type DocStatus = 'missing' | 'submitted' | 'verified';

const PLACEHOLDER_DOCUMENTS: { name: string; status: DocStatus }[] = [
  { name: 'Death certificate', status: 'verified' },
  { name: 'Will', status: 'submitted' },
  { name: 'Property deed', status: 'missing' },
];

const STATUS_TONE: Record<DocStatus, BadgeTone> = {
  missing: 'danger',
  submitted: 'warning',
  verified: 'success',
};

function SectionTitle({ children }: { children: string }) {
  return <Text className="mb-sm mt-xl text-lg font-bold text-text">{children}</Text>;
}

export default function EstateDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { estates, heirs, addHeir } = useEstates();
  const [heirName, setHeirName] = useState('');
  const [relationship, setRelationship] = useState('');

  const estate = estates.find((e) => e.id === id);
  if (!estate) {
    return (
      <View className="flex-1 bg-background p-lg">
        <Text className="text-2xl font-bold text-text">Estate not found</Text>
      </View>
    );
  }

  const estateHeirs = heirs.filter((h) => h.estateId === estate.id);

  function handleAddHeir() {
    if (heirName.trim() === '' || !estate) return;
    addHeir(estate.id, heirName.trim(), relationship.trim());
    setHeirName('');
    setRelationship('');
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-lg pb-xl">
      <Stack.Screen options={{ title: estate.deceasedName }} />

      <Text className="text-3xl font-bold text-text">{estate.deceasedName}</Text>
      <Text className="mt-xs text-muted">Died {estate.deathDate || 'unknown'}</Text>

      <SectionTitle>Heirs</SectionTitle>
      <Card className="gap-sm">
        {estateHeirs.length === 0 ? (
          <Text className="text-muted">No heirs added yet.</Text>
        ) : (
          estateHeirs.map((h) => (
            <View key={h.id} className="flex-row justify-between border-b border-border pb-sm">
              <Text className="font-semibold text-text">{h.name}</Text>
              <Text className="text-muted">{h.relationship || 'relationship not set'}</Text>
            </View>
          ))
        )}
      </Card>

      <SectionTitle>Add heir</SectionTitle>
      <Card>
        <AppInput label="Name" value={heirName} onChangeText={setHeirName} placeholder="Heir name" />
        <AppInput
          label="Relationship"
          value={relationship}
          onChangeText={setRelationship}
          placeholder="e.g. son, wife"
        />
        <AppButton title="Add heir" onPress={handleAddHeir} />
      </Card>

      <SectionTitle>Document vault</SectionTitle>
      <Card className="gap-md">
        {PLACEHOLDER_DOCUMENTS.map((doc) => (
          <View key={doc.name} className="flex-row items-center justify-between">
            <Text className="text-text">{doc.name}</Text>
            <Badge label={doc.status} tone={STATUS_TONE[doc.status]} />
          </View>
        ))}
      </Card>

      <SectionTitle>Net estate summary</SectionTitle>
      <Card>
        <Text className="text-muted">Assets and debts will appear here (Member B)</Text>
      </Card>

      <View className="mt-xl gap-md">
        <AppButton title="Share calculator" onPress={() => router.push(`/estate/${estate.id}/shares`)} />
        <AppButton
          title="Estate report"
          variant="secondary"
          onPress={() => router.push(`/estate/${estate.id}/report`)}
        />
      </View>
    </ScrollView>
  );
}
