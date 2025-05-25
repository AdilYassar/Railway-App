import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Station from "../components/Dashboard/StationCard";
import Header from "../components/Dashboard/header";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native"; // <--- import here

import { navigate } from "../utils/Navigation";
import { BASE_URL } from "../state/Config";

type StationType = {
  _id: string;
  name: string;
};

type BookingType = {
  _id: string;
  from: StationType;
  to: StationType;
  totalCost: number;
  paymentMethod: string;
};

const DashboardScreen = () => {
  const [bookings, setBookings] = useState<BookingType[] | null>(null);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchBookings = async () => {
        setLoadingBookings(true);

        try {
          const userDataString = await AsyncStorage.getItem("USER_DATA");
          if (!userDataString) {
            setBookings([]);
            setLoadingBookings(false);
            return;
          }
          const userData = JSON.parse(userDataString);
          const customerId = userData.customer?.id;
          const token = userData.accessToken;

          if (!customerId || !token) {
            setBookings([]);
            setLoadingBookings(false);
            return;
          }

          const response = await fetch(`${BASE_URL}/bookings/customer/${customerId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            setBookings([]);
            setLoadingBookings(false);
            return;
          }

          const data = await response.json();
          setBookings(data.bookings || []);
        } catch (error) {
          console.error("Failed to fetch bookings", error);
          setBookings([]);
        } finally {
          setLoadingBookings(false);
        }
      };

      fetchBookings();
    }, [])
  );

  const renderBookingItem = ({ item }: { item: BookingType }) => (
    <View style={styles.bookingItem}>
      <Text style={styles.bookingText}>
        From: {item.from.name} {"\n"}
        To: {item.to.name} {"\n"}
        Cost: ${item.totalCost.toFixed(2)} {"\n"}
        Payment: {item.paymentMethod}
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        <Header />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stations</Text>
            <Station />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Bookings</Text>

            {loadingBookings ? (
              <ActivityIndicator size="large" color="#2575fc" />
            ) : bookings && bookings.length > 0 ? (
              <FlatList
                data={bookings}
                keyExtractor={(item) => item._id}
                renderItem={renderBookingItem}
                scrollEnabled={false} // disable scroll in FlatList since inside ScrollView
              />
            ) : (
              <View style={styles.emptyBookingsContainer}>
                <Text style={styles.emptyBookingsText}>You have no bookings yet.</Text>
                <Text style={styles.emptyBookingsSubText}>
                  Tap the + button below to create a new booking.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigate("BookingScreen")}
        >
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2575fc",
    marginBottom: 15,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#ff5c5c",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ff5c5c",
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  floatingButtonText: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "900",
    lineHeight: 36,
  },
  bookingItem: {
    backgroundColor: "#e0e7ff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  bookingText: {
    fontSize: 16,
    color: "#333",
  },
  emptyBookingsContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyBookingsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginBottom: 8,
  },
  emptyBookingsSubText: {
    fontSize: 14,
    color: "#bbb",
  },
});

export default DashboardScreen;
