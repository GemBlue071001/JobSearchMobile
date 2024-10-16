import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import HomeScreen from "../../screens/HomeScreen";
import CompaniesScreen from "../../screens/CompaniesScreen";
import PersonalScreen from "../../screens/PersonalScreen";
import { ProfileScreenWithDrawer } from "../../App";
import {
  BottomTabNavigationOptions,
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

export default function BottomNav({ navigation }: BottomTabScreenProps<any>) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName = "circle";

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Companies") {
            iconName = "building";
          } else if (route.name === "Account") {
            iconName = "user";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FF4500",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" options={{ headerShown: false }}>
        {() => (
          <ProfileScreenWithDrawer component={HomeScreen} headerType="main" />
        )}
      </Tab.Screen>

      <Tab.Screen name="Companies" options={{ headerShown: false }}>
        {() => (
          <ProfileScreenWithDrawer
            component={CompaniesScreen}
            headerType="main"
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Account" options={{ headerShown: false }}>
        {() => (
          <ProfileScreenWithDrawer
            component={PersonalScreen}
            headerType="account"
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
