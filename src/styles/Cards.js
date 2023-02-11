import { StyleSheet, Dimensions } from "react-native"
import Colors from "./Colors"

const width = Dimensions.get('screen').width

const CardStyle = StyleSheet.create({
    favoriteRecipeCard: {
        backgroundColor: Colors.white,
        width: 200, 
        maxHeight: 200,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20
    },
    categoryCard: {
        backgroundColor: Colors.white,
        width: 200, 
        maxHeight: 200,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20
    },
    publicRecipeCard: {
        width: width - 25, 
        maxHeight: 150,
        borderRadius: 8,
        marginBottom: 10
    },
    profileCard: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        width: width - 25, 
        maxHeight: 150,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    profileRecipeCard: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        width: width - 25, 
        maxHeight: 150,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
})

export default CardStyle