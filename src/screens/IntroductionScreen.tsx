import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { navigate } from '../utils/Navigation';

const IntroductionScreen = ({ }) => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animations/Animation - 1747256816176.json')} // Replace with your animation file path
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.title}>Welcome to Railway Station</Text>
      <Text style={styles.description}>
        Experience the convenience of managing your train schedules, bookings, and much more, all in one place. Let’s get started on your journey!
      </Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigate('LoginScreen')} // Replace 'Login' with the actual screen name
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Adjust background color if needed
    padding: 20,
  },
  animation: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#007BFF', // Customize button color
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default IntroductionScreen;
