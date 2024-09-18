
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
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
const db = getFirestore(app);
const auth = getAuth(app);

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');
const chatBox = document.getElementById('chat-box');

const bannedWords = ['puta que pariu', 'vai se fuder', 'porra', 'caralho', 'filha da puta', 'filho da puta', 'arrombado(a)', 'fudido', 'cacete', 'vai tomar no cu', 'puto', 'puta', 'cu', 'Pika', 'Pau', 'Pau Pretão', 'Pretão', 'Boiola', 'Baitola', 'Fudido']; // Adicionar mais palavrões caso tiver

function hasBannedWords(message) {
    const lowerCaseMessage = message.toLowerCase();
    return bannedWords.some(word => lowerCaseMessage.includes(word));
}

async function getUserGameTag(userId) {
    try {
        const userDoc = doc(db, 'users', userId);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
            return userSnap.data().gameTag;
        } else {
            console.error("Usuário não encontrado!");
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar GameTag: ", error);
        return null;
    }
}

async function sendMessage(user) {
    const message = messageInput.value.trim();

    if (message === '') return;

    if (hasBannedWords(message)) {
        alert("Sua mensagem contém palavras proibidas.");
        return;
    }

    try {
        const gameTag = await getUserGameTag(user.uid);

        if (gameTag) {
        
            await addDoc(collection(db, 'messages'), {
                sender: gameTag,
                message: message,
                timestamp: serverTimestamp()
            });

            messageInput.value = '';
        }
    } catch (error) {
        console.error("Erro ao enviar mensagem: ", error);
    }
}

function loadMessages(user) {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    onSnapshot(q, (snapshot) => {
        chatBox.innerHTML = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            const isUserMessage = data.sender === user.gameTag;
            const prefix = isUserMessage ? 'Você:' : data.sender;
            const alignmentClass = isUserMessage ? 'right' : 'left';
            messageElement.classList.add(alignmentClass);
            messageElement.innerHTML = `
                <span class="prefix">${prefix}</span> ${data.message}
                <span class="time">${new Date(data.timestamp?.toDate()).toLocaleTimeString('pt-BR')}</span>
            `;
            chatBox.appendChild(messageElement);
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
    
        const gameTag = await getUserGameTag(user.uid);
        if (gameTag) {
            loadMessages({ uid: user.uid, gameTag });

            sendButton.addEventListener('click', () => sendMessage(user));

            messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    sendMessage(user);
                }
            });
        }
    } else {
    
        alert('Por favor, faça login para usar o chat global.');
        window.location.href = 'auth.html';
    }
});
