import React, { useEffect, useState } from 'react'
import {
  View,
  TextInput,
  Image,
  Platform,
  ScrollView,
  Pressable,
  Text,
} from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Toast from 'react-native-toast-message'
import { push, ref, serverTimestamp } from 'firebase/database'
import {
  uploadBytesResumable,
  getDownloadURL,
  ref as storageRef,
} from 'firebase/storage'
import { auth, db, storage } from '../../firebase/config'
import { recipeAdded } from '../../components/toasts'
// Style
import Colors from '../../styles/Colors'
import GlobalStyle from '../../styles/Global'

const AddRecipeScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [uploadURI, setUploadURI] = useState('')
  const [imageName, setImageName] = useState('')
  const [recipeImage, setRecipeImage] = useState('')
  const [recipe, setRecipe] = useState('')
  const [ingredient, setIngredient] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [recipeSteps, setRecipeSteps] = useState('')
  const [tip, setTip] = useState('')
  const [category, setCategory] = useState('')
  const [multilineHeight, setMultilineHeight] = useState(60)

  const userId = auth.currentUser.uid
  const userEmail = auth.currentUser.email

  console.log('image: ', selectedImage)
  console.log('imageURI: ', uploadURI)
  console.log('imageName: ', imageName)

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

  const addIngredient = () => {
    if (!ingredient) {
      return
    } else {
      setIngredients((ingredients) => [
        ...ingredients,
        {
          id: ingredients.length,
          ingredient: ingredient,
        },
      ])
      setIngredient('')
    }
  }

  const addRecipe = () => {
    const createdDate = serverTimestamp()
    try {
      if (!recipe) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Failed',
          text2: 'Cannot send empty recipe',
        })
      } else {
        push(ref(db, 'users/' + userId + '/recepies'), {
          author: userEmail,
          created: createdDate,
          recipe: recipe,
          ingredients: ingredients,
          steps: recipeSteps,
          tips: tip,
          category: category,
          favorite: false,
          image: recipeImage,
        })
        recipeAdded()
        setRecipe('')
        setIngredients([])
        setRecipeSteps('')
        setTip('')
        setCategory('')
        setRecipeImage('')
      }
    } catch (e) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed',
        text2: e.message,
      })
    }
  }

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter((item) => item.ingredient !== ingredient))
  }

  const { inputContainer, iconContainer, form, textInput, textMultiInput } = GlobalStyle

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: Colors.darkNavy,
      }}
    >
      <View style={[form, { flex: 2 }]}>
        <TextInput
          style={textInput}
          defaultValue={recipe}
          onChangeText={(text) => setRecipe(text)}
          textContentType='name'
          placeholder='Name of the recipe'
          placeholderTextColor='grey'
          returnKeyType='next'
        />
        <View style={inputContainer}>
          <TextInput
            style={textInput}
            defaultValue={ingredient}
            onChangeText={(text) => setIngredient(text)}
            textContentType='name'
            placeholder='Ingredients'
            placeholderTextColor='grey'
            returnKeyType='next'
          />
          <Ionicons
            style={iconContainer}
            name='add-circle-outline'
            size={40}
            color={Colors.white}
            onPress={addIngredient}
          />
        </View>
        {ingredients.length > 0 ? (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginTop: -30,
              marginBottom: 5,
            }}
          >
            {ingredients.map((item) => {
              return (
                <Pressable
                  style={{
                    backgroundColor: Colors.white,
                    borderRadius: 20,
                    padding: 5,
                    marginRight: 10,
                    marginBottom: 15,
                    width: 'auto',
                    height: 30,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 16,
                        fontWeight: '800',
                      }}
                    >
                      {item.ingredient}
                    </Text>
                    <Ionicons
                      name='close'
                      size={24}
                      color={Colors.red}
                      onPress={() => removeIngredient(item.ingredient)}
                    />
                  </View>
                </Pressable>
              )
            })}
          </View>
        ) : null}
        <TextInput
          style={[textMultiInput, { height: multilineHeight }]}
          defaultValue={recipeSteps}
          multiline={true}
          onContentSizeChange={e => setMultilineHeight(e.nativeEvent.contentSize.height)}
          onChangeText={(text) => setRecipeSteps(text)}
          placeholder='Steps'
          placeholderTextColor='grey'
          returnKeyType='next'
        />
        <TextInput
          style={textInput}
          defaultValue={tip}
          multiline={true}
          onChangeText={(text) => setTip(text)}
          placeholder='Tips'
          placeholderTextColor='grey'
          returnKeyType='next'
        />
        <TextInput
          style={textInput}
          defaultValue={category}
          onChangeText={(text) => setCategory(text)}
          textContentType='name'
          placeholder='Category'
          placeholderTextColor='grey'
          returnKeyType='next'
        />
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
        <Image
            style={{ width: 80, height: 80 }}
            resizeMode={'contain'}
            source={{ uri: `${selectedImage}` }}
          />
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
        <Pressable
            style={{
              backgroundColor: Colors.jacarta,
              borderRadius: 30,
              width: '40%',
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
              borderRadius: 50,
              width: 60,
              height: 60
            }}
            onPress={addRecipe}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name='add-outline' size={35} color='white' />
            </View>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: Colors.jacarta,
              borderRadius: 30,
              width: '40%',
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
    </ScrollView>
  )
}

export default AddRecipeScreen
