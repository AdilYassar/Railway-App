import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BASE_URL } from "../../state/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateBookings } from "../../state/storage";

type Station = {
  _id: string;
  name: string;
  code: string;
  location: {
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
      _id: string;
    };
  };
  createdAt: string;
  __v: number;
};

type StationsResponse = {
  message: string;
  stations: Station[];
};

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Booking() {
  const [stations, setStations] = useState<Station[]>([]);
  const [fromStation, setFromStation] = useState<string>("");
  const [toStation, setToStation] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Credit Card");
  const [totalCost, setTotalCost] = useState<string>("");
  const [loadingStations, setLoadingStations] = useState(true);
  const [loadingBooking, setLoadingBooking] = useState(false);

  const RATE_PER_KM = 10;

  const getPriceForRoute = (
    stations: Station[],
    fixedStationId: string,
    toId: string
  ): number => {
    if (!toId || fixedStationId === toId) return 0;

    const fixedStation = stations.find((s) => s._id === fixedStationId);
    const toStationObj = stations.find((s) => s._id === toId);
    if (!fixedStation || !toStationObj) return 0;

    const { lat: lat1, lng: lon1 } = fixedStation.location.coordinates;
    const { lat: lat2, lng: lon2 } = toStationObj.location.coordinates;

    const distanceKm = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
    return parseFloat((distanceKm * RATE_PER_KM).toFixed(2));
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/stations`);
        const data: StationsResponse = await res.json();

        if (res.ok && Array.isArray(data.stations)) {
          setStations(data.stations);

          const central = data.stations.find(
            (s) => s.name.toLowerCase() === "central station"
          );

          if (!central) {
            Alert.alert(
              "Error",
              "Central Station not found. Please check your data."
            );
            setLoadingStations(false);
            return;
          }

          setFromStation(central._id);

          const initialTo = data.stations.find((s) => s._id !== central._id);
          setToStation(initialTo?._id || "");
        } else {
          Alert.alert("Error", "Failed to load stations");
        }
      } catch (e) {
        Alert.alert("Error", "Network error fetching stations");
        console.error(e);
      } finally {
        setLoadingStations(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (fromStation && toStation && fromStation !== toStation) {
      setTotalCost(getPriceForRoute(stations, fromStation, toStation).toString());
    } else {
      setTotalCost("");
    }
  }, [fromStation, toStation, stations]);

  const createBooking = async () => {
    if (fromStation === toStation) {
      Alert.alert("Error", "From and To stations cannot be the same.");
      return;
    }

    if (!totalCost || isNaN(Number(totalCost)) || Number(totalCost) <= 0) {
      Alert.alert("Error", "Invalid total cost.");
      return;
    }

    setLoadingBooking(true);

    try {
      const userDataString = await AsyncStorage.getItem("USER_DATA");
      if (!userDataString) {
        Alert.alert("Error", "User not logged in");
        setLoadingBooking(false);
        return;
      }

      const userData = JSON.parse(userDataString);
      const customerId = userData.customer?.id;

      if (!customerId) {
        Alert.alert("Error", "Invalid user data");
        setLoadingBooking(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.accessToken}`,
        },
        body: JSON.stringify({
          customerId,
          from: fromStation,
          to: toStation,
          paymentMethod,
          totalCost: Number(totalCost),
          tickets: [],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const bookingData = data.booking || data;

        const newBooking = {
          bookingId: bookingData._id || bookingData.bookingId || "",
          trainName: bookingData.trainName || "Train Name",
          departure: bookingData.from || "",
          arrival: bookingData.to || "",
          date: bookingData.date || new Date().toISOString(),
          seatNumber: bookingData.seatNumber || "N/A",
        };

        const updatedUserData = {
          ...userData,
          bookings: [...(userData.bookings || []), newBooking],
        };

        await AsyncStorage.setItem("USER_DATA", JSON.stringify(updatedUserData));
        await updateBookings(newBooking);

        Alert.alert("Success", "Booking created successfully!");
      } else {
        Alert.alert("Failed", data.message || "Booking failed");
      }
    } catch (e) {
      Alert.alert("Error", "Network error or server not reachable");
      console.error(e);
    } finally {
      setLoadingBooking(false);
    }
  };

  if (loadingStations) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading stations...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Book Your Train Ticket</Text>

      <View style={styles.section}>
        <Text style={styles.label}>From Station</Text>
        <Text style={styles.fixedStation}>
          {stations.find((s) => s._id === fromStation)?.name || "Central Station"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>To Station</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={toStation}
            onValueChange={(v) => setToStation(v)}
            style={styles.picker}
            dropdownIconColor="#007AFF"
          >
            {stations
              .filter((s) => s._id !== fromStation)
              .map((s) => (
                <Picker.Item label={s.name} value={s._id} key={s._id} />
              ))}
          </Picker>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Payment Method</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={paymentMethod}
            onValueChange={setPaymentMethod}
            style={styles.picker}
            dropdownIconColor="#007AFF"
          >
            <Picker.Item label="Credit Card" value="Credit Card" />
            <Picker.Item label="Cash" value="Cash" />
          </Picker>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Total Cost ($)</Text>
        <TextInput
          style={styles.input}
          value={totalCost}
          editable={false}
          selectTextOnFocus={false}
          placeholder="0.00"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={loadingBooking ? "Booking..." : "Book Now"}
          onPress={createBooking}
          disabled={loadingBooking}
          color="#007AFF"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#f9faff",
    flexGrow: 1,
    justifyContent: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 32,
    color: "#007AFF",
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
  },
  fixedStation: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    paddingVertical: 12,
    backgroundColor: "#e6f0ff",
    borderRadius: 8,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    height: 70,
    width: "100%",

  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    color: "#222",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9faff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#007AFF",
  },
});
