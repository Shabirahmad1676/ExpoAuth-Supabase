import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { supabase } from '../../utils/supabase';

export default function realtime() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Initial load
    fetchMessages();

    // Realtime subscription
//     supabase.channel(...).on(...).subscribe() sets up a realtime listener for any change (event: '*') on the todos table.

// Whenever there's an insert/update/delete, it logs the payload and adds the new row to the top of the list.


  const subscription = supabase
    .channel('public:messages')
    .on(
      'postgres_changes',
      { event: '*',
        schema: 'public',
         table: 'todos' 
        },
      (payload) => {
        console.log('Change received!', payload);   
        setMessages((current) => {
          const exists = current.some((msg) => msg.id === payload.new.id);
          if (!exists) {
            return [payload.new, ...current];
          }
          return current;
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}, []);


  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
    //   .order('created_at', { ascending: false });
    if (!error) setMessages(data);
  };

  return (
    <FlatList
      data={messages}
     keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      renderItem={({ item }) => (
        <Text style={{ padding: 10 }}>{item.title}</Text>
      )}
    />
  );
}


// import { useEffect, useState } from 'react'
// import { View, Text, TextInput, Button, FlatList, Picker } from 'react-native'
// import { supabase } from '../../utils/supabase'

// const ROOM_OPTIONS = [
//   { id: 'general', name: 'General' },
//   { id: 'random', name: 'Random' },
//   { id: 'tech', name: 'Tech' },
// ]

// export default function RealtimeChat() {
//   const [messages, setMessages] = useState([])
//   const [messageText, setMessageText] = useState('')
//   const [room, setRoom] = useState('general')
//   const [subscription, setSubscription] = useState(null)

//   useEffect(() => {
//     fetchMessages(room)

//     const channel = supabase
//       .channel(`realtime:chatmsg:${room}`)
//       .on(
//         'postgres_changes',
//         {
//           event: 'INSERT',
//           schema: 'public',
//           table: 'chatmsg',
//           filter: `room_id=eq.${room}`,
//         },
//         (payload) => {
//           setMessages((prev) => [payload.new, ...prev])
//         }
//       )
//       .subscribe()

//     setSubscription(channel)

//     return () => {
//       supabase.removeChannel(channel)
//     }
//   }, [room])

//   const fetchMessages = async (roomId) => {
//     const { data, error } = await supabase
//       .from('chatmsg')
//       .select('*')
//       .eq('room_id', roomId)
//     //   .order('created_at', { ascending: false })

//     if (!error) setMessages(data)
//   }

//   const handleSend = async () => {
//   if (!messageText.trim()) return;

//   const { error, data } = await supabase.from('chatmsg').insert({
//     user_name: 'Shabir',
//     body: messageText,
//     room_id: 'general', // ✅ make sure this exists and is valid
//   });

//   if (error) {
//     console.error('Insert error:', error);
//     return;
//   }

//   setMessageText('');
// };

//   return (
//     <View style={{ flex: 1, padding: 16 }}>
//       <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Current Room: {room}</Text>

//       {/* Room Selector */}
//       <Picker
//         selectedValue={room}
//         style={{ height: 50 }}
//         onValueChange={(value) => setRoom(value)}
//       >
//         {ROOM_OPTIONS.map((r) => (
//           <Picker.Item key={r.id} label={r.name} value={r.id} />
//         ))}
//       </Picker>

//       <FlatList
//         data={messages}
//         inverted
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <Text style={{ padding: 6 }}>
//             <Text style={{ fontWeight: 'bold' }}>{item.user_name}: </Text>
//             {item.body}
//           </Text>
//         )}
//       />

//       <TextInput
//         value={messageText}
//         onChangeText={setMessageText}
//         placeholder="Type a message..."
//         style={{ borderWidth: 1, padding: 10, marginBottom: 8 }}
//       />
//       <Button title="Send" onPress={handleSend} />
//     </View>
//   )
// }
