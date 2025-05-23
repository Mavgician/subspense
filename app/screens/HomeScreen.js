import { Ionicons } from '@expo/vector-icons'; // To use modern icons
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../scripts/supabase';

export default function HomeScreen() {
  /* const { expenses: expense, balance } = useContext(ExpenseContext); */

  const [balance, setBalance] = useState(0);
  const [expenses, setExpenses] = useState([]);

  const navigation = useNavigation();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  const runningExpense = expenses.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);

  useEffect(() => {
    const setup = async () => {
      const { data: user, error: userError } = await supabase.rpc('get_current_user_profile').single()
      const { data: expenses, error: expenseError } = await supabase.rpc('get_user_expenses')

      if (user && expenses) {
        setBalance(user.current_balance - runningExpense)
        setExpenses(expenses ?? [])
      }
    }

    setup()
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>

      {/* Current Available Balance */}
      <View style={styles.balanceContainer}>
        <View style={styles.balanceRow}>
          <Text style={[styles.bigText, styles.availableBalance]}>Php {balance.toFixed(2)}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditBalanceScreen')}>
            <Ionicons name="pencil" size={20} color="#c4c3c4" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Current Available Balance</Text>
      </View>

      {/* Current Running Expense */}
      <View style={styles.balanceContainer}>
        <Text style={[styles.bigText, styles.runningExpense]}>Php {runningExpense.toFixed(2)}</Text>
        <Text style={styles.subtitle}>Current running expense for {currentMonth}</Text>
      </View>

      {/* + New Expense Button */}
      <TouchableOpacity style={styles.newExpenseButton} onPress={() => navigation.navigate('NewExpense')}>
        <Text style={styles.newExpenseText}>+ New Expense</Text>
      </TouchableOpacity>

      {/* Transactions */}
      <View style={styles.transactionHeader}>
        <Text style={styles.title}>Transactions</Text>
        <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={expenses.slice(0, 4)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text style={styles.expenseTitle}>{item.title}</Text>
            <Text style={styles.expenseAmount}>Php {parseFloat(item.amount).toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    paddingBottom: 80,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 20,
    color: '#333',
  },
  balanceContainer: {
    marginBottom: 25,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bigText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#333',
  },
  availableBalance: {
    color: '#ed4f4f',
  },
  runningExpense: {
    color: '#78c8e4',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  editButton: {
    padding: 5,
  },
  newExpenseButton: {
    backgroundColor: '#60bee0',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 20,
    elevation: 3,
  },
  newExpenseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  seeAll: {
    color: '#61bdde',
    fontSize: 16,
    fontWeight: '500',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
  },
});
