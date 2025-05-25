import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Svg, Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { navigate } from "../../utils/Navigation";

const Header = () => {
  const [userName, setUserName] = useState("User");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("USER_DATA");
        const storedPhoto = await AsyncStorage.getItem("PROFILE_PHOTO");

        if (userDataString) {
          const userData = JSON.parse(userDataString);
          console.log("USER_DATA:", userData);

          const name = userData?.customer?.name || "User";
          setUserName(name);
        } else {
          console.log("No USER_DATA found in AsyncStorage.");
        }

        if (storedPhoto) {
          setProfilePhoto(storedPhoto);
          console.log("PROFILE_PHOTO from AsyncStorage:", storedPhoto);
        } else {
          console.log("Profile photo is not available in PROFILE_PHOTO.");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const navigateToProfile = () => {
    navigate("Profile");
  };

  return (
    <View style={styles.wrapper}>
      <Svg height="150" width="100%" viewBox="0 0 1440 320" style={styles.svgCurve}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#6c63ff" stopOpacity="1" />
            <Stop offset="100%" stopColor="#a288ff" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path
          fill="url(#grad)"
          d="M0,224L60,192C120,160,240,96,360,80C480,64,600,96,720,122.7C840,149,960,171,1080,160C1200,149,1320,107,1380,85.3L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
      </Svg>
      <View style={styles.container}>
        <Text style={styles.greeting}>Hello, {userName}</Text>
        <TouchableOpacity onPress={navigateToProfile} style={styles.iconContainer}>
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={40} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#6c63ff",
    paddingBottom: 20,
  },
  svgCurve: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%", // force full coverage
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 60, // Adjusted for more breathing room below the curve
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  iconContainer: {
    borderRadius: 20,
    overflow: "hidden",
  },
  profileImage: {

    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default Header;
