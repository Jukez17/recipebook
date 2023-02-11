import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
// Screens
import HomeScreen from '../screens/Home'
import RecipeScreen from '../screens/Recepies/Recipe'
import RecepiesByCategoryScreen from '../screens/Recepies/RecepiesByCategory'
import RecepiesScreen from '../screens/Recepies'
import PublicRecipeScreen from '../screens/Recepies/PublicRecipe'
import AddRecipeScreen from '../screens/Recepies/AddRecipe'
import ProfileScreen from '../screens/Profile'
// Style
import Colors from '../styles/Colors'

const Home = createNativeStackNavigator()

const HomeStack = () => {
  return (
    <Home.Navigator
      screenOptions={() => {
        return {
          animationEnabled: false,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: Colors.darkNavy,
          },
          headerTitleStyle: {
            color: Colors.white,
          },
          headerTitleAlign: 'center',
          headerTintColor: Colors.white,
        }
      }}
    >
      <Home.Screen
        name='Homescreen'
        component={HomeScreen}
        options={{ headerShown: false, headerTitle: '' }}
      />
      <Home.Screen name='Recipe' component={RecipeScreen} />
      <Home.Screen name='Recepies by category' component={RecepiesByCategoryScreen} options={{ headerTitle: ''}} />
    </Home.Navigator>
  )
}

const Recepies = createNativeStackNavigator()

const RecepiesStack = () => {
  return (
    <Recepies.Navigator>
      <Recepies.Screen
        name='All Recepies'
        component={RecepiesScreen}
        options={{
          headerTransparent: false,
          headerStyle: {
            backgroundColor: Colors.darkNavy,
          },
          headerTitleStyle: {
            color: Colors.white,
          },
          headerTitleAlign: 'center',
          headerTintColor: Colors.white,
        }}
      />
      <Recepies.Screen
        name='Public recipe'
        component={PublicRecipeScreen}
        options={{
          headerTransparent: false,
          headerStyle: {
            backgroundColor: Colors.darkNavy,
          },
          headerTitleStyle: {
            color: Colors.white,
          },
          headerTitleAlign: 'center',
          headerTintColor: Colors.white,
        }}
      />
      <Recepies.Screen
        name='Add recipe'
        component={AddRecipeScreen}
        options={{
          headerTransparent: false,
          headerStyle: {
            backgroundColor: Colors.darkNavy,
          },
          headerTitleStyle: {
            color: Colors.white,
          },
          headerTitleAlign: 'center',
          headerTintColor: Colors.white,
        }}
      />
    </Recepies.Navigator>
  )
}

const Tab = createBottomTabNavigator()

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'Home') {
            iconName = focused ? 'md-home' : 'md-home-outline'
          } else if (route.name === 'Recipes') {
            iconName = focused ? 'md-book' : 'md-book-outline'
          } else if (route.name === 'Profile') {
            iconName = focused ? 'md-person' : 'md-person-outline'
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarStyle: {
          backgroundColor: Colors.light_jacarta,
          borderTopColor: Colors.jacarta,
          borderTopWidth: 4,
          height: 70
        },
        tabBarActiveBackgroundColor: Colors.light_jacarta_001,
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.white,
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
          bottom: 7
        },
        headerShown: false,
        headerTransparent: true,
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen name='Home' component={HomeStack} options={{headerTitle: ''}} />
      <Tab.Screen name='Recipes' component={RecepiesStack} />
      <Tab.Screen name='Profile' component={ProfileScreen} />
    </Tab.Navigator>
  )
}

const Root = createNativeStackNavigator()

const RootStack = () => {
  return (
    <Root.Navigator
      screenOptions={() => {
        return {
          headerTitleAlign: 'center',
        }
      }}
    >
      <Recepies.Screen
        name='Family recipe book'
        component={BottomTabs}
        options={() => {
          return {
            headerShown: false,
          }
        }}
      />
    </Root.Navigator>
  )
}

export default RootStack
