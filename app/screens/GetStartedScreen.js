import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const fontFamilySFPro = Platform.select({
  ios: 'SF Pro Text',
  android: 'System',
});

export default function GetStartedScreen({ navigation }) {
  console.log(process.env.EXPO_PUBLIC_SUPABASE_URL)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SubSpense!</Text>
      <Image
        source={require('../../assets/gettingStarted_LOGO.png')}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.desc}>
        It looks like you are new here. Would you like to create an account before continuing?
        {'\n\n'}
        An account will save your earning progress as you use this app.
        {'\n\n'}
        You can always create an account later if you skip.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.push('CreateAccount')}
        >
          <Text style={styles.createButtonText}>Create an Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.push('Signin')}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 36,
    color: '#222',
    textAlign: 'center',
    fontFamily: fontFamilySFPro,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 36,
  },
  desc: {
    fontSize: 13,
    color: '#000',
    marginBottom: 20,
    lineHeight: 15,
    fontFamily: fontFamilySFPro,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 230,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#7bd3f7',
    borderRadius: 22,
    paddingVertical: 14,
    marginBottom: 14,
    alignItems: 'center',
    width: '100%',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: fontFamilySFPro,
  },
  skipButton: {
    backgroundColor: '#6be274',
    borderRadius: 22,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  skipButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: fontFamilySFPro,
  },
});
