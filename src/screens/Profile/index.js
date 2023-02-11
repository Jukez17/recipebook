import React, { useState, useCallback } from 'react'
import { Text, View, Pressable } from 'react-native'
import { Button } from '@rneui/themed'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { ref, onValue } from 'firebase/database'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Toast from 'react-native-toast-message'
import { auth, db } from '../../firebase/config'
// Style
import GlobalStyle from '../../styles/Global'
import CardStyle from '../../styles/Cards'
import Colors from '../../styles/Colors'

const ProfileScreen = () => {
  const navigation = useNavigation()
  const [recepies, setRecepies] = useState([])
  const [favorites, setFavorites] = useState([])

  const userId = auth.currentUser.uid
  const userEmail = auth.currentUser.email

  const totalOfRecepies = recepies.length
  const totalOfFavorites = favorites.length

  useFocusEffect(
    useCallback(() => {
      const fetchFavoriteRecepies = async () => {
        try {
          onValue(ref(db, `users/${userId}/recepies`), (snapshot) => {
            const data = snapshot.val()
            if (!data) {
              setRecepies([])
              setFavorites([])
            } else {
              const recepies = Object.entries?.(data).map((item) => {
                return { id: item[0], ...item[1] }
              })
              setRecepies(recepies)
              setFavorites(recepies.filter((item) => item.favorite === true))
            }
          })
        } catch (e) {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Failed',
            text2: e.message,
          })
        }
      }

      fetchFavoriteRecepies()
    }, [userId])
  )

  const signOutUser = () => {
    auth
      .signOut()
      .then(() => {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Sign out successful',
          text2: 'Redirecting to sign in screen',
        })
        navigation.navigate('Sign In')
      })
      .catch((error) => {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Failed to sign out',
          text2: error.message,
        })
      })
  }

  const { verticalDivider } = GlobalStyle
  const { profileCard, profileRecipeCard } = CardStyle

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.darkNavy,
      }}
    >
      <View style={profileCard}>
        <View style={{ flexDirection: 'column', width: '20%' }}>
          <Ionicons
            style={{ textAlign: 'center' }}
            name='person-circle-outline'
            size={50}
            color={Colors.blue}
          />
        </View>
        <View style={{ flexDirection: 'column', width: '80%' }}>
          <Text
            style={{ color: Colors.black, fontSize: 18, textAlign: 'center' }}
          >
            {userEmail}
          </Text>
        </View>
      </View>
      <View style={profileRecipeCard}>
        <View style={{ flexDirection: 'column', width: '50%' }}>
          <Text
            style={{ color: Colors.black, fontSize: 18, textAlign: 'center' }}
          >
            Recepies
          </Text>
          <Text
            style={{ color: Colors.black, fontSize: 18, textAlign: 'center' }}
          >
            {totalOfRecepies}
          </Text>
        </View>
        <View style={verticalDivider} />
        <View style={{ flexDirection: 'column', width: '50%' }}>
          <Text
            style={{ color: Colors.black, fontSize: 18, textAlign: 'center' }}
          >
            Favorites
          </Text>
          <Text
            style={{ color: Colors.black, fontSize: 18, textAlign: 'center' }}
          >
            {totalOfFavorites}
          </Text>
        </View>
      </View>
      <Pressable
        style={{
          backgroundColor: Colors.jacarta,
          borderRadius: 30,
          position: 'absolute',
          bottom: 30,
          width: '60%',
          height: 40,
        }}
        onPress={signOutUser}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{ color: Colors.white, fontSize: 20, textAlign: 'center' }}
          >
            Sign out
          </Text>
        </View>
      </Pressable>
    </View>
  )
}

export default ProfileScreen
