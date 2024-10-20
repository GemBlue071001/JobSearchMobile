import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import CompaniesScreen from "../../screens/CompaniesScreen";
import PersonalScreen from "../../screens/PersonalScreen";
import { ProfileScreenWithDrawerEmployer } from "../../App";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import PersonalInfo from "../../screens/Employer/PersonalInfo";
import ChangePassword from "../../screens/Employer/ChangePassword";

const Tab = createBottomTabNavigator();

export default function BottomEmployerAccount({ navigation }: BottomTabScreenProps<any>) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName = "circle"; // Default icon

          switch (route.name) {
            case "Personal":
              iconName = "user"; // Personal = user icon
              break;
            case "Password":
              iconName = "lock"; // Password = lock icon
              break;
            case "CompanyInfo":
              iconName = "building"; // CompanyInfo = building icon
              break;
            default:
              iconName = "circle"; // Default fallback
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FF4500",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Personal" options={{ headerShown: false }}>
        {() => (
          <ProfileScreenWithDrawerEmployer
            component={PersonalInfo}
            headerType="main"
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Password" options={{ headerShown: false }}>
        {() => (
          <ProfileScreenWithDrawerEmployer
            component={ChangePassword}
            headerType="main"
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="CompanyInfo" options={{ headerShown: false }}>
        {() => (
          <ProfileScreenWithDrawerEmployer
            component={PersonalScreen}
            headerType="main"
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
