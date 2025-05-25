import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface Booking {
  details: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface UserData {
  accessToken: string;
  customer: Customer;
  bookings: Booking[];
}

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("USER_DATA");
        if (storedData) {
          const parsedData: UserData = JSON.parse(storedData);
          console.log("User Data:", parsedData); // Logs data to the terminal for debugging
          setUserData(parsedData);
        } else {
          console.log("No user data found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading Profile...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No user data available. Please log in.</Text>
      </View>
    );
  }

  const { customer, bookings } = userData;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{customer?.name || "N/A"}</Text>

             <Text style={styles.label}>id:</Text>
        <Text style={styles.value}>{customer?.id || "N/A"}</Text>


        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{customer?.email || "N/A"}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{customer?.phone || "N/A"}</Text>
      </View>

      <View style={styles.bookings}>
        <Text style={styles.label}>Bookings:</Text>
        {bookings && bookings.length > 0 ? (
          bookings.map((booking, index) => (
            <View key={index} style={styles.bookingCard}>
              <Text style={styles.bookingText}>{`Booking #${index + 1}`}</Text>
              <Text style={styles.bookingText}>Details: {booking.details || "N/A"}</Text>
       
            </View>
          ))
        ) : (
          <Text style={styles.message}>No bookings yet.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  card: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  bookings: {
    marginTop: 20,
  },
  bookingCard: {
    padding: 10,
    backgroundColor: "#e6f7ff",
    borderRadius: 8,
    marginBottom: 10,
  },
  bookingText: {
    fontSize: 14,
    color: "#007bff",
  },
  message: {
    fontSize: 16,
    color: "#777",
  },
});

export default Profile;
