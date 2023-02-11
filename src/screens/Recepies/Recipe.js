import React, { useState, useEffect } from 'react'
import {
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native'
import {
  uploadBytesResumable,
  getDownloadURL,
  ref as storageRef,
} from 'firebase/storage'
import { ref, update } from 'firebase/database'
import { useRoute } from '@react-navigation/native'
import { format } from 'date-fns'
import { launchImageLibrary } from 'react-native-image-picker'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { db, auth, storage } from '../../firebase/config'
// Style
import GlobalStyle from '../../styles/Global'
import Colors from '../../styles/Colors'

const RecipeScreen = () => {
  const route = useRoute()
  const { item } = route.params
  //const [favorited, setFavorited] = useState(item.favorite)
  const [editing, setEditing] = useState(false)
  const [recipeName, setRecipeName] = useState(item.recipe)
  const [selectedImage, setSelectedImage] = useState(null)
  const [uploadURI, setUploadURI] = useState(item.uri)
  const [imageName, setImageName] = useState('')
  const [recipeImage, setRecipeImage] = useState('')
  const [recipeSteps, setRecipeSteps] = useState(item.steps)
  const [tip, setTip] = useState(item.tips)
  const [multilineHeight, setMultilineHeight] = useState(60)
  const formattedDate = format(new Date(item.created), 'dd/MM/yyyy')
  const userId = auth.currentUser.uid

  const selectImage = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }

    launchImageLibrary(options, (response) => {
      console.log('Response = ', response)

      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else {
        const uri = response.assets.map(({ uri }) => uri)
        const filename = response.assets.map(({ fileName }) => fileName)
        setSelectedImage(uri.toString())
        setImageName(filename.toString())
      }
    })
  }

  useEffect(() => {
    const uri =
      Platform.OS === 'ios'
        ? selectedImage.replace('file://', '')
        : selectedImage

    setUploadURI(uri)
  })

  const uploadImage = async () => {
    const metadata = {
      contentType: 'image/jpeg',
    }

    // Upload file and metadata to the object 'images/image.jpg'
    const imageRef = storageRef(storage, 'images/' + imageName)
    const image = await fetch(uploadURI)
    const bytes = await image.blob()
    const uploadTask = uploadBytesResumable(imageRef, bytes, metadata)

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused')
            break
          case 'running':
            console.log('Upload is running')
            break
        }
      },
      (error) => {
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break
          case 'storage/canceled':
            // User canceled the upload
            break
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at ', downloadURL)
          setRecipeImage(downloadURL)
        })
      }
    )
  }

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

  const { recipeSection, textInput, textMultiInput } = GlobalStyle

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.darkNavy,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          //backgroundColor: Colors.white,
          width: '100%',
          height: 10,
          borderRadius: 10,
          padding: 15,
          marginBottom: 20,
        }}
      >
        <View style={{ marginTop: 5 }}>
          <Ionicons
            style={{ alignSelf: 'flex-end' }}
            name={'create-outline'}
            size={30}
            color={editing == true ? Colors.lightNavy : Colors.white}
            onPress={() => setEditing((editing) => !editing)}
          />
          {editing == true ? (
            <TextInput
              style={textInput}
              defaultValue={recipeName}
              onChangeText={(text) => setRecipeName(text)}
              textContentType='name'
              placeholder='Name of the recipe'
              placeholderTextColor='grey'
              returnKeyType='next'
            />
          ) : (
            <Text
              style={{ color: Colors.white, fontSize: 20, textAlign: 'center' }}
            >
              {item.recipe}
            </Text>
          )}
          <Text
            style={{ color: Colors.white, fontSize: 16, textAlign: 'center' }}
          >
            {formattedDate}
          </Text>
        </View>
        {editing == true ? (
          <View style={recipeSection}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}
            >
              <View style={{flexDirection: 'column', width: '50%'}}>
                <Image
                  style={{ width: '100%', height: 200 }}
                  resizeMode={'contain'}
                  source={{ uri: selectedImage == null ? `${item.image}` : `${selectedImage}` }}
                />
              </View>
              <View style={{flexDirection: 'column', justifyContent: 'space-evenly', width: '50%'}}>
                <Pressable
                  style={{
                    backgroundColor: Colors.jacarta,
                    borderRadius: 30,
                    width: '100%',
                    marginBottom: 10
                  }}
                  onPress={() => selectImage()}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: Colors.white, fontSize: 20 }}>
                      Select
                    </Text>
                    <Ionicons name='image-outline' size={35} color='white' />
                  </View>
                </Pressable>
                <Pressable
                  style={{
                    backgroundColor: Colors.jacarta,
                    borderRadius: 30,
                    width: '100%',
                  }}
                  onPress={() => uploadImage()}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: Colors.white, fontSize: 20 }}>
                      Upload
                    </Text>
                    <Ionicons name='image-outline' size={35} color='white' />
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        ) : item.image ? (
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
              color: Colors.white,
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
                  color: Colors.white,
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
              color: Colors.white,
              fontSize: 20,
              textAlign: 'left',
              marginBottom: 10,
            }}
          >
            Steps
          </Text>
          {editing == true ? (
            <TextInput
              style={[textMultiInput, { height: multilineHeight }]}
              defaultValue={recipeSteps}
              multiline={true}
              onContentSizeChange={(e) =>
                setMultilineHeight(e.nativeEvent.contentSize.height)
              }
              onChangeText={(text) => setRecipeSteps(text)}
              placeholder='Steps'
              placeholderTextColor='grey'
              returnKeyType='next'
            />
          ) : (
            <Text
              style={{ color: Colors.white, fontSize: 16, textAlign: 'left' }}
            >
              {item.steps}
            </Text>
          )}
        </View>
        <View style={recipeSection}>
          <Text
            style={{
              color: Colors.white,
              fontSize: 20,
              textAlign: 'left',
              marginBottom: 10,
            }}
          >
            Tips
          </Text>
          {editing == true ? (
            <TextInput
              style={textInput}
              defaultValue={tip}
              multiline={true}
              onChangeText={(text) => setTip(text)}
              placeholder='Tips'
              placeholderTextColor='grey'
              returnKeyType='next'
            />
          ) : (
            <Text
              style={{ color: Colors.white, fontSize: 16, textAlign: 'left' }}
            >
              {item.tips === '' ? 'No tips available' : item.tips}
            </Text>
          )}
        </View>
        <View style={[recipeSection, { marginBottom: 20 }]}>
          <Pressable onPress={markOrRemoveFavorite}>
            <Text
              style={{
                color: Colors.white,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {item.favorite ? 'Remove from favorite' : 'Mark as favorite'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}

export default RecipeScreen
