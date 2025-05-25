import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { launchImageLibrary } from "react-native-image-picker";


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
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("USER_DATA");
        const storedPhoto = await AsyncStorage.getItem("PROFILE_PHOTO");
        if (storedData) {
          const parsedData: UserData = JSON.parse(storedData);
          setUserData(parsedData);
        }
        if (storedPhoto) {
          setProfilePhoto(storedPhoto);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        quality: 0.7,
      });

      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (uri) {
          setProfilePhoto(uri);
          await AsyncStorage.setItem("PROFILE_PHOTO", uri);
          Alert.alert("Success", "Profile photo updated!");
        }
      }
    } catch (error) {
      console.error("Error selecting image:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert("Logged Out", "You have been logged out successfully.");
      // Navigate to login or home screen
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

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

  const { customer } = userData;

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handleImageUpload}>
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={100}
              color="#ccc"
            />
          )}
        </TouchableOpacity>
        <Text style={styles.name}>{customer?.name || "N/A"}</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{customer?.id || "N/A"}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{customer?.email || "N/A"}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{customer?.phone || "N/A"}</Text>
      </View>

        
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
    backgroundColor: "#f5f5f5",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
