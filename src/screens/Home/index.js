import React, { useState, useCallback } from 'react'
import { Text, View, FlatList, Image, Pressable } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Toast from 'react-native-toast-message'
import { ref, onValue, orderByChild } from 'firebase/database'
import { db, auth } from '../../firebase/config'
import recipeCategories from '../../data/Categories'
// Style
import Colors from '../../styles/Colors'
import GlobalStyle from '../../styles/Global'
import CardStyle from '../../styles/Cards'

const HomeScreen = () => {
  const navigation = useNavigation()
  const [favoriteRecepies, setFavoriteRecepies] = useState([])
  const [categories] = useState(recipeCategories)
  const userId = auth.currentUser.uid

  useFocusEffect(
    useCallback(() => {
      const fetchFavoriteRecepies = async () => {
        try {
          onValue(ref(db, `users/${userId}/recepies`), (snapshot) => {
            const data = snapshot.val()
            if (!data) {
              setFavoriteRecepies([])
            } else {
              const favorites = Object.entries?.(data).map((item) => {
                return { id: item[0], ...item[1] }
              })
              setFavoriteRecepies(favorites)
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

  console.log('recepies: ', favoriteRecepies)

  const { title, heartIcon } = GlobalStyle
  const { favoriteRecipeCard, categoryCard } = CardStyle

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.darkNavy,
      }}
    >
      <View style={{ flex: 2 }}>
        <Text style={title}>Favorite recepies</Text>
        <FlatList
          data={favoriteRecepies}
          horizontal={true}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          renderItem={({ item }) => {
            return item.favorite === true ? (
              <Pressable
                style={favoriteRecipeCard}
                key={item.id}
                onPress={() => navigation.navigate('Recipe', { item })}
              >
                <View style={{ flex: 1, width: '100%' }}>
                  <View style={{ flex: 2 }}>
                    <Image
                      style={{ width: null, height: '100%' }}
                      resizeMode={'cover'}
                      source={{ uri: `${item.image}` }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}
                    >
                      {item.recipe}
                    </Text>
                    <Ionicons
                      name={item.favorite ? 'heart' : 'heart-outline'}
                      size={20}
                      color={Colors.red}
                    />
                  </View>
                </View>
              </Pressable>
            ) : null
          }}
          ListEmptyComponent={() => (
            <Text style={{ color: Colors.white, fontSize: 20 }}>
              No favorite recepies
            </Text>
          )}
        />
      </View>
      <View style={{ flex: 2 }}>
        <Text style={title}>Categories</Text>
        <FlatList
          data={categories}
          horizontal={true}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          renderItem={({ item }) => {
            return (
              <Pressable
                style={categoryCard}
                key={item.id}
                onPress={() =>
                  navigation.navigate('Recepies by category', {
                    category: item.category,
                  })
                }
              >
                <View style={{ flex: 1, width: '100%' }}>
                  <View style={{ flex: 2 }}>
                    <Image
                      style={{ width: null, height: '100%' }}
                      resizeMode={'cover'}
                      source={{ uri: `${item.image}` }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}
                    >
                      {item.category}
                    </Text>
                  </View>
                </View>
              </Pressable>
            )
          }}
          ListEmptyComponent={() => (
            <Text style={{ color: Colors.white, fontSize: 20 }}>
              Categories not found
            </Text>
          )}
        />
      </View>
    </View>
  )
}

export default HomeScreen
