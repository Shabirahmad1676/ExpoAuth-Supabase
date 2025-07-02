import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../Providers/AuthProvider';

export default function AppLayout() {
  const { session } = useAuth();

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return <Stack />;
}
