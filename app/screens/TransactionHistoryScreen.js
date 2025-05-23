import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
import { supabase } from '../scripts/supabase';

export default function TransactionHistoryScreen() {
  const { setEditingExpense } = useContext(ExpenseContext);
  const navigation = useNavigation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const [expenses, setExpenses] = useState();

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const formattedDate = dateObject.toLocaleDateString(undefined, { // undefined uses system locale
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return formattedDate
  };

  const handleDelete = (id) => {
    setExpenseToDelete(id);
    setIsModalVisible(true); // Show the modal when delete button is pressed
  };

  const confirmDelete =  async () => {
    const { data, error } = await supabase.rpc('delete_user_expense', { p_expense_id: expenseToDelete })

    if (data) {
      setIsModalVisible(false);
    }

    if (error) {
      Alert.alert('Error', error.message)
    }
  };

  const cancelDelete = () => {
    setIsModalVisible(false);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    navigation.navigate('EditExpense');
  };

  useEffect(() => {
    const setup = async () => {
      const { data, error } = await supabase.rpc('get_user_expenses')

      setExpenses(data)
    }

    setup()
  });

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Title */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Transaction History</Text>
      </View>

      {/* Expense List */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {/* Category and Date */}
            <View style={styles.row}>
              <Text style={styles.category}>{item.category || 'No category'}</Text>
              <Text style={styles.date}>{formatDate(item.created_at)}</Text>
            </View>

            {/* Title and Amount */}
            <View style={styles.row}>
              <Text style={styles.expenseTitle}>{item.title}</Text>
              <Text style={styles.amount}>Php {item.amount.toFixed(2)}</Text>
            </View>

            {/* Edit and Delete Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Custom Delete Confirmation Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Delete Expense</Text>
            <Text style={styles.modalMessage}>Are you sure you want to delete this expense? This action cannot be undone.</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={cancelDelete}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalDeleteButton]} onPress={confirmDelete}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#60bee0',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    elevation: 2,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  item: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  category: {
    color: '#888',
    fontWeight: '600',
  },
  date: {
    color: '#888',
    fontWeight: '600',
  },
  expenseTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    color: '#60bee0',
    marginRight: 20,
    fontWeight: '600',
  },
  deleteButton: {
    color: '#ff5c5c',
    fontWeight: '600',
  },
  // Modal Styles
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  modalButton: {
    width: '45%',
    padding: 12,
    borderRadius: 25, // Round corners
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#d3d3d3', // Light grey for cancel button
  },
  modalDeleteButton: {
    backgroundColor: '#ed4f4f', // Red color for delete button in modal
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
