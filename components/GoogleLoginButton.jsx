import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { supabase } from '../utils/supabase';

const GoogleLoginButton = () => {
  const redirectTo = AuthSession.makeRedirectUri({ useProxy: true });

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });

    if (error) {
      Alert.alert('OAuth Error', error.message);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleGoogleLogin} activeOpacity={0.8}>
      <View style={styles.inner}>
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
          }}
          style={styles.icon}
        />
        <Text style={styles.text}>Sign in with Google</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  text: {
    color: '#444',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default GoogleLoginButton;