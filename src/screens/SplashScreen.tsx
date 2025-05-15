import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

import { navigate, resetAndNavigate } from '../utils/Navigation';

const SplashScreen = () => {

  
    useEffect(() => {
      const timer = setTimeout(() => {
      navigate('IntroductionScreen'); // Replace 'Home' with the name of the target screen
      }, 3000); // Delay for 3 seconds
  
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }, []);


  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animations/Animation - 1747256621226.json')} // Replace with your animation file path
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.title}>Railway Station</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Adjust the background color if needed
  },
  animation: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333', // Adjust the title color if needed
    marginTop: 20,
  },
});

export default SplashScreen;
