// scripts/firebaseConfig.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDr27BIHswRcTvvE5lUpR-l4OMGwGFQQaw",
    authDomain: "meliodaslogin-bae06.firebaseapp.com",
    projectId: "meliodaslogin-bae06",
    storageBucket: "meliodaslogin-bae06.appspot.com",
    messagingSenderId: "292569281051",
    appId: "1:292569281051:web:473895afda6419bc747ebe",
    measurementId: "G-3N0G8EFNMV"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
