import { StyleSheet } from 'react-native'
import Colors from './Colors'

const GlobalStyle = StyleSheet.create({
  // Containers
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    borderRadius: 5,
    marginBottom: 35,
  },
  recipeSection: {
    marginTop: 30,
    width: '100%'
  },
  // Dividers
  verticalDivider: {
    height: '100%', 
    width: 2, 
    backgroundColor: Colors.black
  },
  // Icons
  iconContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  heartIcon: {
    right: 10,
    top: 10,
  },
  // Forms
  form: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    top: 20,
  },
  // Inputs
  textInput: {
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
  textMultiInput: {
    width: '100%',
    backgroundColor: '#0ff1',
    borderRadius: 5,
    marginBottom: 35,
    padding: 10,
    fontSize: 18,
    fontFamily: 'QuicksandBold',
    color: '#fff',
  },
  // Cards
  pressableCard: {
    
    width: 180, 
    height: 150,
    borderRadius: 8,
    justifyContent: 'center',
  },
  // Texts
  title: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
  },
})

export default GlobalStyle
