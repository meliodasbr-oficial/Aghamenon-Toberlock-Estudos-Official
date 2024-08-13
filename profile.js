import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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
const storage = getStorage(app);
const firestore = getFirestore(app);

const forbiddenUsernames = ['aghamenon toberlock estudos', 'aghamenon toberlock estudo', 'aghamenon toberlock estud', 'aghamenon toberlock estu', 'aghamenon toberlock est', 'aghamenon toberlock es', 'aghamenon toberlock e', 'aghamenon toberlock', 'aghamenon toberloc', 'aghamenon toberlo', 'aghamenon toberl', 'aghamenon tober', 'aghamenon tobe', 'aghamenon tob', 'aghamenon to', 'aghamenon t', 'aghamenon', 'aghamenont', 'aghamenonto', 'aghamenontob', 'aghamenontobe', 'aghamenontober', 'aghamenontoberl', 'aghamenontoberlo', 'aghamenontoberloc', 'aghamenontoberlock', 'aghamenontoberlocke', 'aghamenontoberlockes', 'aghamenontoberlockest', 'aghamenontoberlockestu', 'aghamenontoberlockestud', 'aghamenontoberlockestudo', 'aghamenontoberlockestudos', 'aghamenon-toberlock-estudos', 'aghamenon-toberlockestudos', 'aghamenontoberlock-estudos', 'aghamenon_toberlockestudos', 'aghamenon_toberlock_estudos', 'aghamenontoberlock_estudos']; // Adicione outros nomes proibidos aqui, todos em minúsculas

function generateGametag(username) {
    const tagNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${username}#${tagNumber}`;
}

function isUsernameForbidden(username) {
    const lowercaseUsername = username.toLowerCase();
    return forbiddenUsernames.includes(lowercaseUsername);
}

async function updateUserProfile(user, data) {
    const userDocRef = doc(firestore, `users/${user.uid}`);
    await setDoc(userDocRef, data, { merge: true });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuário autenticado:", user);

        document.getElementById('logout-menu-item').style.display = 'block';

        const userDocRef = doc(firestore, `users/${user.uid}`);

        getDoc(userDocRef).then((docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                const gameTag = userData.gameTag || generateGametag(user.displayName);

                document.getElementById('profile-photo').src = userData.photoURL || 'default-profile-pic.jpg';
                document.getElementById('profile-name').textContent = userData.username || user.displayName || 'Nome do Usuário';
                document.getElementById('profile-gametag').textContent = gameTag;
                document.getElementById('profile-bio-text').textContent = userData.bio || 'Fale um pouco do que você gosta';

                if (!userData.gameTag) {
                    updateUserProfile(user, { gameTag }).then(() => {
                        console.log('gameTag atualizada no Firestore com sucesso.');
                    }).catch((error) => {
                        console.error('Erro ao atualizar gameTag no Firestore:', error);
                    });
                }
            } else {
                const defaultGameTag = generateGametag(user.displayName);
                const defaultData = {
                    username: user.displayName,
                    gameTag: defaultGameTag,
                    photoURL: user.photoURL || 'default-profile-pic.jpg',
                    bio: 'Fale um pouco do que você gosta'
                };
                updateUserProfile(user, defaultData);
                document.getElementById('profile-gametag').textContent = defaultGameTag;
                document.getElementById('profile-name').textContent = user.displayName;
            }
        }).catch((error) => {
            console.error('Erro ao recuperar dados do usuário do Firestore:', error);
        });

        document.getElementById('change-photo-button').addEventListener('click', () => {
            document.getElementById('upload-photo').click();
        });

        document.getElementById('upload-photo').addEventListener('change', async (event) => {
            const file = event.target.files[0];

            if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
                const storageRef = ref(storage, 'profile-photos/' + user.uid);

                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('profile-photo').src = e.target.result;
                }
                reader.readAsDataURL(file);

                try {
                    const snapshot = await uploadBytes(storageRef, file);
                    const url = await getDownloadURL(snapshot.ref);
                    
                    await updateProfile(user, { photoURL: url });
                    document.getElementById('profile-photo').src = url;
                    await updateUserProfile(user, { photoURL: url });
                    console.log('Foto atualizada no Firestore com sucesso.');
                } catch (error) {
                    console.error('Erro ao atualizar foto:', error);
                }
            } else {
                alert('Por favor, selecione uma imagem JPG ou PNG.');
            }
        });

        document.getElementById('edit-name-button').addEventListener('click', () => {
            const nameInput = document.getElementById('edit-name');
            const confirmButton = document.getElementById('confirm-name-change');
            nameInput.style.display = 'block';
            confirmButton.style.display = 'block';
            nameInput.value = document.getElementById('profile-name').textContent;
            nameInput.focus();

            confirmButton.addEventListener('click', async () => {
                const newName = nameInput.value.trim();
                if (newName) {
                    if (isUsernameForbidden(newName)) {
                        alert('Este nome de usuário não é permitido.');
                        return;
                    }

                    try {
                        await updateUserProfile(user, { username: newName });
                        document.getElementById('profile-name').textContent = newName;
                        console.log('Nome de usuário atualizado no Firestore com sucesso.');
                        nameInput.style.display = 'none';
                        confirmButton.style.display = 'none';
                    } catch (error) {
                        console.error('Erro ao atualizar nome de usuário no Firestore:', error);
                    }
                } else {
                    alert('O nome de usuário não pode estar vazio.');
                }
            });
        });

        document.getElementById('edit-bio-button').addEventListener('click', () => {
    document.getElementById('bio-edit-container').style.display = 'flex';
    const bioInput = document.getElementById('edit-bio');
    bioInput.value = document.getElementById('profile-bio-text').textContent;
    bioInput.focus();
});

document.getElementById('confirm-bio-change').addEventListener('click', async () => {
    const bioInput = document.getElementById('edit-bio');
    const newBio = bioInput.value.trim();
    if (newBio) {
        try {
            document.getElementById('profile-bio-text').textContent = newBio;
            await updateUserProfile(auth.currentUser, { bio: newBio });
            console.log('Biografia atualizada no Firestore com sucesso.');
            document.getElementById('bio-edit-container').style.display = 'none';
        } catch (error) {
            console.error('Erro ao atualizar biografia no Firestore:', error);
        }
    } else {
        alert('A biografia não pode estar vazia.');
    }
});
   
    } else {
        console.log("Nenhum usuário autenticado.");
        document.getElementById('logout-menu-item').style.display = 'none';
        window.location.href = "auth.html";
    }
});

document.getElementById('logout-button').addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = "auth.html";
    }).catch((error) => {
        console.error('Erro ao fazer logout:', error);
    });
});
