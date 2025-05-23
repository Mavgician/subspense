import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
import { supabase } from '../scripts/supabase';

export default function EditExpenseScreen() {
  const { editingExpense } = useContext(ExpenseContext);
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setCategory(editingExpense.category);
      setAmount(editingExpense.amount.toString());
    }

  }, [editingExpense]);

  const handleSave = async () => {
    if (!title || !amount) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const { data, error } = await supabase.rpc('update_user_expense', { p_expense_id: editingExpense.id, p_new_amount: amount, p_new_category: category, p_new_title: title })
    
    if (data) {
      navigation.goBack();
    }

    if (error) {
      Alert.alert('Error', error.message)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Expense</Text>

      {/* Title Label and Input */}
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
      />

      {/* Category Label and Input */}
      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter category"
        value={category}
        onChangeText={setCategory}
      />

      {/* Amount Label and Input */}
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#60bee0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
