/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
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

const TOKEN_EXPIRY_DAYS = 7;

const LoginScreen = () => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if the user is already logged in on app launch
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("USER_DATA");
        if (!userDataString) return;

        const userData = JSON.parse(userDataString);
        const storedTime = userData.timestamp;
        const currentTime = Date.now();

        // Check if the token is still valid
        if (currentTime - storedTime < TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000) {
          navigate("DashboardScreen");
        } else {
          // Token expired, clear storage
          await AsyncStorage.removeItem("USER_DATA");
        }
      } catch (error) {
        console.error("Failed to check login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    if (!phone || !email || !name || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
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
      });

      const data = await response.json();

      if (response.ok) {
        const { message, accessToken, customer } = data;

        // Save user data and timestamp to AsyncStorage
        const userData = {
          message,
          accessToken,
          customer,
          timestamp: Date.now(), // Save the current time
        };

        await AsyncStorage.setItem("USER_DATA", JSON.stringify(userData));
        Alert.alert("Success", message);

        // Navigate to Dashboard
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
