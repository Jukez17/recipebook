import React, { useState, useCallback } from 'react'
import { View, Text, FlatList, Pressable, Image } from 'react-native'
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { format } from 'date-fns'
import { Card } from '@rneui/themed'
import Toast from 'react-native-toast-message'
import { ref, onValue } from 'firebase/database'
import { auth, db } from '../../firebase/config'
// Style
import Colors from '../../styles/Colors'
import GlobalStyle from '../../styles/Global'
import CardStyle from '../../styles/Cards'

const RecepiesByCategoryScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { category } = route.params
  const [recepies, setRecepies] = useState([])

  const userId = auth.currentUser.uid

  useFocusEffect(
    useCallback(() => {
      const fetchFavoriteRecepies = async () => {
        try {
          onValue(ref(db, `users/${userId}/recepies`), (snapshot) => {
            const data = snapshot.val()
            if (!data) {
              setRecepies([])
            } else {
              const recepies = Object.entries?.(data).map((item) => {
                return { id: item[0], ...item[1] }
              })
              setRecepies(recepies)
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

  const { publicRecipeCard } = CardStyle

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.darkNavy,
      }}
    >
      <FlatList
        data={recepies}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        renderItem={({ item }) => {
          const formattedDate = format(new Date(item.created), 'dd/MM/yyyy')
          return item.category === category ? (
            <Card containerStyle={publicRecipeCard}>
              <Pressable
                key={item.id}
                onPress={() => navigation.navigate('Recipe', { item })}
              >
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flexDirection: 'column', width: '60%' }}>
                    <Image
                      style={{ width: null, height: '100%' }}
                      resizeMode={'cover'}
                      source={{ uri: `${item.image}` }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'column',
                      width: '40%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Card.Title style={{ color: Colors.black }}>
                      {item.recipe}
                    </Card.Title>
                    <Card.Title style={{ color: Colors.black }}>
                      {formattedDate}
                    </Card.Title>
                  </View>
                </View>
              </Pressable>
            </Card>
          ) : null
        }}
        ListEmptyComponent={() => (
          <Text style={{ color: Colors.white, fontSize: 20 }}>
            No recepies available
          </Text>
        )}
      />
    </View>
  )
}

export default RecepiesByCategoryScreen
