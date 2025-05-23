import React, { useEffect, useRef, useState } from 'react';
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

import { CommonActions } from '@react-navigation/native';

export default function VerifyAccountScreen({ route, navigation }) {
  const [email, setEmail] = useState('');

  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [pin3, setPin3] = useState('');
  const [pin4, setPin4] = useState('');
  const [pin5, setPin5] = useState('');
  const [pin6, setPin6] = useState('');

  const refPin2 = useRef();
  const refPin3 = useRef();
  const refPin4 = useRef();
  const refPin5 = useRef();
  const refPin6 = useRef();
  const refVerifyButton = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email);
    }
  }, [route.params?.email]);

  const handleVerify = async () => {
    const enteredPin = `${pin1}${pin2}${pin3}${pin4}${pin5}${pin6}`;
    if (enteredPin.length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResendMessage('');

    const { data, error: otpError } = await supabase.auth.verifyOtp({
      email: email,
      token: enteredPin,
      type: 'signup',
    });

    setIsLoading(false);

    if (otpError) {
      setError(otpError.message);
      Alert.alert('Verification Failed', otpError.message);
    } else {
      Alert.alert('Success!', 'Your account has been verified.');
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
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Email address not found. Cannot resend code.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResendMessage('');

    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    setIsLoading(false);

    if (resendError) {
      setError(resendError.message);
      Alert.alert('Error', 'Failed to resend OTP: ' + resendError.message);
    } else {
      setResendMessage('A new OTP has been sent to your email.');
      Alert.alert('OTP Sent', 'A new OTP has been sent to your email.');
    }
  };

  const handlePinChange = (text, setter, nextRef) => {
    setter(text);
    if (text.length === 1 && nextRef && nextRef.current) {
      nextRef.current.focus();
    }
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Verify your account</Text>
        <Text style={styles.subtitle}>
          Please enter the 6-digit OTP that we sent to{' '}
          <Text style={styles.emailText}>{email || 'your email'}</Text>.
        </Text>

        <View style={styles.pinContainer}>
          <TextInput
            style={styles.pinInput}
            keyboardType="number-pad"
            maxLength={1}
            value={pin1}
            onChangeText={(text) => handlePinChange(text, setPin1, refPin2)}
            autoFocus
          />
          <TextInput
            ref={refPin2}
            style={styles.pinInput}
            keyboardType="number-pad"
            maxLength={1}
            value={pin2}
            onChangeText={(text) => handlePinChange(text, setPin2, refPin3)}
          />
          <TextInput
            ref={refPin3}
            style={styles.pinInput}
            keyboardType="number-pad"
            maxLength={1}
            value={pin3}
            onChangeText={(text) => handlePinChange(text, setPin3, refPin4)}
          />
          <TextInput
            ref={refPin4}
            style={styles.pinInput}
            keyboardType="number-pad"
            maxLength={1}
            value={pin4}
            onChangeText={(text) => handlePinChange(text, setPin4, refPin5)}
          />
          <TextInput
            ref={refPin5}
            style={styles.pinInput}
            keyboardType="number-pad"
            maxLength={1}
            value={pin5}
            onChangeText={(text) => handlePinChange(text, setPin5, refPin6)}
          />
          <TextInput
            ref={refPin6}
            style={styles.pinInput}
            keyboardType="number-pad"
            maxLength={1}
            value={pin6}
            onChangeText={(text) => {
              setPin6(text);
              if (text.length === 1 && refVerifyButton.current) {
              }
            }}
          />
        </View>

        {error && <Text style={styles.errorMessage}>{error}</Text>}
        {resendMessage && <Text style={styles.resendInfoMessage}>{resendMessage}</Text>}


        <TouchableOpacity onPress={handleResendCode} disabled={isLoading} style={styles.resendButtonContainer}>
          <Text style={styles.resendCodeText}>
            Didn't receive a code?{' '}
            <Text style={{ color: isLoading ? '#aaa' : '#29ABE2' }}>Resend Code</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          ref={refVerifyButton}
          style={isLoading ? styles.verifyButtonDisabled : styles.verifyButton}
          onPress={handleVerify}
          disabled={isLoading}
        >
          <Text style={styles.verifyButtonText}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.copyrightText}>
          Copyright © 2025 Group 2. All rights Reserved
        </Text>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
  emailText: {
    fontWeight: 'bold',
    color: '#29ABE2',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    maxWidth: 360,
    marginBottom: 20,
  },
  pinInput: {
    width: 45,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
    backgroundColor: '#f9f9f9',
  },
  errorMessage: {
    fontSize: 14,
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 10,
  },
  resendInfoMessage: {
    fontSize: 14,
    color: 'green',
    textAlign: 'center',
    marginBottom: 10,
  },
  resendButtonContainer: {
    marginVertical: 15,
  },
  resendCodeText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: '#7bd3f7',
    borderRadius: 25,
    paddingVertical: 15,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    marginTop: 10,
  },
  verifyButtonDisabled: {
    backgroundColor: '#b0e0f2',
    borderRadius: 25,
    paddingVertical: 15,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    marginTop: 10,
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  copyrightText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 'auto',
    paddingTop: 20,
  },
});