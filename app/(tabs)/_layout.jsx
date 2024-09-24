import { View, Text } from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router'
import AntDesign from 'react-native-vector-icons/AntDesign';


const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View className="items-center justify-center gap-1">
            <AntDesign name={icon} size={25} color={color} />
            <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ color: color }}>
                {name}
            </Text>
        </View >

    )
}
const TabsLayout = () => {
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: '#22d3ee',
                    tabBarInactiveTintColor: '#CDCDE0',
                    tabBarStyle: {
                        backgroundColor: '#161622',
                        borderTopWidth: 2,
                        borderTopColor: '#232533',
                        height: 74
                    }
                }}
            >
                <Tabs.Screen
                    name='home'
                    options={{
                        title: 'Home',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon='home'
                                color={color}
                                name='Home'
                                focused={focused} />
                        )
                    }}
                />
                <Tabs.Screen
                    name='profile'
                    options={{
                        title: 'Profile',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon='user'
                                color={color}
                                name='Profile'
                                focused={focused} />
                        )
                    }}
                />
                <Tabs.Screen
                    name='favorite'
                    options={{
                        title: 'Favorite',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon='hearto'
                                color={color}
                                name='Favorite'
                                focused={focused} />
                        )
                    }}
                />
            </Tabs>
        </>
    )
}

export default TabsLayout