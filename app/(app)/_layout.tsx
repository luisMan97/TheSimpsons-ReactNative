import { Redirect, Stack } from 'expo-router';

import { useSession } from '@/core/session/SessionProvider';

export default function AppLayout() {
  const { userId } = useSession();
  if (!userId) {
    return <Redirect href="/login" />;
  }
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: { fontWeight: '600' },
        headerBackTitleVisible: false,
        headerBackTitle: '',
      }}>
      <Stack.Screen name="(drawer)" options={{ headerShown: false, title: '' }} />
      <Stack.Screen
        name="characters/[id]"
        options={{ title: 'Detalle', headerBackTitleVisible: false, headerBackTitle: '' }}
      />
      <Stack.Screen
        name="notes/edit"
        options={{ title: 'Nota', headerBackTitleVisible: false, headerBackTitle: '' }}
      />
      <Stack.Screen
        name="episodes/[id]"
        options={{ title: 'Episode', headerBackTitleVisible: false, headerBackTitle: '' }}
      />
    </Stack>
  );
}
