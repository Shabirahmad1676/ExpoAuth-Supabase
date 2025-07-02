import { Stack } from 'expo-router';
import { AuthProvider } from '../Providers/AuthProvider';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
