// EditBalanceScreen.js
import { Ionicons } from '@expo/vector-icons'; // For check icon
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../scripts/supabase';

export default function EditBalanceScreen() {
  // Assume context provides current balance and a function to set it
  const navigation = useNavigation();

  const [newBalanceString, setNewBalanceString] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const setup = async () => {
      const { data: user, error } = await supabase.rpc('get_current_user_profile').single()

      if (error) {
        console.error(error);
      }

      if (user) {
        setBalance(user.current_balance)
      }
    }

    setup()
  }, []);

  const handleSaveBalance = async () => {
    if (!newBalanceString.trim()) {
      Alert.alert('Invalid Input', 'Please enter a valid balance amount.');
      return;
    }

    const newBalanceValue = parseFloat(newBalanceString);
    if (isNaN(newBalanceValue)) {
      Alert.alert('Invalid Amount', 'Please enter a valid number for the balance.');
      return;
    }

    const { data: finalBalance, error } = await supabase.rpc('update_user_balance', { p_amount_to_adjust: newBalanceValue }).single()

    if (error) {
      Alert.alert('Error', error.message)
    }

    if (finalBalance) {
      Alert.alert('Balance Updated', `Your new balance is Php ${finalBalance.toFixed(2)}`);
      navigation.goBack(); // Or navigate to a specific screen e.g., navigation.navigate('HomeTabs');
    }
  };

  const handleNumberPress = (num) => {
    // Allow only one decimal point
    if (num === '.' && newBalanceString.includes('.')) {
      return;
    }
    setNewBalanceString((prev) => prev + num);
  };

  const handleClear = () => {
    setNewBalanceString((prev) => prev.slice(0, -1)); // Changed to backspace behavior
  };

  const handleLongClear = () => { // Optional: Long press to clear all
    setNewBalanceString('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Edit Balance</Text>
        <TouchableOpacity onPress={handleSaveBalance}>
          <Ionicons name="checkmark" size={32} color="#60bee0" />
        </TouchableOpacity>
      </View>

      {/* Info Text about current balance (optional) */}
      <Text style={styles.currentBalanceInfo}>
        Current Balance: Php {balance !== undefined ? balance.toFixed(2) : 'N/A'}
      </Text>

      {/* Amount Display */}
      <View style={styles.amountBox}>
        <Text style={styles.amountText}>PhP {newBalanceString || '0.00'}</Text>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((key) => (
          <TouchableOpacity
            key={key}
            style={styles.key}
            onPress={() => handleNumberPress(key)}
          >
            <Text style={styles.keyText}>{key}</Text>
          </TouchableOpacity>
        ))}
        {/* Backspace Key */}
        <TouchableOpacity
          style={styles.key}
          onPress={handleClear}
          onLongPress={handleLongClear} // Optional: long press to clear all
        >
          <Ionicons name="backspace-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Styles adapted from your NewExpenseScreen for consistent aesthetic
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f6f7fb', // Consistent background
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 40 : 20, // Adjust top margin for status bar
    marginBottom: 20,
  },
  title: {
    fontSize: 24, // Slightly larger title
    fontWeight: '700',
    color: '#333',
  },
  currentBalanceInfo: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  amountBox: {
    backgroundColor: '#ff5c5c', // Kept red color for amount box, change if needed for balance
    // You might want a different color for balance, e.g., a blue or green
    // backgroundColor: '#60bee0', // Example: Blue like your buttons
    paddingVertical: 20, // Increased padding
    paddingHorizontal: 32,
    borderRadius: 15, // More rounded
    alignItems: 'center',
    marginVertical: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  amountText: {
    color: '#fff',
    fontSize: 32, // Larger amount text
    fontWeight: 'bold',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around', // Use space-around for better distribution
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15, // Adjusted padding
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginTop: 10, // Added margin
  },
  key: {
    width: '30%', // Ensures 3 keys per row roughly
    height: 70,  // Increased height for better touch
    marginBottom: 12, // Adjusted margin
    borderRadius: 15, // More rounded keys
    backgroundColor: '#f0f0f0', // Lighter key background for contrast
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  keyText: {
    fontSize: 24, // Larger key text
    fontWeight: '600',
    color: '#333',
  },
});