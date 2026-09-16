// These values identify the Firebase project — they are not secret.
// Access control lives in Firestore's security rules, not in hiding this config.
const firebaseConfig = {
  apiKey: "AIzaSyAfCkuu_R0qrYa_45WdeS4ucMtCr9SLJTM",
  authDomain: "linda-and-joshua.firebaseapp.com",
  projectId: "linda-and-joshua",
  storageBucket: "linda-and-joshua.firebasestorage.app",
  messagingSenderId: "533154981488",
  appId: "1:533154981488:web:97aa2f4ab6d22da41236b5"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
