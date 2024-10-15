import DetailsScreen from "../../screens/DetailsScreen";
import HomeScreen from "../../screens/HomeScreen";
import Icon from "react-native-vector-icons/FontAwesome";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CompanyDetail from "../../screensModal/CompanyDetail";
import CompaniesScreen from "../../screens/CompaniesScreen";
import PersonalScreen from "../../screens/PersonalScreen";
import AccountHeader from "./AccountHeader";
import MainHeader from "./MainHeader";

export default function BottomNav({ navigation }: any) {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }: any) => ({
        tabBarIcon: ({ color, size }: any) => {
          let iconName: string = "circle";

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
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ header: () => <MainHeader navigation={navigation} /> }}
      />
      {/* <Tab.Screen name="CompanyDetail" component={CompanyDetail}  /> */}

      <Tab.Screen
        name="Companies"
        component={CompaniesScreen}
        options={{ header: () => <MainHeader navigation={navigation} /> }}
      />
      <Tab.Screen
        name="Account"
        component={PersonalScreen}
        options={{ header: () => <AccountHeader navigation={navigation} /> }}
      />
    </Tab.Navigator>
  );
}
