import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDr27BIHswRcTvvE5lUpR-l4OMGwGFQQaw",
    authDomain: "meliodaslogin-bae06.firebaseapp.com",
    projectId: "meliodaslogin-bae06",
    storageBucket: "meliodaslogin-bae06.appspot.com",
    messagingSenderId: "292569281051",
    appId: "1:292569281051:web:473895afda6419bc747ebe",
    measurementId: "G-3N0G8EFNMV"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById('auth-menu-item').style.display = 'none';
            document.getElementById('profile-menu-item').style.display = 'block';
            document.getElementById('logout-menu-item').style.display = 'block';
        } else {
            document.getElementById('auth-menu-item').style.display = 'block';
            document.getElementById('profile-menu-item').style.display = 'none';
            document.getElementById('logout-menu-item').style.display = 'none';
        }
    });

    document.getElementById('logout-button').addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = 'auth.html'; // Redireciona para a página de login após logout
            }).catch((error) => {
            console.error('Erro ao sair:', error);
            });
    });