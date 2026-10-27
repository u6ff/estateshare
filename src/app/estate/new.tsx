// Screen 2 — Create estate (Member A). FR1.
// Lab 02: controlled TextInputs with useState, validation, useRef + focus() on the invalid field,
// router.replace to the new estate. Lab 03: AppInput / AppButton / Card primitives.
import { useRef, useState } from 'react';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View, type TextInputInstance } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { Card } from '@/components/ui/Card';
import { useEstates } from '@/features/estates/EstateContext';
import { colors, spacing } from '@/theme/tokens';

const DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export default function CreateEstateScreen() {
  const { addEstate } = useEstates();
  const [name, setName] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [nameError, setNameError] = useState('');
  const [dateError, setDateError] = useState('');
  const nameRef = useRef<TextInputInstance>(null);
  const dateRef = useRef<TextInputInstance>(null);

  function save() {
    setNameError('');
    setDateError('');

    if (!name.trim()) {
      setNameError("Please enter the deceased's full name.");
      nameRef.current?.focus();
      return;
    }
    if (!DATE_PATTERN.test(deathDate.trim())) {
      setDateError('Use the format YYYY-MM-DD, for example 2025-03-14.');
      dateRef.current?.focus();
      return;
    }
    if (deathDate.trim() > new Date().toISOString().slice(0, 10)) {
      setDateError('The date of death cannot be in the future.');
      dateRef.current?.focus();
      return;
    }

    const id = addEstate(name.trim(), deathDate.trim());
    setName('');
    setDeathDate('');
    // replace, so Back from the new estate returns to the list, not to this form.
    router.replace({ pathname: '/estate/[id]', params: { id } });
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.intro}>
          <Text style={styles.step}>STEP 1 OF 3</Text>
          <Text style={styles.title}>Create an estate</Text>
          <Text style={styles.subtitle}>
            Start with who passed away. You will add heirs, assets and documents next.
          </Text>
        </View>

        <Card style={styles.form}>
          <AppInput
            ref={nameRef}
            label="Deceased's full name"
            placeholder="e.g. Ahmad Rahman"
            value={name}
            onChangeText={setName}
            error={nameError}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => dateRef.current?.focus()}
          />
          <AppInput
            ref={dateRef}
            label="Date of death"
            placeholder="YYYY-MM-DD"
            value={deathDate}
            onChangeText={setDeathDate}
            error={dateError}
            hint="Used on the estate report."
            keyboardType="numbers-and-punctuation"
            returnKeyType="done"
            onSubmitEditing={save}
          />
        </Card>

        <View style={styles.next}>
          <Text style={styles.nextTitle}>What happens next</Text>
          <Text style={styles.nextItem}>1. Register the heirs and their relationship.</Text>
          <Text style={styles.nextItem}>2. Record assets, debts and documents.</Text>
          <Text style={styles.nextItem}>3. Review the proposed shares together.</Text>
        </View>

        <View style={styles.actions}>
          <AppButton label="Create estate" onPress={save} />
          <AppButton label="Cancel" variant="ghost" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.xl, width: '100%', maxWidth: 640, alignSelf: 'center' },
  intro: { gap: 6 },
  step: { fontSize: 12, fontWeight: '800', color: colors.primary, letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 15, color: colors.muted, lineHeight: 21 },
  form: { gap: spacing.lg },
  next: {
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    padding: spacing.lg,
    gap: 6,
  },
  nextTitle: { fontSize: 14, fontWeight: '700', color: colors.primaryDark },
  nextItem: { fontSize: 14, color: colors.primaryDark },
  actions: { gap: spacing.md },
});
