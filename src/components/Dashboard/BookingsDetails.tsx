import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { BASE_URL } from "../../state/Config";

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

const BookingDetails = () => {
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

  if (loadingBookings) {
    return <ActivityIndicator size="large" color="#2575fc" />;
  }

  if (!bookings || bookings.length === 0) {
    return (
      <View style={styles.emptyBookingsContainer}>
        <Text style={styles.emptyBookingsText}>You have no bookings yet.</Text>
        <Text style={styles.emptyBookingsSubText}>
          Tap the + button below to create a new booking.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={bookings}
      keyExtractor={(item) => item._id}
      renderItem={renderBookingItem}
      scrollEnabled={false} // Disable scroll in FlatList since inside ScrollView
    />
  );
};

const styles = StyleSheet.create({
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

export default BookingDetails;
