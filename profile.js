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

const forbiddenUsernames = [
    'aghamenon toberlock estudos', 'aghamenon toberlock estudo', 
    'aghamenon toberlock estud', 'aghamenon toberlock estu', 
    'aghamenon toberlock est', 'aghamenon toberlock es', 
    'aghamenon toberlock e', 'aghamenon toberlock', 
    'aghamenon toberloc', 'aghamenon toberlo', 
    'aghamenon toberl', 'aghamenon tober', 
    'aghamenon tobe', 'aghamenon tob', 
    'aghamenon to', 'aghamenon t', 
    'aghamenon', 'aghamenont', 
    'aghamenonto', 'aghamenontob', 
    'aghamenontobe', 'aghamenontober', 
    'aghamenontoberl', 'aghamenontoberlo', 
    'aghamenontoberloc', 'aghamenontoberlock', 
    'aghamenontoberlocke', 'aghamenontoberlockes', 
    'aghamenontoberlockest', 'aghamenontoberlockestu', 
    'aghamenontoberlockestud', 'aghamenontoberlockestudo', 
    'aghamenontoberlockestudos', 
    'aghamenon-toberlock-estudos', 
    'aghamenon-toberlockestudos', 
    'aghamenontoberlock-estudos', 
    'aghamenon_toberlockestudos', 
    'aghamenon_toberlock_estudos', 
    'aghamenontoberlock_estudos'
];

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

