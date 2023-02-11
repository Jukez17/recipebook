import React from 'react'
import { Text, View, Image, Pressable } from 'react-native'
import { useRoute } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { ref, update } from 'firebase/database'
import { format } from 'date-fns'
import { db, auth } from '../../firebase/config'
// Style
import GlobalStyle from '../../styles/Global'
import Colors from '../../styles/Colors'

const PublicRecipeScreen = () => {
  const route = useRoute()
  const { item } = route.params
  const formattedDate = format(new Date(item.created), 'dd/MM/yyyy')
  const userId = auth.currentUser.uid

  const markOrRemoveFavorite = () => {
    const recipeRef = ref(db, 'users/' + userId + '/recepies' + `/${item.id}`)
    const recipeData = {
      favorite: item.favorite ? false : true,
    }

    update(recipeRef, recipeData).then(() => {
      if (item.favorite === false) {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Recipe',
          text2: `Recipe ${item.recipe} was added to favorites`,
        })
      } else {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Recipe',
          text2: `Recipe ${item.recipe} was removed from favorites`,
        })
      }
    })
  }

  const { recipeSection } = GlobalStyle

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.darkNavy,
      }}
    >
      <View
        style={{
          backgroundColor: Colors.white,
          width: '90%',
          height: 'auto',
          borderRadius: 10,
          padding: 15,
          marginTop: 10,
          marginBottom: 10
        }}
      >
        <View style={recipeSection}>
          <Text
            style={{ color: Colors.black, fontSize: 20, textAlign: 'center' }}
          >
            {item.recipe}
          </Text>
          <Text
            style={{ color: Colors.black, fontSize: 16, textAlign: 'center' }}
          >
            {formattedDate}
          </Text>
        </View>
        {item.image ? (
          <View style={recipeSection}>
            <Image
              style={{ width: '100%', height: 200 }}
              resizeMode={'contain'}
              source={{ uri: `${item.image}` }}
            />
          </View>
        ) : null}
        <View style={recipeSection}>
          <Text
            style={{
              color: Colors.black,
              fontSize: 20,
              textAlign: 'left',
              marginBottom: 10,
            }}
          >
            List of ingredients
          </Text>
          {item.ingredients.map((ingredient) => {
            return (
              <Text
                key={ingredient.ingredient}
                style={{
                  color: Colors.black,
                  fontSize: 16,
                  textAlign: 'left',
                }}
              >
                {ingredient.ingredient}
              </Text>
            )
          })}
        </View>
        <View style={recipeSection}>
          <Text
            style={{
              color: Colors.black,
              fontSize: 20,
              textAlign: 'left',
              marginBottom: 10,
            }}
          >
            Steps
          </Text>
          <Text
            style={{ color: Colors.black, fontSize: 16, textAlign: 'left' }}
          >
            {item.steps}
          </Text>
        </View>
        <View style={recipeSection}>
          <Text
            style={{
              color: Colors.black,
              fontSize: 20,
              textAlign: 'left',
              marginBottom: 10,
            }}
          >
            Tips
          </Text>
          <Text
            style={{ color: Colors.black, fontSize: 16, textAlign: 'left' }}
          >
            {item.tips === '' ? 'No tips available' : item.tips}
          </Text>
        </View>
        <View style={recipeSection}>
          <Pressable onPress={markOrRemoveFavorite}>
            <Text style={{ color: Colors.black, textAlign: 'center' }}>
              {item.favorite ? 'Remove from favorite' : 'Mark as favorite'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default PublicRecipeScreen
