import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { navigate } from "../../utils/Navigation";
import { BASE_URL } from "../../state/Config";

interface Train {
  _id: string;
  name: string;
  trainNumber: string;
}

interface Ticket {
  _id: string;
  customerId: string | null;
  trainId: Train;
  scheduleId: string;
  seatNumber: string;
  classType: string;
  price: number;
  status: string;
  bookingDate: string;
}

const Tickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`${BASE_URL}/tickets`);
        const data = await response.json();
        if (data && data.tickets) {
          setTickets(data.tickets);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleNavigateToBooking = (ticket: Ticket) => {
   navigate("BookingScreen", { ticket });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading Tickets...</Text>
      </View>
    );
  }

  if (!tickets.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No tickets found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tickets}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View style={styles.ticketCard}>
          <Text style={styles.trainName}>{item.trainId.name}</Text>
          <Text style={styles.details}>
            Train Number: {item.trainId.trainNumber}
          </Text>
          <Text style={styles.details}>Seat: {item.seatNumber}</Text>
          <Text style={styles.details}>Class: {item.classType}</Text>
          <Text style={styles.details}>Price: ${item.price}</Text>
          <Text style={styles.details}>
            Booking Date: {new Date(item.bookingDate).toLocaleDateString()}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigateToBooking(item)}
          >
            <Text style={styles.buttonText}>View Booking</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 10,
  },
  ticketCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trainName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#007bff",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  message: {
    fontSize: 16,
    color: "#777",
  },
});

export default Tickets;
