import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'
// Stack
//import HomeStack from './stacks/HomeStack'
import RootStack from './NavigationContainer'
import AuthStack from './stacks/AuthStack'
// Components
import Loading from '../components/loading'

const Navigation = () => {
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)
  const [initializing, setInitializing] = useState(true)

  const authChanged = onAuthStateChanged(auth, (user) => {
    setUser(user)
    if (initializing) setInitializing(false)
    setLoading(false)
  })

  useEffect(() => {
    const subscriber = authChanged
    return subscriber
  }, [])

  if (loading) {
    return <Loading />
  }

  const User = auth.currentUser

  return (
    <NavigationContainer>
      {User ? <RootStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default Navigation
