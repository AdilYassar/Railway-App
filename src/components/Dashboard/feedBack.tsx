import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BASE_URL } from "../../state/Config";

const Feedback = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const openModal = () => setModalVisible(true);
  const closeModal = () => {
    setFeedbackMessage("");
    setModalVisible(false);
  };

  const submitFeedback = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("USER_DATA");
      if (!userDataString) {
        Alert.alert("Error", "User data not found in storage.");
        return;
      }

      const { customer } = JSON.parse(userDataString);
      if (!customer?.id) {
        Alert.alert("Error", "Customer ID is missing.");
        return;
      }

      const response = await fetch(`${BASE_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customer.id,
          message: feedbackMessage,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Feedback submitted successfully!");
        closeModal();
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.feedbackButton} onPress={openModal}>
        <Ionicons name="chatbox-ellipses-outline" size={32} color="#4a47a3" />
        <Text style={styles.buttonText}>Leave Feedback</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>We’d love your feedback</Text>

            <TextInput
              style={styles.input}
              placeholder="Type your feedback..."
              multiline
              value={feedbackMessage}
              onChangeText={setFeedbackMessage}
              placeholderTextColor="#aaa"
            />

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.buttonLabel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={submitFeedback}>
                <Text style={styles.buttonLabel}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  feedbackButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f5",
    borderRadius: 12,
    flexDirection: "row",
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    color: "#4a47a3",
    fontWeight: "600",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    height: 100,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: "top",
    fontSize: 15,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: "#4a47a3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonLabel: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});

export default Feedback;
