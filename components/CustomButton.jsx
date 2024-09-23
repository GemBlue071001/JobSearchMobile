import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

const CustomButton = ({ tittle, handlePress, containerStyles, textStyles, isLoading }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={` justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading}
        >
            <Text className={`font-psemibold text-lg text-primary ${textStyles}`}>{tittle}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton