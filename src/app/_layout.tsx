// Root layout. Lab 02: a Stack navigator wrapped in the Context provider,
// so every screen shares the same estate data. Light theme on purpose.
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { EstateProvider } from '@/features/estates/EstateContext';
import { colors } from '@/theme/tokens';

export default function RootLayout() {
  return (
    <EstateProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text, fontWeight: '700' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="estate/new" options={{ title: 'New estate', presentation: 'modal' }} />
        <Stack.Screen name="estate/[id]/index" options={{ title: 'Estate' }} />
        <Stack.Screen name="estate/[id]/shares" options={{ title: 'Proposed shares' }} />
        <Stack.Screen name="estate/[id]/report" options={{ title: 'Estate report' }} />
      </Stack>
    </EstateProvider>
  );
}
