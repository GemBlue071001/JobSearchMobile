import { View, Text, ImageBackground, Dimensions, ScrollView } from 'react-native'
import React from 'react'
import { useState } from 'react'
import * as Animatable from 'react-native-animatable'
import { images } from '../../constants'
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';


const dimensions = Dimensions.get('window');
const imageWidth = dimensions.width;
const imageHeight = dimensions.height;

const SignIn = () => {
    const [form, setFrom] = useState({
        email: '',
        password: ''
    })

    return (
        <View>
            <ImageBackground source={images.background}
                style={{ height: imageHeight, width: imageWidth }}
                resizeMode="cover"
            >
                <SafeAreaView className="h-full">

                    {/* <ScrollView > */}

                    <Animatable.View animation='slideInUp' className="bg-white min-h-[90vh] w-full px-4 my-6 mt-28" style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}>
                        <View className="justify-start items-center pt-10">
                            <Text className='text-cyan-500 font-pextrabold text-2xl'>Welcome back!</Text>

                            <FormField
                                tittle="Email"
                                value={form.email}
                                hanldeChangeText={(e) => setFrom({ ...form, email: e })}
                                otherStyles="mt-7"
                                keyboardType="email-address"
                                placeholder="Please enter your email"
                            />
                            <FormField
                                tittle="Password"
                                required
                                value={form.password}
                                hanldeChangeText={(e) => setFrom({ ...form, password: e })}
                                otherStyles="mt-7"
                                keyboardType="password"
                                placeholder="Please enter your password"
                            />
                        </View>


                    </Animatable.View>
                    {/* </ScrollView> */}
                </SafeAreaView>
            </ImageBackground>
        </View >
    )
}

export default SignIn