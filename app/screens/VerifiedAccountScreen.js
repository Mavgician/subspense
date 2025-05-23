import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function VerifiedAccountScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Account Verified</Text>

      <Image
        source={require('../../assets/gettingStarted_LOGO.png')} // Optional: keep consistent branding
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.description}>
        Welcome to SubSpense! Please enjoy and be frugal with your money.
      </Text>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.replace('HomeTabs')}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    paddingTop: 90,
    paddingBottom: 40,
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
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  nextButton: {
    backgroundColor: '#6be274',
    borderRadius: 22,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
