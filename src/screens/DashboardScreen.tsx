import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
} from "react-native";
import Station from "../components/Dashboard/StationCard";
import Header from "../components/Dashboard/header";
import LinearGradient from "react-native-linear-gradient";
import { navigate } from "../utils/Navigation";
import BookingDetails from "../components/Dashboard/BookingsDetails";
import Tickets from "../components/Dashboard/Tickets";
import Feedback from "../components/Dashboard/feedBack";

const DashboardScreen = () => {
  const [showFeedbackButton, setShowFeedbackButton] = useState(false);

  const handleScroll = (event: { nativeEvent: { layoutMeasurement: any; contentOffset: any; contentSize: any; }; }) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20; // Adjust offset as needed
    setShowFeedbackButton(isAtBottom);
  };

  return (
    <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        <Header />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16} // Improves performance
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stations</Text>
            <Station />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Bookings</Text>
            <BookingDetails />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All the Tickets</Text>
            <Tickets />
          </View>
        </ScrollView>

        {/* Floating Buttons Container */}
        <View style={styles.floatingContainer}>
          {/* Feedback Button (left) */}
          {showFeedbackButton && (
            <TouchableOpacity style={styles.feedbackButtonWrapper}>
              <Feedback />
            </TouchableOpacity>
          )}

          {/* Add Booking Button (right) */}
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => navigate("BookingScreen")}
          >
            <Text style={styles.floatingButtonText}>+</Text>
          </TouchableOpacity>
        </View>
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
  floatingContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feedbackButtonWrapper: {

    padding: 10,
    borderRadius: 20,

  },
  floatingButton: {
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
});

export default DashboardScreen;
