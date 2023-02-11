import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
// screens
import SignIn from '../../screens/Authentication/SignIn'
import SignUp from '../../screens/Authentication/SignUp'
import Forgotpassword from '../../screens/Authentication/Forgotpassword'
// colors
import Colors from '../../styles/Colors'

const Auth = createNativeStackNavigator()

const AuthStack = () => {
  return (
    <Auth.Navigator>
      <Auth.Screen
        name='Sign In'
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Auth.Screen
        name='Sign Up'
        component={SignUp}
        options={{ headerTransparent: true, headerTintColor: Colors.white }}
      />
      <Auth.Screen
        name='Resetpassword'
        component={Forgotpassword}
        options={{ headerTransparent: true, headerTintColor: Colors.white }}
      />
    </Auth.Navigator>
  )
}

export default AuthStack
