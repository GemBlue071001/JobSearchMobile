import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { icons } from '../constants';

const FormField = ({ title, value, placeholder, hanldeChangeText, otherStyles, keyboardType, ...props }) => {
    const [ShowPassword, setShowPassword] = useState(false)
    return (
        <View className={`${otherStyles} space-y-1 w-full`}>
            <Text className='text-base text-black-300 font-pmedium'>{title}</Text>
            <View className='border-2 border-gray-600 w-full h-12 rounded-xl items-center justify-center
            focus:border-secondary flex-row'>
                <TextInput
                    className="flex-1 text-black-300 font-semibold text-base"
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#7b7b8b"
                    onChangeText={hanldeChangeText}
                    secureTextEntry={keyboardType === 'password' && !ShowPassword}
                />
                {keyboardType === 'password' && (
                    <TouchableOpacity onPress={() => setShowPassword(!ShowPassword)}>
                        <Image source={!ShowPassword ? icons.eye : icons.eyeHide} className="h-8 w-8" style={{ tintColor: "4B5563" }} resizeMode='contain' />
                    </TouchableOpacity>
                )}
            </View>
        </View>

    )
}

export default FormField