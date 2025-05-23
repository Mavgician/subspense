import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
  const timer = setTimeout(() => {
    navigation.replace('GetStarted');
  }, 2000);

  return () => clearTimeout(timer);
}, [navigation]); // Add navigation to the dependency array

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.pinimg.com/736x/1d/d4/c6/1dd4c67c55e7abd3ceebc4f58620dc82.jpg' }}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#60bee0' },
  logo: { width: 400, height: 200 },
});
