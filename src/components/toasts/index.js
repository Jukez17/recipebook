import Toast from 'react-native-toast-message'
// Sign in
export const signInSuccess = () => {
    Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Succesfull',
        text2: 'Sign in was succesfull'
    })
}

export const signInError = () => {
    Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed',
        text2: 'Invalid credentials'
    })
}
// Sign up
export const signUpSuccess = () => {
    Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Succesfull',
        text2: 'Sign up was succesfull'
    })
}
// Forgotpassword
export const resetPassSuccess = () => {
    Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Succesfull',
        text2: 'Check your email for resetting your password'
    })
}

export const signUpError = () => {
    Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed',
        text2: 'Invalid credentials'
    })
}

// Recepies

export const recipeAdded = () => {
    Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Success',
        text2: 'Recipe was added successfully'
    })
}