import React, { useState, useCallback } from 'react'
import { View, Text, FlatList, Pressable, Image } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { format } from 'date-fns'
import { Button, Card } from '@rneui/themed'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Toast from 'react-native-toast-message'
import { ref, onValue } from 'firebase/database'
import { auth, db } from '../../firebase/config'
// Style
import Colors from '../../styles/Colors'
import GlobalStyle from '../../styles/Global'
import CardStyle from '../../styles/Cards'

const RecepiesScreen = () => {
  const navigation = useNavigation()
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

  const { form, pressableCard, title } = GlobalStyle
  const { publicRecipeCard } = CardStyle

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.darkNavy,
      }}
    >
      <View style={{ flex: 4 }}>
        <FlatList
          data={recepies}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          renderItem={({ item }) => {
            const formattedDate = format(new Date(item.created), 'dd/MM/yyyy')
            return (
              <Card containerStyle={publicRecipeCard}>
                <Pressable
                  key={item.id}
                  onPress={() => navigation.navigate('Public recipe', { item })}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'column', width: '60%', height: '100%' }}>
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
            )
          }}
          ListEmptyComponent={() => (
            <Text style={{ color: Colors.white, fontSize: 20 }}>
              No recepies available
            </Text>
          )}
        />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Pressable
          style={{
            backgroundColor: Colors.jacarta,
            borderRadius: 30,
            position: 'absolute',
            bottom: 20,
            width: '60%',
          }}
          onPress={() => navigation.navigate('Add recipe')}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: Colors.white, fontSize: 20 }}>
              Add recipe
            </Text>
            <Ionicons name='add-outline' size={35} color='white' />
          </View>
        </Pressable>
      </View>
    </View>
  )
}

export default RecepiesScreen
