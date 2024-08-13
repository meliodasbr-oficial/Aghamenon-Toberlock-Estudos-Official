    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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
const analytics = getAnalytics(app);

const auth = getAuth();
const db = getFirestore(app);

const forbiddenUsernames = [
    'aghamenon toberlock estudos',
    'aghamenon toberlock estudo',
    // Adicione mais nomes proibidos aqui
];

// Função para normalizar o nome de usuário para comparação
function normalizeUsername(username) {
    return username.toLowerCase();
}

// Verifica se o nome de usuário está na lista de proibidos
function isUsernameForbidden(username) {
    const normalizedUsername = normalizeUsername(username);
    return forbiddenUsernames.map(normalizeUsername).includes(normalizedUsername);
}

// Gerar Game Tag Única
async function generateUniqueGameTag(username) {
    let gameTag;
    let isUnique = false;
    while (!isUnique) {
        const randomTag = Math.floor(1000 + Math.random() * 9000); // Gerar número aleatório de 4 dígitos
        gameTag = `${username}#${randomTag}`;
        const querySnapshot = await getDoc(doc(db, "userTags", gameTag));
        if (!querySnapshot.exists()) {
            isUnique = true;
        }
    }
    return gameTag;
}

// Função para tratar erros
function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'O endereço de e-mail está inválido.';
        case 'auth/user-not-found':
            return 'Nenhum usuário encontrado com este e-mail.';
        case 'auth/wrong-password':
            return 'Senha incorreta.';
        case 'auth/email-already-in-use':
            return 'Este e-mail já está em uso.';
        default:
            return 'Ocorreu um erro inesperado. Tente novamente.';
    }
}

// Função para redirecionar após login ou registro
function redirectToHome() {
    window.location.href = 'index.html'; // Redireciona para index.html
}

// Login com email e senha
document.getElementById('login-button').addEventListener('click', () => {
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Usuário logado:', user);
            showNotification('Login bem-sucedido!');
            redirectToHome(); // Redireciona para index.html após o login
        })
        .catch((error) => {
            const errorMessage = getErrorMessage(error.code);
            console.error('Erro no login:', error.code, error.message);
            showNotification('Erro no login: ' + errorMessage, 5000);
        });
});

// Login com Google
document.getElementById('google-login').addEventListener('click', (e) => {
    e.preventDefault(); // Evita o redirecionamento padrão do link
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;
            console.log('Usuário logado com Google:', user);
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    username: user.displayName, // Use username em vez de displayName
                    email: user.email,
                    gameTag: await generateUniqueGameTag(user.displayName)
                });
            }
            showNotification('Login com Google bem-sucedido!');
            redirectToHome(); // Redireciona para index.html após o login
        })
        .catch((error) => {
            const errorMessage = getErrorMessage(error.code);
            console.error('Erro no login com Google:', error.code, error.message);
            showNotification('Erro no login com Google: ' + errorMessage, 5000);
        });
});

// Registro com email e senha
document.getElementById('register-button').addEventListener('click', async () => {
    const email = document.getElementById('email-register').value;
    const password = document.getElementById('password-register').value;
    const username = document.getElementById('username-register').value;

    if (isUsernameForbidden(username)) {
        showNotification('Nome de usuário não permitido. Escolha outro nome.', 5000);
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            console.log('Usuário registrado:', user);
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                username: username, // Use username em vez de displayName
                email: user.email,
                gameTag: await generateUniqueGameTag(username)
            });
            showNotification('Registro bem-sucedido!');
            redirectToHome(); // Redireciona para index.html após o registro
        })
        .catch((error) => {
            const errorMessage = getErrorMessage(error.code);
            console.error('Erro no registro:', error.code, error.message);
            showNotification('Erro no registro: ' + errorMessage, 5000);
        });
});

// Registro com Google
document.getElementById('google-register').addEventListener('click', async (e) => {
    e.preventDefault(); // Evita o redirecionamento padrão do link
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;
            console.log('Usuário registrado com Google:', user);
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    username: user.displayName, // Use username em vez de displayName
                    email: user.email,
                    gameTag: await generateUniqueGameTag(user.displayName)
                });
            }
            showNotification('Registro com Google bem-sucedido!');
            redirectToHome(); // Redireciona para index.html após o registro
        })
        .catch((error) => {
            const errorMessage = getErrorMessage(error.code);
            console.error('Erro no registro com Google:', error.code, error.message);
            showNotification('Erro no registro com Google: ' + errorMessage, 5000);
        });
});
