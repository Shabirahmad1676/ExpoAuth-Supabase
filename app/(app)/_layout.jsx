import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../../Providers/AuthProvider';

export default function ProtectedLayout() {
  const {session,loading} = useAuth()

  if (loading) return null;
  if (!session) return <Redirect href="/sign-in" />;

  return <Stack />;
}
