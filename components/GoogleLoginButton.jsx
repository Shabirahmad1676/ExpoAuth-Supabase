import React, { useEffect } from 'react';
import { Button, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { supabase } from '../utils/supabase';

const GoogleLoginButton = () => {
  const redirectTo = AuthSession.makeRedirectUri({ useProxy: true });

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });

    if (error) {
      Alert.alert('OAuth Error', error.message);
    }
  };
  console.log("URL IS THIS to redirect to",AuthSession.makeRedirectUri({ useProxy: true }));//exp://192.168.1.6:8081


  return <Button  title="Sign in with Google" onPress={handleGoogleLogin} />;
};

export default GoogleLoginButton;
