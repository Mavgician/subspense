import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CommonActions } from '@react-navigation/native';
import { supabase } from '../scripts/supabase';

function formatDate(date) {
  if (date) {
    const dateObject = new Date(date);
    const correctDateString = dateObject.toLocaleDateString(undefined, { // undefined uses system locale
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return correctDateString
  } else {
    return null
  }
}

export default function ProfileScreen({ navigation, route }) {
  const [name, setName] = useState('User');
  const [email, setEmail] = useState('nifty_email@gmail.com');
  const [balance, setBalance] = useState(0);
  const [createdAt, setCreatedAt] = useState('');
  const [latestExpenseDate, setLatestExpenseDate] = useState('');

  const handleSignOut = async () => {
    await supabase.auth.signOut()

    navigation.dispatch(
      CommonActions.reset({
        index: 0, // The index of the route to display initially (usually the first one)
        routes: [
          { name: 'Signin' }, // Or the specific initial screen name in your AppStack like 'Home'
          // You can add more routes here if needed for the new stack
        ],
      })
    );
  }

  useEffect(() => {
    const setup = async () => {
      const { data: user, error } = await supabase.rpc('get_current_user_profile').single()
      const { data: latestExpenseDate, error: latestExpenseError } = await supabase.rpc('get_latest_expense_date').single()
      const { data: expenses, error: expensesError } = await supabase.rpc('get_user_expenses')

      const isExpense = !latestExpenseDate && latestExpenseDate === null || latestExpenseDate

      if (error || latestExpenseError || expensesError) {
        console.error(error.message ?? latestExpenseError.message ?? expensesError.message);
      }

      if (user && isExpense && expenses) {
        const runningExpense = expenses.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);

        setEmail(user.profile_email);
        setName(user.profile_username);
        setBalance(user.current_balance - runningExpense)
        setCreatedAt(formatDate(user.created_at))
        setLatestExpenseDate(formatDate(latestExpenseDate))
      }
    }

    setup()
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Image source={require('../../assets/profileperson.png')} style={styles.avatar} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>

      {/* <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProfile', { name, email })}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity> */}

      <View style={styles.detailsBox}>
        <Text style={styles.detailsTitle}>Details</Text>
        <Text>Current Balance: ₱{balance.toFixed(2)}</Text>
        <Text>Last Expense Added: {latestExpenseDate ?? 'No recent expense'}</Text>
        <Text>Account Created: {createdAt}</Text>
      </View>

      {/* Full width logout button */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => handleSignOut()} >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#f4f5f8' },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 40,
    color: '#333',
    alignSelf: 'flex-start',
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: 'bold' },
  email: { fontSize: 14, color: 'gray', marginBottom: 20 },
  editButton: {
    backgroundColor: '#6EC1E4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
  },
  editButtonText: { color: '#fff', fontWeight: 'bold' },
  detailsBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  detailsTitle: { fontWeight: 'bold', marginBottom: 10 },
  logoutButton: {
    backgroundColor: '#ff0000',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});
