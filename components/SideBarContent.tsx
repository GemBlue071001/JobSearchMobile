import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  DevSettings,
  ActivityIndicator,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { FontAwesome } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigationState } from "@react-navigation/native";

export default function SidebarContent(props: any) {
  const { navigation } = props;
  const [loading, setLoading] = useState(false); // New loading state

  const currentRoute = useNavigationState((state) => state.routes[state.index]);

  // Sign out function
  const handleSignOut = async () => {
    try {
      setLoading(true); // Start loading
      await AsyncStorage.clear();
      await AsyncStorage.setItem("redirectPath", currentRoute.name);
      // DevSettings.reload();
      navigation.replace(currentRoute.name)
      navigation.navigate("Login");
    } catch (e) {
      console.error("Failed to sign out.", e);
    }
  };

  // When the app reloads, it will automatically navigate to login, so no need to handle navigation here.
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Profile section */}
      <View style={styles.profileSection}>
        <FontAwesome name="user-circle" size={60} color="black" />
        <Text style={styles.userName}>Thúc Minh</Text>
      </View>

      {/* Custom Links below the main menu items */}
      <View style={styles.customLinks}>
        <TouchableOpacity
          style={styles.linkItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Icon name="star-border" size={20} color="#000" />
          <Text style={styles.linkText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkItem}
          onPress={() => navigation.navigate("FormSearch")}
        >
          <Icon name="work-outline" size={20} color="#000" />
          <Text style={styles.linkText}>All Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkItem}
          onPress={() => navigation.navigate("Companies")}
        >
          <Icons name="home-outline" size={20} color="#000" />
          <Text style={styles.linkText}>Companies</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkItem}
          onPress={() => navigation.navigate("Account")}
        >
          <Icon name="person-outline" size={20} color="#000" />
          <Text style={styles.linkText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out button */}
      <TouchableOpacity style={styles.lineItemm} onPress={handleSignOut}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesome name="sign-out" size={20} color="red" />
          <Text style={[styles.linkText, { color: "red" }]}>Sign Out</Text>
        </View>
      </TouchableOpacity>

      {/* Loading spinner */}
      {/* {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )} */}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 8,
  },
  customLinks: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  lineItemm: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
    elevation: 15,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  linkText: {
    fontSize: 16,
    marginLeft: 15,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
});
