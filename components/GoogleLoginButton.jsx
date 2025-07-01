import React from 'react';
import { Button, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { supabase } from '../utils/supabase';

const GoogleLoginButton = () => {
  const handleGoogleLogin = async () => {
    const redirectTo = AuthSession.makeRedirectUri({ useProxy: true });

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });

    if (error) {
      Alert.alert('OAuth Error', error.message);
    }
    // Navigation should be handled by your main app logic after session changes
  };

  return <Button title="Sign in with Google" onPress={handleGoogleLogin} />;
};

export default GoogleLoginButton;