import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../../Providers/AuthProvider";
import { supabase } from "../../utils/supabase";

export default function HomeScreen() {
  const { signOut, userName, session } = useAuth();
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // For editing
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const userId = session?.user?.id;

  const fetchTodos = async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId)
      .order("inserted_at", { ascending: false });
    if (!error) setTodos(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, [userId]);

  const addTodo = async () => {
    if (!input.trim()) return;
    const { error } = await supabase.from("todos").insert([
      {
        title: input,
        user_id: userId,
      },
    ]);
    if (error) console.error(error);
    else {
      setInput("");
      fetchTodos();
    }
  };

  const removeTodo = async (id) => {
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (!error) setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Update todo
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditValue(todo.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEdit = async (id) => {
    if (!editValue.trim()) return;
    const { error } = await supabase
      .from("todos")
      .update({ title: editValue })
      .eq("id", id)
      .eq("user_id", userId);
    if (!error) {
      setEditingId(null);
      setEditValue("");
      fetchTodos();
    }
  };

  if (!session) return <Redirect href="/sign-in" />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {userName}!</Text>
      <Text style={styles.title}>My Todo List</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a new todo"
          value={input}
          onChangeText={setInput}
        />
        <Button title="Add" onPress={addTodo} disabled={!input.trim()} />
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={fetchTodos}
        renderItem={({ item }) => (
          <View style={styles.todoRow}>
            {editingId === item.id ? (
              <>
                <TextInput
                  style={[styles.input, { marginRight: 0, flex: 1 }]}
                  value={editValue}
                  onChangeText={setEditValue}
                  autoFocus
                />
                <TouchableOpacity onPress={() => saveEdit(item.id)}>
                  <Text style={styles.save}>💾</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={cancelEdit}>
                  <Text style={styles.cancel}>✖️</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.todoText}>{item.title}</Text>
                <TouchableOpacity onPress={() => startEdit(item)}>
                  <Text style={styles.edit}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeTodo(item.id)}>
                  <Text style={styles.remove}>❌</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {loading ? "Loading..." : "No todos yet."}
          </Text>
        }
      />

      <Button title="Sign Out" onPress={signOut} color="#e53e3e" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    padding: 24,
    paddingTop: 48,
  },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 8, color: "#222" },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#007AFF",
  },
  inputRow: { flexDirection: "row", marginBottom: 16, alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  todoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  todoText: { flex: 1, fontSize: 16, color: "#222" },
  edit: { fontSize: 18, color: "#007AFF", marginLeft: 8 },
  save: { fontSize: 18, color: "#38a169", marginLeft: 8 },
  cancel: { fontSize: 18, color: "#e53e3e", marginLeft: 8 },
  remove: { fontSize: 18, color: "#e53e3e", marginLeft: 8 },
  empty: { textAlign: "center", color: "#aaa", marginTop: 32 },
});