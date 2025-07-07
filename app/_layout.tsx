import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../Providers/AuthProvider';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { supabase } from '../utils/supabase';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = async ({ url }: { url: string }) => {
      const { queryParams } = Linking.parse(url);

      // these are present in Supabase password reset links
      if (queryParams?.type === 'recovery' && queryParams?.access_token) {
        const { error } = await supabase.auth.setSession({
          access_token: queryParams.access_token as string,
          refresh_token: queryParams.refresh_token as string, // might be undefined
        });

        if (!error) {
          router.replace('/ResetPassword'); 
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => subscription.remove();
  }, []);

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" options={{ title: 'Forgot Password' }} />
        <Stack.Screen name="ResetPassword" options={{ title: 'Reset Password' }} />
      </Stack>
    </AuthProvider>
  );
}
