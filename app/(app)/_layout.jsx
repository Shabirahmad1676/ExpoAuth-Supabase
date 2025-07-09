import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '../../Providers/AuthProvider';
import { Text, TouchableOpacity } from 'react-native';
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons'


export default function ProtectedLayout() {
  const { session, loading,signOut } = useAuth();

  if (loading) return null;
  if (!session) return <Redirect href="/sign-in" />;

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Todo',
          tabBarIcon: ({ color, size }) => (
           
            <Text style={{ color, fontSize: size }}>📝</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="realtime"
        options={{
          title: 'Realtime',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>⚡</Text>
          ),
        }} 
      />

       <Tabs.Screen
        name="list"
        options={{
          headerTitle: 'My Files',
          tabBarIcon: ({ color, size }) => (
             <Entypo  name="images" size={30} color={'black'} />
            
          ),
          headerRight: () => (
            <TouchableOpacity onPress={signOut}>
              <MaterialIcons  name="logout" size={30} color={'black'} />
            </TouchableOpacity>
          ),
        }}
      ></Tabs.Screen>

    </Tabs>
  );
}