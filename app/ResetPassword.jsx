import { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../utils/supabase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));//wait for deep link in _layout file
      const { data, error: getSessionError } = await supabase.auth.getSession(); // check for session
      if (!data.session) {
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          setError("Invalid or expired reset link. Please try again from the Forgot Password screen.");
        } else { //if session === setConfirmed to true
          setConfirmed(true);
        }
      } else {
        setConfirmed(true);
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    setLoading(false);

    if (updateError) {
      Alert.alert('Error updating password', updateError.message);
    } else {
      Alert.alert('Success', 'Password updated successfully. You can now sign in with your new password.');
      router.replace('/sign-in');
    }
  };

  if (!confirmed) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.infoText}>Verifying reset link...</Text>
            </>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Your Password</Text>
        <Text style={styles.label}>Enter your new password:</Text>
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="New password"
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading || !password}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
    textAlign: 'left',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 18,
    backgroundColor: '#f9fafb',
    color: '#222',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    backgroundColor: '#a0aec0',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#e53e3e',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  infoText: {
    color: '#555',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
});