import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Image, Dimensions, ImageBackground, ScrollView } from 'react-native'
import { Redirect, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '.././constants'
import CustomButton from '../components/CustomButton'

const dimensions = Dimensions.get('window');
const imageWidth = dimensions.width;
const imageHeight = dimensions.height;

export default function App() {
    return (
        <View>
            <ImageBackground source={images.background}
                style={{ height: imageHeight, width: imageWidth }}
                resizeMode="cover"
            >
                <SafeAreaView className='h-full'>
                    <ScrollView contentContainerStyle={{ height: '100%' }}>
                        <View className="w-full items-center justify-center  h-[90%] pb-[60%]">
                            <Text className="font-pextrabold text-xl text-white">
                                Welcome to Job Search Portal!
                            </Text>
                            <Text className="font-pregular p-1 text-white">
                                Explore your job options
                            </Text>
                        </View>
                        <View className="flex w-full h-[10%] flex-row justify-evenly items-center">
                            <CustomButton
                                title='Sign up'
                                handlePress={() => router.push('/sign-up')}
                                textStyles='text-white'
                                containerStyles='w-[50%] h-full'
                            />
                            <CustomButton
                                title='Sign in'
                                handlePress={() => router.push('/sign-in')}
                                containerStyles='bg-white w-[50%] h-full rounded-tl-3xl'
                                textStyles='text-cyan-500' />
                        </View>
                    </ScrollView>
                    <StatusBar backgroundColor='#161622' style='light' />
                </SafeAreaView>
            </ImageBackground>

        </View >


    )
}

