import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons'; // Using Ionicons as an example
import { navigate } from '../../utils/Navigation';

const Header = () => {


  const navigateToProfile = () => {
    navigate('Profile'); // Replace 'Profile' with the name of your Profile screen
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <TouchableOpacity onPress={navigateToProfile} style={styles.iconContainer}>
        <Ionicons name="person-circle-outline" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginTop: -200,// Adjust as needed for your layout
    backgroundColor: '#fff', // Light background color
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconContainer: {
    padding: 8, // Add some padding for touchable area
  },
});

export default Header;
