// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Importamos el servicio de autenticación y Firestore
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  // Importamos Firestore

const firebaseConfig = {
    apiKey: "AIzaSyCF5htjtX4XabrP-Sxyl4pHHrAdylVDZqU",
    authDomain: "app-products-kodigo.firebaseapp.com",
    projectId: "app-products-kodigo",
    storageBucket: "app-products-kodigo.firebasestorage.app",
    messagingSenderId: "313148869365",
    appId: "1:313148869365:web:82f58984ecb2a6d9c3d3bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicializamos Firestore y la autenticación
const db = getFirestore(app);  // Instancia de Firestore
const auth_user = getAuth(app);
const providerGoogle = new GoogleAuthProvider();

// Exportamos `db` junto con los otros servicios
export { db, auth_user, providerGoogle };
