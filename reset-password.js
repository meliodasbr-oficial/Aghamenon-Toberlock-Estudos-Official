import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDr27BIHswRcTvvE5lUpR-l4OMGwGFQQaw",
    authDomain: "meliodaslogin-bae06.firebaseapp.com",
    projectId: "meliodaslogin-bae06",
    storageBucket: "meliodaslogin-bae06.appspot.com",
    messagingSenderId: "292569281051",
    appId: "1:292569281051:web:473895afda6419bc747ebe",
    measurementId: "G-3N0G8EFNMV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

document.getElementById('reset-password-button').addEventListener('click', () => {
    const email = document.getElementById('email-reset').value;

    if (email) {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                showNotification('E-mail de redefinição de senha enviado com sucesso!');
                setTimeout(() => {
                    window.location.href = 'index.html'; // Redireciona para a página de login
                }, 3000);
            })
            .catch((error) => {
                console.error('Erro ao enviar e-mail de redefinição de senha:', error);
                showNotification('Ocorreu um erro ao enviar o e-mail de redefinição de senha. Verifique o e-mail e tente novamente.');
            });
    } else {
        showNotification('Por favor, forneça um e-mail válido.');
    }
});
