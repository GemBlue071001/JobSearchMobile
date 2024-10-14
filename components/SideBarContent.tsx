import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons"; // Using vector icons

export default function SidebarContent(props:any) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Profile section */}
      <View style={styles.profileSection}>
        <FontAwesome name="user-circle" size={50} color="black" />
        <Text style={styles.userName}>Thúc Minh</Text>
      </View>

      {/* Drawer Items (Links) */}
      <DrawerItemList {...props} />

      {/* Custom Links below the main menu items */}
      <View style={styles.customLinks}>
        <TouchableOpacity style={styles.linkItem}>
          <FontAwesome name="cog" size={20} color="black" />
          <Text style={styles.linkText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkItem}>
          <FontAwesome name="sign-out" size={20} color="red" />
          <Text style={[styles.linkText, { color: "red" }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  customLinks: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  linkText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
