import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView
} from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // For check icon

export default function NewExpenseScreen() {
  const { addExpense } = useContext(ExpenseContext);
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddExpense = () => {
    if (!title || !amount) {
      console.log('Please fill in all fields!');
      return;
    }

    const newExpense = {
      id: Date.now().toString(),
      title,
      category,
      amount: parseFloat(amount),
      date: new Date()
    };

    addExpense(newExpense);
    navigation.navigate('HomeTabs');
  };

  const handleNumberPress = (num) => {
    setAmount((prev) => prev + num);
  };

  const handleClear = () => {
    setAmount('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>New Expense</Text>
        <TouchableOpacity onPress={handleAddExpense}>
          <Ionicons name="checkmark" size={28} color="#60bee0" />
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <Text style={styles.label}>Expense title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Expense Category</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      {/* Amount Display */}
      <View style={styles.amountBox}>
        <Text style={styles.amountText}>PhP {amount || '0.00'}</Text>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {['7','8','9','4','5','6','1','2','3','.','0','←'].map((key) => (
          <TouchableOpacity
            key={key}
            style={styles.key}
            onPress={() => key === '←' ? handleClear() : handleNumberPress(key)}
          >
            <Text style={styles.keyText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f6f7fb',
    flexGrow: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333'
    
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    marginTop: 12
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8
  },
  amountBox: {
    backgroundColor: '#ff5c5c',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 24
  },
  amountText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold'
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },
  key: {
    width: '30%',
    height: 60,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  keyText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333'
  }
});

