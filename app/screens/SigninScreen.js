import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { CommonActions } from '@react-navigation/native';
import { supabase } from '../scripts/supabase';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Sign In Failed', error.message);
    } else {

      console.log('Sign in successful:', data.user?.email);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'HomeTabs' }
          ]
        })
      )
    }
  };

  const handleCreateAccount = () => {
    if (loading) return;
    navigation.navigate('CreateAccount');
  };

  const handleForgotPassword = () => {
    if (loading) return;
    navigation.navigate('ForgotPasswordScreen');
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
        <Text style={styles.title}>SubSpense!</Text>

        <Image
          source={require('../../assets/gettingStarted_LOGO.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="email@email.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
        </View>


        <TouchableOpacity
          style={[styles.signInButton, loading && { opacity: 0.7 }]}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.signInButtonText}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.createAccountButton, loading && { opacity: 0.7 }]} // Added loading opacity style
          onPress={handleCreateAccount}
          disabled={loading}
        >
          <Text style={styles.createAccountButtonText}>Create an Account</Text>
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
    paddingTop: 60,
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
  logo: {
    width: 120,
    height: 90,
    marginBottom: 30,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
    fontSize: 15,
  },
  input: {
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#000',
    backgroundColor: '#fafafa',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: 5,
  },
  forgotPasswordText: {
    color: '#7bd3f7',
    fontWeight: '600',
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: '#7bd3f7',
    borderRadius: 22,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 20,
  },
  signInButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  createAccountButton: {
    backgroundColor: '#6be274',
    borderRadius: 22,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  createAccountButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});