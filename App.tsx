import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import MainHeader from './components/common/MainHeader';
import BottomNav from './components/common/BottomNav';

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="BottomTabs"
        component={BottomNav}
        options={{
          header: () => <MainHeader />,
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
  );
}

