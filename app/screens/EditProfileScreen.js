import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { supabase } from '../scripts/supabase';

export default function EditProfileScreen({ navigation, route }) {
  const [name, setName] = useState(route.params?.name || '');
  const [email, setEmail] = useState(route.params?.email || '');

  const handleSave = async () => {
    const { data: userData, error: userError } = await supabase.rpc('get_current_user_profile')
    const user = userData[0]

    if (user.profile_email == email && user.profile_username == name) {
      navigation.goBack()

      return true
    }

    if (user.profile_email == email || user.profile_username == name) {
      Alert.alert('Cannot update.', 'Email or username is the same.')
      return true
    }

    const { data: newUserData, error: newUserError } = await supabase.rpc('update_profile_details', { new_username: name, new_profile_email: email })
    const { data: emailData, error: emailError } = await supabase.auth.updateUser({
      email: email
    });

    if (newUserError || emailError || userError) {
      Alert.alert('Error updating authentication email', error.message);
      console.error('Auth email update error:', error);
    }

    if (userData && emailData && newUserData) {
      Alert.alert(
        'Confirmation Email Sent',
        'Please check your new email address to confirm the change. Your login email will update after confirmation.'
      );
      console.log('Auth email update initiated, user data:', data.user);
    }
  };

  const handleCancel = () => {
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput 
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput 
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.saveButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 , marginTop: 40},
  label: { fontSize: 14, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginTop: 5 },
  saveButton: { backgroundColor: '#6EC1E4', padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  cancelButton: { backgroundColor: '#ff0000', padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
});
