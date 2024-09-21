import DetailsScreen from "../../screens/DetailsScreen";
import HomeScreen from "../../screens/HomeScreen";
import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export default function BottomNav() {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator
        screenOptions={({ route }: any) => ({
          tabBarIcon: ({ color, size }: any) => {
            let iconName: string = 'circle';
  
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Details') {
              iconName = 'info-circle';
            }
            console.log("route",route);
            
  
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FF4500',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Details" component={DetailsScreen} />
      </Tab.Navigator>
    );
  }