// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
  import {getFirestore}  from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCQCZeMBO8Wb3gztjosmti8wa5Zze_4OjE',
  authDomain: 'rentease-80da4.firebaseapp.com',
  projectId: 'rentease-80da4',
  storageBucket: 'rentease-80da4.appspot.com',
  messagingSenderId: '660477299858',
  appId: '1:660477299858:web:9c3c69d5a7610efff52a4b',
};

// Initialize Firebase
 initializeApp(firebaseConfig);

 export const db = getFirestore();