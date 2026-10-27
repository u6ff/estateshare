// Lab concept: useRef — focus the name input when validation fails; UI built from primitives. Screen 2: Create estate.
import { router, Stack } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, Text, TextInputInstance } from 'react-native';

import { AppButton } from '@/src/components/ui/AppButton';
import { AppInput } from '@/src/components/ui/AppInput';
import { Card } from '@/src/components/ui/Card';
import { useEstates } from '@/src/features/estates/EstateContext';

export default function NewEstateScreen() {
  const { addEstate } = useEstates();
  const nameRef = useRef<TextInputInstance>(null);
  const [name, setName] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [error, setError] = useState('');

  function handleSave() {
    if (name.trim() === '') {
      setError("Deceased's name is required.");
      nameRef.current?.focus();
      return;
    }
    addEstate(name.trim(), deathDate.trim());
    setName('');
    setDeathDate('');
    setError('');
    router.back();
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-lg">
      <Stack.Screen options={{ title: 'New estate' }} />

      <Text className="mb-lg text-muted">Start a new estate with the deceased's details.</Text>

      <Card>
        <AppInput
          ref={nameRef}
          label="Deceased's name *"
          value={name}
          onChangeText={setName}
          placeholder="Full name"
          error={error}
        />
        <AppInput
          label="Date of death"
          value={deathDate}
          onChangeText={setDeathDate}
          placeholder="YYYY-MM-DD"
        />
        <AppButton title="Save" onPress={handleSave} />
      </Card>
    </ScrollView>
  );
}
