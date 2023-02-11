import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { sendPasswordResetEmail } from 'firebase/auth'
import Toast from 'react-native-toast-message'
import { resetPassSuccess } from '../../components/toasts'
import { auth } from '../../firebase/config'

const Forgotpassword = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState('')

  const resetPasswordRequest = () => {
    sendPasswordResetEmail(auth, email)
    .then(() => {
      resetPassSuccess()
      navigation.goBack()
    })
    .catch((error) => {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed',
        text2: error.message
    })
    });
  
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>

      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.email}
          defaultValue={email}
          onChangeText={(text) => setEmail(text)}
          textContentType='emailAddress'
          placeholder='Email Address'
          placeholderTextColor='grey'
          returnKeyType='next'
        />
        <Pressable style={styles.button} onPress={resetPasswordRequest}>
          <Text style={{ fontFamily: 'QuicksandBold', fontSize: 20 }}>
            Reset password
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Forgotpassword

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#0C0C1C',
  },
  headerContainer: {
    flexDirection: 'row',
    width: '80%',
    height: 50,
    marginBottom: 40,
    top: -20,
  },
  form: {
    width: '80%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    top: -40,
  },
  email: {
    width: '100%',
    height: 60,
    backgroundColor: '#0ff1',
    borderRadius: 5,
    marginBottom: 35,
    padding: 10,
    fontSize: 18,
    fontFamily: 'QuicksandBold',
    color: '#fff',
  },
  password: {
    width: '85%',
    height: 60,
    borderRadius: 5,
    marginBottom: 35,
    padding: 10,
    fontSize: 18,
    fontFamily: 'QuicksandBold',
    color: '#fff',
  },

  passwordContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    backgroundColor: '#0ff1',
    borderRadius: 5,
    marginBottom: 35,
  },
  eyeContainer: {
    position: 'absolute',
    right: 10,
    top: 20,
  },

  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1da',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    top: 30,
    padding: 10,
  },

  forgot: {
    fontFamily: 'QuicksandBold',
    color: '#fff',
    fontSize: 18,
  },

  forgotContainer: {
    top: -20,
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
})
