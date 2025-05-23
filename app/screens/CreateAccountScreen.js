import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { supabase } from '../scripts/supabase';

export default function CreateAccountScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAccount = async () => {
    setIsLoading(true);
    setError(null);

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }
    if (username.length < 8) {
      setError('Username needs to be at least 8 characters.');
      setIsLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    if (password.length < 8) {
      setError('Password needs to be at least 8 characters.');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: { // This data is stored in auth.users.raw_user_meta_data
          username: username.trim(),
          email: email.trim()
          // You can add other initial data here if needed
        }
      }
    });

    console.log(authData, authError)

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    if (!authData || !authData.user) {
      setError('User creation initiated, but user data was not returned as expected. Please check your email for verification.');
      setIsLoading(false);
      Alert.alert(
        'Account Creation Initiated!',
        'Please check your email to verify your account.'
      );
      navigation.replace('VerifyAccount', { email: email.trim() });
      return;
    }

    setIsLoading(false);
    Alert.alert(
      'Account Created!',
      'Please check your email to verify your account.'
    );
    navigation.replace('VerifyAccount', { email: email.trim() });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="yourusername (min 8 characters)"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="******** (min 8 characters)"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
          />
        </View>

        {error ? (
          <Text style={styles.errorMessage}>{error}</Text>
        ) : (
          <View style={{ height: 20, marginBottom: 10 }} />
        )}

        <TouchableOpacity
          style={isLoading ? styles.nextButtonDisabled : styles.nextButton}
          onPress={handleCreateAccount}
          disabled={isLoading}
        >
          <Text style={styles.nextButtonText}>
            {isLoading ? 'Creating Account...' : 'Create Account & Next'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#222',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 15,
    minHeight: 20,
  },
  inputGroup: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
    fontSize: 15,
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f9f9f9',
  },
  nextButton: {
    backgroundColor: '#7bd3f7',
    borderRadius: 24,
    paddingVertical: 15,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginTop: 10,
  },
  nextButtonDisabled: {
    backgroundColor: '#b0e0f2',
    borderRadius: 24,
    paddingVertical: 15,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginTop: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});