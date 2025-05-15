import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import axios from "axios";

interface StationCardProps {
  name: string;
  code: string;
  city: string;
  state: string;
}

const StationCard: React.FC<StationCardProps> = ({ name, code, city, state }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.stationName}>{name}</Text>
      <Text style={styles.stationCode}>Code: {code}</Text>
      <Text style={styles.location}>
        {city}, {state}
      </Text>
    </View>
  );
};

interface Station {
  _id: string;
  name: string;
  code: string;
  location: {
    city: string;
    state: string;
  };
}

const Station = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get("https://07fe-2400-adc5-124-2500-a074-74fc-2c0a-1cdc.ngrok-free.app/api/stations");
        if (response.data?.stations) {
          setStations(response.data.stations);
        }
      } catch (error) {
        console.error("Error fetching stations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading Stations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stations</Text>
      <FlatList
        data={stations}
        renderItem={({ item }) => (
          <StationCard
            name={item.name}
            code={item.code}
            city={item.location.city}
            state={item.location.state}
          />
        )}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
    marginTop: -300, // Adjust as needed for your layout
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  flatListContainer: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    marginTop: 20,
    width: 200,
    height: 120,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  stationName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#007bff",
  },
  stationCode: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  location: {
    fontSize: 14,
    color: "#777",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Station;
