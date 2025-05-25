import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons"; // Ionicons
import { navigate } from "../../utils/Navigation";

const Header = () => {
  const navigateToProfile = () => {
    navigate("Profile"); // Update route as needed
  };

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff", // white header background
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  iconContainer: {
    padding: 8, // padding for touch target
  },
});

export default Header;
