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

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }
    Alert.alert('Forgot Password', 'If this email exists, a password reset link has been sent.');
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
        <Text style={styles.title}>Forgot Password</Text>

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

        <Text style={styles.instructionText}>
          Please enter your email address. We will send you a link to reset your password.
        </Text>

        <View style={{ height: 40 }} />

        <TouchableOpacity
          style={[styles.sendButton, loading && { opacity: 0.7 }]}
          onPress={handleSend}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>
            {loading ? 'Sending...' : 'Send'}
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
    paddingHorizontal: 28,
    paddingTop: 180,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#222',
    textAlign: 'center',
  },
  logo: {
    width: 120,
    height: 90,
    marginBottom: 36,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
    fontSize: 15,
  },
  input: {
    height: 44,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#000',
    backgroundColor: '#fafafa',
  },
  instructionText: {
    width: '100%',
    color: '#555',
    fontSize: 15,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'left',
  },
  sendButton: {
    backgroundColor: '#6be274',
    borderRadius: 22,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
