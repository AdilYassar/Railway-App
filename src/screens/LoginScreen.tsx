/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../utils/Navigation";
import { BASE_URL } from "../state/Config";

const LoginScreen = () => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

 const handleLogin = async () => {
  if (!phone || !email || !name || !password) {
    Alert.alert("Error", "Please fill in all fields.");
    return;
  }

  setIsLoading(true);
  try {
    const response = await fetch(
      `${BASE_URL}/users/login`, // Replace with your real URL
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          email,
          name,
          password,
        }),
      }
    );

    const data = await response.json();

    // Log the response for debugging
    console.log("API Response:", data);

    if (response.ok) {
      const { message, accessToken, customer } = data;

      // Save the entire user data object to AsyncStorage
    await AsyncStorage.setItem(
  "USER_DATA",
  JSON.stringify({
    message,
    accessToken,
    customer, // Make sure to include all fields like `customer.id`
  })
);

      // Log the user data to the console for debugging
      console.log("User Data saved:", data);
      Alert.alert("Success", message);

      // Navigate to Dashboard or other screen
      navigate("DashboardScreen");
    } else {
      Alert.alert(
        "Login Failed",
        data.message || "Please check your details or try again later."
      );
    }
  } catch (error) {
    console.error("Login failed:", error);
    Alert.alert(
      "Login Failed",
      "An error occurred. Please check your details or try again later."
    );
  } finally {
    setIsLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Email Address"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={[styles.button, isLoading && { backgroundColor: "#aaa" }]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
