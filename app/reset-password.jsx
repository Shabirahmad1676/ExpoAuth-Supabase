// import { useEffect, useState } from 'react';
// import { supabase } from '../utils/supabase';

// export default function ResetPassword() {
//   const [password, setPassword] = useState('');
//   const [status, setStatus] = useState('');

//   useEffect(() => {
//     const handleSession = async () => {
//       const { error } = await supabase.auth.exchangeCodeForSession(); // correct method
//       if (error) console.error('Session error:', error.message);
//     };
//     handleSession();
//   }, []);

//   const updatePassword = async () => {
//     const { error } = await supabase.auth.updateUser({ password });
//     if (error) setStatus(error.message);
//     else {
//       setStatus('Password updated. Redirecting...');
//       setTimeout(() => (window.location.href = '/sign-in'), 2000);
//     }
//   };

//   return (
//     <div>
//       <h2>Reset Your Password</h2>
//       <input
//         type="password"
//         placeholder="New Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={updatePassword}>Update Password</button>
//       <p>{status}</p>
//     </div>
//   );
// }


import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../utils/supabase";
import { useEffect, useState } from "react";
import { View, TextInput, Button, Text, ActivityIndicator } from "react-native";

export default function ResetPasswordScreen() {
  const { access_token, refresh_token } = useLocalSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");
  const [sessionSet, setSessionSet] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function handleSession() {
      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (error) {
          console.error("Error setting session:", error);
          setStatus("Invalid or expired reset link.");
        } else {
          setSessionSet(true);
        }
      }
    }
    handleSession();
  }, [access_token, refresh_token]);

  async function handleUpdatePassword() {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      console.error("Error updating password:", error);
      setStatus(error.message);
    } else {
      setStatus("Password updated successfully!");
      setTimeout(() => router.replace("/sign-in"), 2000); // redirect to login
    }
  }

  if (!sessionSet) {
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size="large" />
        <Text>Verifying reset link...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={{ marginVertical: 10, borderWidth: 1, padding: 10 }}
      />
      <Button title="Update Password" onPress={handleUpdatePassword} />
      {status ? <Text style={{ marginTop: 10 }}>{status}</Text> : null}
    </View>
  );
}
