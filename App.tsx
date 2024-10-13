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
import FormSearch from "./screensModal/FormSearch";
import SeacrHeader from "./components/common/SeacrHeader";
import SearchResults from "./screensModal/SearchResults";
import SearchHeader from "./components/common/SearchHeaderr";
import SeacrHeaderr from "./components/common/SearchHeaderr";
import Notification from "./screensModal/Notification";
import Apply from "./screensModal/Apply";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./Services/mainService";
import ApplyComplete from "./screensModal/ApplyComplete";

export default function App() {
  const Stack = createStackNavigator();

  return (
    <QueryClientProvider client={queryClient}>
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
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="FormSearch"
          component={FormSearch}
          options={{ presentation: "modal", header: () => <SeacrHeader /> }}
        />
        <Stack.Screen
          name="SearchResults"
          component={SearchResults}
          options={({ route }) => ({
            presentation: "modal",
            header: () => <SeacrHeaderr />,
          })}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="Apply"
          component={Apply}
          options={{ presentation: "modal" }}
        /> 
       <Stack.Screen
        name="ApplyComplete"
        component={ApplyComplete}
        options={{ presentation: "modal" }}
      />
      </Stack.Navigator>
    </NavigationContainer>
    </QueryClientProvider>
  );
}
