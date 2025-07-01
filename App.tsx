import { useEffect, useState } from 'react';
import { supabase } from './utils/supabase';
import AuthScreen from './screens/AuthScreen';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {
  const [session, setSession] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();//whoo is logged in 
      setSession(session);
      if (session?.user) {
        const user = session.user;
        const name = user.user_metadata?.full_name || user.email;
        setUserName(name);
      }
       console.log('Session after loadSession:', session);
    };

    loadSession();

   
AsyncStorage.getItem('supabase.auth.token').then(token => {
  console.log('Token in AsyncStorage:', token);
});


    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        const name = session.user.user_metadata?.full_name || session.user.email;
        setUserName(name);
      }
       console.log('Session after onAuthStateChange:', session); 
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };


  if (!session) return <AuthScreen />;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Button title="Sign Out" onPress={signOut} color="#d00" />
      </View>
      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome, {userName} 👋</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 12,
    alignItems: 'flex-end',
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
});