import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Redirect, useRouter } from "expo-router";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useAuth } from "../Providers/AuthProvider";

export default function AuthScreen() {
  const {
    session,
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    isLogin,
    setIsLogin,
    message,
    setMessage,
    handleAuth,
  } = useAuth();

  const router= useRouter()

  // ✅ Redirect to home if logged in
  if (session) {
    console.log("session in SignIn Page",session)

    return <Redirect href="/" />;
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Sign Up"}</Text>

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
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttonWrapper}>
        <Button
          title={isLogin ? "Log In" : "Sign Up"}
          onPress={handleAuth}
          color="#007AFF"
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>
          {isLogin ? "New user? " : "Already have an account? "}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
        >
          <Text style={styles.switchLink}>
            {isLogin ? "Sign Up" : "Log In"}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => router.push('/ForgotPassword')}>
  <Text style={{color:'blue'}}>{isLogin ? 'Forgot Password?':''}</Text>
</TouchableOpacity>


      {message ? <Text style={styles.message}>{message}</Text> : null} 

      <GoogleLoginButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    alignSelf: "center",
    color: "#222",
  },
  input: {
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#222",
  },
  buttonWrapper: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  switchText: {
    fontSize: 16,
    color: "#444",
  },
  switchLink: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold",
    marginLeft: 4,
  },
  message: {
    marginTop: 20,
    textAlign: "center",
    color: "#34C759",
    fontSize: 16,
  },
});
