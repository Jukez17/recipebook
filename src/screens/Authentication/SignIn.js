import React, {useState, useCallback} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  PermissionsAndroid,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {signInWithEmailAndPassword} from 'firebase/auth';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {signInSuccess, signInError} from '../../components/toasts';
import {auth} from '../../firebase/config';

const SignIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisibility] = React.useState({name: 'eye-off'});

  useFocusEffect(
    useCallback(() => {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      )
    }, [])
  );

  const ToggleVisibilty = () => {
    if (visible.name === 'eye') {
      setVisibility({name: 'eye-off'});
    } else {
      setVisibility({name: 'eye'});
    }
  };

  const secureTextEntry = () => {
    if (visible.name === 'eye') {
      return false;
    } else if (visible.name === 'eye-off') {
      return true;
    }
  };

  const signInUser = () => {
    if (!email && !password) {
      signInError();
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          const user = userCredential.user;
          signInSuccess();
          navigation.navigate('Family recipe book');
        })
        .catch(error => {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Failed to sign in',
            text2: error.message,
          });
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text
          style={{
            fontSize: 40,
            fontFamily: 'QuicksandBold',
            color: '#fff',
          }}>
          Sign in
        </Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.email}
          defaultValue={email}
          onChangeText={text => setEmail(text)}
          textContentType="emailAddress"
          placeholder="Email Address"
          placeholderTextColor="grey"
          returnKeyType="next"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.password}
            defaultValue={password}
            onChangeText={text => setPassword(text)}
            placeholder="Enter Password"
            placeholderTextColor="grey"
            returnKeyType="go"
            secureTextEntry={secureTextEntry()}
            textContentType="password"
            keyboardType="default"
            autoCorrect={false}
          />
          <Ionicons
            name={visible.name}
            size={24}
            color="#1da"
            style={styles.eyeContainer}
            onPress={ToggleVisibilty}
          />
        </View>
        <Pressable
          style={styles.forgotContainer}
          onPress={() => navigation.navigate('Resetpassword')}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={signInUser}>
          <Text style={{fontFamily: 'QuicksandBold', fontSize: 20}}>
            SIGN IN
          </Text>
        </Pressable>
        <Pressable
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            top: '50%',
            height: 30,
          }}
          onPress={() => navigation.navigate('Sign Up')}>
          <Text
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'QuicksandBold',
              fontSize: 16,
              color: 'white',
            }}>
            Do not have an account? Register
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SignIn;

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
});
