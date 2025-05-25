import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_DATA_KEY = "USER_DATA";

export interface Booking {
  bookingId: string;
  trainName: string;
  departure: string;
  arrival: string;
  date: string;
  seatNumber: string;
}

export interface UserData {
  name: string;
  phone: string;
  email: string;
  bookings: Booking[];
}

export const setUserData = async (data: UserData): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(USER_DATA_KEY, jsonValue);
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

export const getUserData = async (): Promise<UserData | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);
    if (jsonValue) {
      return JSON.parse(jsonValue);
    }
    return null;
  } catch (error) {
    console.error("Error reading user data:", error);
    return null;
  }
};

export const updateBookings = async (newBooking: Booking): Promise<void> => {
  try {
    const currentDataString = await AsyncStorage.getItem(USER_DATA_KEY);
    if (!currentDataString) {
      console.warn("No user data found while updating bookings.");
      return;
    }

    const currentData: UserData = JSON.parse(currentDataString);

    if (!currentData.bookings) {
      currentData.bookings = [];
    }

    currentData.bookings.push(newBooking);

    const updatedDataString = JSON.stringify(currentData);
    await AsyncStorage.setItem(USER_DATA_KEY, updatedDataString);
  } catch (error) {
    console.error("Error updating bookings:", error);
  }
};