document.addEventListener('DOMContentLoaded', function() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("Usuário autenticado:", user);
            const profilePhoto = document.getElementById('profile-photo');
            const profileName = document.getElementById('profile-name');
            const profileGametag = document.getElementById('profile-gametag');
            const profileBioText = document.getElementById('profile-bio-text');
            const profileScoreGlobal = document.getElementById('score-global');
            const profileScoreEnem = document.getElementById('score-enem');
            const profileScoreObmep = document.getElementById('score-obmep');
            const profileAverageAccuracy = document.getElementById('average-accuracy');
            const profileTotalCorrectAnswers = document.getElementById('total-correct-answers');
            const profileTotalErrors = document.getElementById('total-errors');
            const profileTotalSimulated = document.getElementById('total-simulated');

            if (profilePhoto) document.getElementById('logout-menu-item').style.display = 'block';
            
            const userDocRef = doc(firestore, `users/${user.uid}`);

            getDoc(userDocRef).then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    const gameTag = userData.gameTag || generateGametag(user.displayName);

                    if (profilePhoto) profilePhoto.src = userData.photoURL || 'default-profile-pic.jpg';
                    if (profileName) profileName.textContent = userData.username || user.displayName || 'Nome do Usuário';
                    if (profileGametag) profileGametag.textContent = gameTag;
                    if (profileBioText) profileBioText.textContent = userData.bio || 'Escreva em sua Bio, conte o que você gosta!';

                    // Atualizando as novas métricas
                    if (profileScoreGlobal) profileScoreGlobal.textContent = ` ${userData.scoreglobal || '--'} Pontos`;
                    if (profileScoreEnem) profileScoreEnem.textContent = ` ${userData.scoreenem || '--'} Pontos`;
                    if (profileScoreObmep) profileScoreObmep.textContent = ` ${userData.scoreobmep || '--'} Pontos`;

                    // Atualizando as métricas adicionais
                    if (profileAverageAccuracy) {
                        const averageAccuracy = parseFloat(userData.averageAccuracy);
                        profileAverageAccuracy.textContent = ` ${isNaN(averageAccuracy) ? '--' : averageAccuracy.toFixed(2) + '%'} `;
                    }
                    if (profileTotalCorrectAnswers) profileTotalCorrectAnswers.textContent = ` ${userData.totalCorrectAnswers || '--'} `;
                    if (profileTotalErrors) profileTotalErrors.textContent = ` ${userData.totalErrors || '--'} `;
                    if (profileTotalSimulated) profileTotalSimulated.textContent = ` ${userData.totalSimulated || '--'} `;

                    if (!userData.gameTag) {
                        updateUserProfile(user, { gameTag })
                            .then(() => console.log('gameTag atualizada no Firestore com sucesso.'))
                            .catch((error) => console.error('Erro ao atualizar gameTag no Firestore:', error));
                    }
                } else {
                    const defaultGameTag = generateGametag(user.displayName);
                    const defaultData = {
                        username: user.displayName,
                        gameTag: defaultGameTag,
                        photoURL: 'default-profile-pic.jpg',
                        bio: 'Escreva em sua Bio, conte o que você gosta!',
                        scoreglobal: '--',
                        scoreenem: '--',
                        scoreobmep: '--',
                        averageAccuracy: '--',
                        totalCorrectAnswers: '--',
                        totalErrors: '--',
                        totalSimulated: '--'
                    };
                    updateUserProfile(user, defaultData);
                    if (profileGametag) profileGametag.textContent = defaultGameTag;
                    if (profileName) profileName.textContent = user.displayName;
                    if (profileScoreGlobal) profileScoreGlobal.textContent = ` ${defaultData.scoreglobal} Pontos`;
                    if (profileScoreEnem) profileScoreEnem.textContent = ` ${defaultData.scoreenem} Pontos`;
                    if (profileScoreObmep) profileScoreObmep.textContent = ` ${defaultData.scoreobmep} Pontos`;
                    if (profileAverageAccuracy) profileAverageAccuracy.textContent = ` ${defaultData.averageAccuracy} `;
                    if (profileTotalCorrectAnswers) profileTotalCorrectAnswers.textContent = ` ${defaultData.totalCorrectAnswers} `;
                    if (profileTotalErrors) profileTotalErrors.textContent = ` ${defaultData.totalErrors} `;
                    if (profileTotalSimulated) profileTotalSimulated.textContent = ` ${defaultData.totalSimulated} `;
                }
            }).catch((error) => console.error('Erro ao recuperar dados do usuário do Firestore:', error));

            document.getElementById('change-photo-button').addEventListener('click', () => {
                document.getElementById('upload-photo').click();
            });

            document.getElementById('upload-photo').addEventListener('change', async (event) => {
                const file = event.target.files[0];

                if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
                    const storageRef = ref(storage, 'profile-photos/' + user.uid);

                    try {
                        const snapshot = await uploadBytes(storageRef, file);
                        const url = await getDownloadURL(snapshot.ref);
                        
                        await updateProfile(user, { photoURL: url });
                        if (profilePhoto) profilePhoto.src = url;
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
            });

            document.getElementById('confirm-name-change').addEventListener('click', async () => {
                const newName = document.getElementById('edit-name').value.trim();
                if (newName && !isUsernameForbidden(newName)) {
                    try {
                        await updateProfile(user, { displayName: newName });
                        document.getElementById('profile-name').textContent = newName;
                        await updateUserProfile(user, { username: newName });
                        console.log('Nome atualizado no Firestore com sucesso.');
                    } catch (error) {
                        console.error('Erro ao atualizar nome no Firestore:', error);
                    }
                } else if (isUsernameForbidden(newName)) {
                    alert('Nome de usuário inválido.');
                } else {
                    alert('O nome não pode estar vazio.');
                }
            });

            document.getElementById('edit-bio-button').addEventListener('click', () => {
                document.getElementById('bio-edit-container').style.display = 'flex';
                document.getElementById('edit-bio').value = document.getElementById('profile-bio-text').textContent;
            });

            document.getElementById('confirm-bio-change').addEventListener('click', async () => {
                const bioText = document.getElementById('edit-bio').value.trim();
                if (bioText) {
                    try {
                        document.getElementById('profile-bio-text').textContent = bioText;
                        await updateUserProfile(user, { bio: bioText });
                        console.log('Biografia atualizada no Firestore com sucesso.');
                        document.getElementById('bio-edit-container').style.display = 'none';
                    } catch (error) {
                        console.error('Erro ao atualizar biografia no Firestore:', error);
                    }
                } else {
                    alert('A biografia não pode estar vazia.');
                }
            });

            document.getElementById('logout-button').addEventListener('click', () => {
                auth.signOut().then(() => {
                    console.log('Usuário desconectado com sucesso.');
                    window.location.href = 'auth.html';
                }).catch((error) => {
                    console.error('Erro ao desconectar:', error);
                });
            });
        } else {
            console.log("Nenhum usuário autenticado.");
            document.getElementById('logout-menu-item').style.display = 'none';
            window.location.href = "auth.html";
        }
    });
});
