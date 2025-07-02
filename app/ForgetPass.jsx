import { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { supabase } from '../utils/supabase'; 
import * as Linking from "expo-linking";

export default function ForgetPass() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    const resetPasswordURL = Linking.createURL("/reset-password");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetPasswordURL, 
    });
    if (error) setMessage(error.message);
    else setMessage('Check your email for reset link.');
  };


  return (
    <View>
      <Text>Enter your email:</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <Button title="Send Reset Link" onPress={handleReset} />
      {message && <Text>{message}</Text>}
    </View>
  );
}
