// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Your Firebase project configuration
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
const db = getFirestore(app);
const auth = getAuth(app);

// DOM Elements
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');
const chatBox = document.getElementById('chat-box');

// Profanity Filter (Simple Example)
const bannedWords = ['cu', 'Filha da Puta', 'Cacete', 'fdp', '']; // Adicione os palavrões que você deseja proibir

// Function to check for banned words
function hasBannedWords(message) {
    return bannedWords.some(word => message.toLowerCase().includes(word));
}

// Function to get user GameTag
async function getUserGameTag(userId) {
    try {
        const userDoc = doc(db, 'users', userId);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
            return userSnap.data().gameTag; // Ajuste o campo conforme o nome do seu campo no Firestore
        } else {
            console.error("Usuário não encontrado!");
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar GameTag: ", error);
        return null;
    }
}

// Function to send a message
async function sendMessage(user) {
    const message = messageInput.value.trim();

    if (message === '') return; // Prevent sending empty messages

    if (hasBannedWords(message)) {
        alert("Sua mensagem contém palavras proibidas.");
        return;
    }

    try {
        const gameTag = await getUserGameTag(user.uid);

        if (gameTag) {
            // Add the message to Firestore
            await addDoc(collection(db, 'messages'), {
                sender: gameTag, // Use GameTag instead of email
                message: message,
                timestamp: serverTimestamp() // Store the server timestamp
            });

            messageInput.value = ''; // Clear the input field
        }
    } catch (error) {
        console.error("Erro ao enviar mensagem: ", error);
    }
}

// Listen for new messages
function loadMessages() {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    onSnapshot(q, (snapshot) => {
        chatBox.innerHTML = ''; // Clear the chat box
        snapshot.forEach((doc) => {
            const data = doc.data();
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.innerHTML = `
                <span>${data.sender}: ${data.message}</span>
                <span class="time">${new Date(data.timestamp?.toDate()).toLocaleTimeString('pt-BR')}</span>
            `;
            chatBox.appendChild(messageElement);
        });
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    });
}

// Auth state listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        loadMessages();

        // Send message on button click
        sendButton.addEventListener('click', () => sendMessage(user));

        // Send message on Enter key press
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                sendMessage(user);
            }
        });
    } else {
        // User is not signed in
        alert('Por favor, faça login para usar o chat.');
        window.location.href = 'auth.html'; // Redirect to login page
    }
});
