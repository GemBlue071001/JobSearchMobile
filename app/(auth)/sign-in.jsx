import { View, Text, ImageBackground, Dimensions, ScrollView } from 'react-native'
import React from 'react'
import { useState } from 'react'
import * as Animatable from 'react-native-animatable'
import { images } from '../../constants'
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import { Link } from 'expo-router'
import CustomButton from '../../components/CustomButton'


const dimensions = Dimensions.get('window');
const imageWidth = dimensions.width;
const imageHeight = dimensions.height;

const SignIn = () => {
    const [form, setFrom] = useState({
        email: '',
        password: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const submit = () => {

    }

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
                            <Link href="/home" className='text-white font-pextrabold text-2xl'>Welcome back!</Link>
                            <FormField
                                title="Email"
                                value={form.email}
                                hanldeChangeText={(e) => setFrom({ ...form, email: e })}
                                otherStyles="mt-7"
                                keyboardType="email-address"
                                placeholder="Please enter your email"
                            />
                            <FormField
                                title="Password"
                                required
                                value={form.password}
                                hanldeChangeText={(e) => setFrom({ ...form, password: e })}
                                otherStyles="mt-7"
                                keyboardType="password"
                                placeholder="Please enter your password"
                            />

                        </View>
                        <View className="justify-end items-end mt-4">
                            <Link href="#" className='font-psemibold text-sky-400'>Forgot your password?</Link>
                        </View>
                        <View className="justify-start items-center pt-5">
                            <CustomButton
                                title='Sign In'
                                handlePress={submit}
                                containerStyles="border-2 w-full h-10 rounded-xl bg-sky-400"
                                textStyles="text-white text-xl"
                                isLoading={isSubmitting}
                            />
                            <View className="justify-center pt-5 flex-row gap-2">
                                <Text className="text-black font-pregular text-lg">
                                    Don't have an account?
                                </Text>
                                <Link href="/sign-up" className='font-psemibold text-lg text-sky-400'>Sign up now</Link>
                            </View>
                        </View>
                    </Animatable.View>
                    {/* </ScrollView> */}
                </SafeAreaView>
            </ImageBackground>
        </View >
    )
}

export default SignIn