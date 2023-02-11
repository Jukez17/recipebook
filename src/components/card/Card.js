import React from 'react'
import { View } from 'react-native'

const Card = ({ style, onPress, children }) => {
    return (
        <View style={style}>
            {children}
        </View>
    )
}