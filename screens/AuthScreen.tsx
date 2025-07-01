import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../utils/supabase';
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); 
  const [message, setMessage] = useState('');
   const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');

    const handleAuth = async () => {
    setMessage('');
    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setMessage(error.message);
      setMessage(`Welcome back, ${data.user.user_metadata?.full_name || data.user.email}!`);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) return setMessage(error.message);
      setMessage('Signup successful! Please check your email to confirm.');
    }
    setEmail('')
    setPassword('')
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</Text>

          {!isLogin && (
        <TextInput
        style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        // placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        // placeholderTextColor="#888"
      />
      {/* {!isLogin ? (
         <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={username}
        onChangeText={setUsername}
        secureTextEntry
        placeholderTextColor="#888"
      />) : ""
      } */}

      <View style={styles.buttonWrapper}>
        <Button title={isLogin ? 'Log In' : 'Sign Up'} onPress={handleAuth} color="#007AFF" />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>
          {isLogin ? "New user? " : "Already have an account? "}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setIsLogin(!isLogin);
            setMessage('');
          }}
        >
          <Text style={styles.switchLink}>{isLogin ? 'Sign Up' : 'Log In'}</Text>
        </TouchableOpacity>
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}
       <GoogleLoginButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    alignSelf: 'center',
    color: '#222',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#222',
  },
  buttonWrapper: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchText: {
    fontSize: 16,
    color: '#444',
  },
  switchLink: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
    color: '#34C759',
    fontSize: 16,
  },
});