import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import DetailsScreen from "./screens/DetailsScreen";
import MainHeader from "./components/common/MainHeader";
import BottomNav from "./components/common/BottomNav";
import CompanyDetail from "./screensModal/CompanyDetail";
import JobDetail from "./screensModal/JobDetail";
import InfomationCVModal from "./screensModal/InfomationCVModal";
import GerneralInfo from "./screensModal/GerneralInfo";
import Experience from "./screensModal/Experience";
import Skills from "./screensModal/Skills";
import Education from "./screensModal/Education";

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="BottomTabs"
          component={BottomNav}
          // options={{
          //   header: () => <MainHeader />,
          // }}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CompanyDetail"
          component={CompanyDetail}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="JobDetail"
          component={JobDetail}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="Information"
          component={InfomationCVModal}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="General Information"
          component={GerneralInfo}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="Experience"
          component={Experience}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="Skills"
          component={Skills}
          options={{ presentation: "modal" }}
        />
         <Stack.Screen
          name="Education"
          component={Education}
          options={{ presentation: "modal"  }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
