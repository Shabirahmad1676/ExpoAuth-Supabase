// Providers/AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const initSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) console.log('Initial session error:', error);
      if (session) {
        setSession(session);
        setUserName(session.user?.user_metadata?.full_name || session.user?.email);
      }
    };

  

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUserName(session?.user?.user_metadata?.full_name || session?.user?.email);
    });

    initSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


  //sign In and sign up functionality is here
  const handleAuth = async () => {
    setMessage('');

    try {
      if (isLogin) {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return setMessage(error.message);
        setMessage(`Welcome back, ${data.user.user_metadata?.full_name || data.user.email}!`);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) return setMessage(error.message);
        setMessage('Signup successful! Please check your email to confirm.');
      }

      setEmail('');
      setPassword('');
    } catch (e) {
      setMessage(e.message);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ 
        session,
        userName,
        signOut,
        email, setEmail,
        password, setPassword,
        fullName, setFullName,
        isLogin, setIsLogin,
        message, setMessage,
        handleAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
