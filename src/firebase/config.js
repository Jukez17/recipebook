import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'

export const firebaseConfig = {
  apiKey: "AIzaSyCKmtAnJTzSLs7QoMLZ523rplwYvkaxNNk",
  authDomain: "recipebook-99cae.firebaseapp.com",
  databaseURL: "https://recipebook-99cae-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "recipebook-99cae",
  storageBucket: "recipebook-99cae.appspot.com",
  messagingSenderId: "74412055560",
  appId: "1:74412055560:web:959f6ff45faf90f242c5bd",
  measurementId: "G-X2HBJCH9EH"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getDatabase(app)
export const storage = getStorage(app)