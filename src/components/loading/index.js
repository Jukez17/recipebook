import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
// colors
import Colors from '../../styles/Colors'

const Loading = () => {
  const { loadingContainer } = styles

  return (
    <View style={loadingContainer}>
      <ActivityIndicator size='large' color={Colors.white} />
    </View>
  )
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.darkNavy,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default Loading
