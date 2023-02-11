import React from 'react'
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import Navigation from '../navigation/Navigation'

const App = () => {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Navigation />
      <Toast />
    </SafeAreaProvider>
  )
}

export default App