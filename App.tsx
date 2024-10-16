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
import EducationDetailsEdit from "./screensModal/EducationDetails";
import ExperienceDetailsEdit from "./screensModal/ExperienceDetails";
import ResumeScreen from "./screensModal/CVModal";
import UploadCVScreen from "./screensModal/UploadCV";
import "react-native-gesture-handler";

import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import VerificationModal from "./screensModal/VerificationModal";
import PersonalScreen from "./screens/PersonalScreen";
import { Text, View } from "react-native";
import AccountHeader from "./components/common/AccountHeader";
import SidebarContent from "./components/SideBarContent";
import CompaniesScreen from "./screens/CompaniesScreen";
import { ComponentType } from "react";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import EmailVerification from "./screens/EmailVerification";
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
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
            name="CVModal"
            component={ResumeScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="UploadCV"
            component={UploadCVScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="Experience"
            component={Experience}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="ExperienceDetailsEdit"
            component={ExperienceDetailsEdit}
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
            name="EducationDetailsEdit"
            component={EducationDetailsEdit}
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
          <Stack.Screen
            name="VerificationModal"
            component={VerificationModal}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
            // options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="Verification"
            component={EmailVerification}
            options={{ headerShown: false }}
            // options={{ presentation: "modal" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

type ProfileScreenWithDrawerProps = {
  component: ComponentType<any>;
  headerType: string;
};

export const ProfileScreenWithDrawer: React.FC<
  ProfileScreenWithDrawerProps
> = ({ component: Component, headerType = true, ...restProps }) => {
  const Drawer = createDrawerNavigator();
  const getHeaderForType = (navigation: any) => {
    switch (headerType) {
      case "main":
        return <MainHeader navigation={navigation} />;
      case "account":
        return <AccountHeader navigation={navigation} />;
      // case "custom":
      //   return <CustomHeader navigation={navigation} />;
      default:
        return null;
    }
  };

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props: DrawerContentComponentProps) => (
        <SidebarContent {...props} />
      )}
    >
      <Drawer.Screen
        name="tabs"
        options={({ navigation }) => ({
          header: () => getHeaderForType(navigation),
        })}
        component={(props: any) => <Component {...props} {...restProps} />}
      />
    </Drawer.Navigator>
  );
};
