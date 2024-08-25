import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getFirestore, collection, query, orderBy, limit, getDocs, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function() {
    const rankingList = document.getElementById('ranking-list');
    const rankingSelector = document.getElementById('ranking-selector');
    const userRankingRow = document.getElementById('user-ranking-row');
    const userRankingPosition = document.getElementById('user-ranking-position');
    const userRankingGameTag = document.getElementById('user-ranking-gametag');
    const userRankingScore = document.getElementById('user-ranking-score');
    const userRankingPatente = document.getElementById('user-ranking-patente');
    const userRankingPhoto = document.getElementById('user-ranking-photo');
    const authMessage = document.getElementById('auth-message');

    const userPositionList = document.getElementById('user-position-list');
    const userPositionPosition = document.getElementById('user-position-position');
    const userPositionGameTag = document.getElementById('user-position-gametag');
    const userPositionScore = document.getElementById('user-position-score');
    const userPositionPatente = document.getElementById('user-position-patente');
    const userPositionPhoto = document.getElementById('user-position-photo');

    let userId = null;

    const getPatente = (score) => {
        // Função para determinar a patente com base na pontuação
        if (score >= 20000) return 'Sábio dos Simulados';
        if (score >= 17000) return 'Mestre dos Simulados 4';
        if (score >= 15600) return 'Mestre dos Simulados 3';
        if (score >= 14200) return 'Mestre dos Simulados 2';
        if (score >= 12800) return 'Mestre dos Simulados 1';
        if (score >= 11400) return 'Especialista 4';
        if (score >= 10200) return 'Especialista 3';
        if (score >= 9000) return 'Especialista 2';
        if (score >= 7800) return 'Especialista 1';
        if (score >= 6600) return 'Avançado 3';
        if (score >= 5700) return 'Avançado 2';
        if (score >= 4800) return 'Avançado 1';
        if (score >= 3900) return 'Proficiente 3';
        if (score >= 3300) return 'Proficiente 2';
        if (score >= 2700) return 'Proficiente 1';
        if (score >= 2000) return 'Intermediário 3';
        if (score >= 1500) return 'Intermediário 2';
        if (score >= 1000) return 'Intermediário 1';
        if (score >= 600) return 'Iniciante 3';
        if (score >= 300) return 'Iniciante 2';
        return 'Iniciante';
    };

    const updateRankingUI = (rankingData, userRankingData) => {
        rankingList.innerHTML = '';
        rankingData.forEach((item, index) => {
            const score = Number(item.score) || 0;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td class="gametag-container">
                    <img class="user-photo" src="${item.photoURL || 'default-photo-url'}" alt="Foto do Usuário">
                    ${item.gameTag || 'Desconhecido'}
                </td>
                <td>${score}</td>
                <td>${getPatente(score)}</td>
            `;
            rankingList.appendChild(row);
        });

        // Atualizar a linha do ranking do usuário
        if (userRankingData) {
            userRankingPosition.textContent = `Posição: ${userRankingData.position}`;
            userRankingGameTag.textContent = userRankingData.gameTag || 'Desconhecido';
            userRankingScore.textContent = `Pontuação: ${userRankingData.score}`;
            userRankingPatente.textContent = `Patente: ${userRankingData.patente}`;
            userRankingPhoto.src = userRankingData.photoURL || 'default-photo-url';

            // Atualizar a tabela de posição do usuário
            userPositionPosition.textContent = `${userRankingData.position}`;
            userPositionGameTag.textContent = userRankingData.gameTag || 'Desconhecido';
            userPositionScore.textContent = `${userRankingData.score}`;
            userPositionPatente.textContent = `${userRankingData.patente}`;
            userPositionPhoto.src = userRankingData.photoURL || 'default-photo-url';
        } else {
            userRankingPosition.textContent = 'Não classificado';
            userRankingGameTag.textContent = 'Desconhecido';
            userRankingScore.textContent = 'Pontuação: 0';
            userRankingPatente.textContent = 'Patente: Iniciante';
            userRankingPhoto.src = 'default-photo-url';

            // Limpar a tabela de posição do usuário
            userPositionPosition.textContent = 'Não classificado';
            userPositionGameTag.textContent = 'Desconhecido';
            userPositionScore.textContent = 'Pontuação: 0';
            userPositionPatente.textContent = 'Patente: Iniciante';
            userPositionPhoto.src = 'default-photo-url';
        }
    };

    const fetchRankingData = async (rankingType) => {
        try {
            const rankingRef = collection(db, 'users');
            const rankingQuery = query(rankingRef, orderBy(rankingType, 'desc'), limit(50));
            const querySnapshot = await getDocs(rankingQuery);

            const rankingData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    gameTag: data.gameTag,
                    score: data[rankingType],
                    photoURL: data.photoURL
                };
            });

            if (userId) {
                const userRankingData = await getUserRanking(userId, rankingType);
                updateRankingUI(rankingData, userRankingData);
            } else {
                updateRankingUI(rankingData, null);
            }
        } catch (error) {
            console.error('Erro ao buscar dados de ranking: ', error);
        }
    };

    const getUserRanking = async (userId, rankingType) => {
        try {
            const docRef = doc(db, 'users', userId);
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                const userScore = Number(userData[rankingType]) || 0;
                const ranking = query(collection(db, 'users'), orderBy(rankingType, 'desc'));
                const querySnapshot = await getDocs(ranking);

                const rankingList = querySnapshot.docs.map(doc => doc.data());
                const position = rankingList.findIndex(item => item.gameTag === userData.gameTag) + 1;

                return {
                    position: position !== 0 ? position : 'Não classificado',
                    gameTag: userData.gameTag,
                    score: userScore,
                    patente: getPatente(userScore),
                    photoURL: userData.photoURL || 'default-photo-url'
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error('Erro ao buscar ranking do usuário: ', error);
            return null;
        }
    };

    const onRankingTypeChange = () => {
        const rankingType = rankingSelector.value;
        fetchRankingData(rankingType);
    };

    rankingSelector.addEventListener('change', onRankingTypeChange);

    // Verificar o estado de autenticação do usuário
    onAuthStateChanged(auth, (user) => {
        if (user) {
            userId = user.uid;
            fetchRankingData(rankingSelector.value);
        } else {
            authMessage.textContent = 'Você precisa estar logado para ver o ranking do usuário.';
            userRankingRow.style.display = 'none';
            fetchRankingData(rankingSelector.value); // Ainda buscará o ranking geral
        }
    });

    // Atualizar ranking a cada 1 minuto
    setInterval(() => {
        onRankingTypeChange();
    }, 60000); // 60000 ms = 1 minuto
});
