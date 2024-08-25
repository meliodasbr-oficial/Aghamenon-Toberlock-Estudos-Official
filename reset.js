import { db } from './firebaseConfig.js'; // Importa db do arquivo de configuração do Firebase
import { collection, writeBatch, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Função para resetar os scores dos usuários
const resetUserScores = async () => {
    try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);

        if (querySnapshot.empty) {
            console.error('Nenhum documento encontrado na coleção "users".');
            return;
        }

        const batch = writeBatch(db);
        querySnapshot.forEach((docSnapshot) => {
            const userRef = docSnapshot.ref;
            console.log(`Resetando scores para o usuário com ID: ${userRef.id}`);
            batch.update(userRef, {
                scoreglobal: 0,
                scoreenem: 0,
                scoreobmep: 0
            });
        });

        await batch.commit();
        console.log('Scores resetados com sucesso!');
    } catch (error) {
        console.error('Erro ao resetar scores: ', error);
    }
};

// Função para obter a próxima data alvo (60 dias após o último reset)
const getNextTargetDate = () => {
    const now = new Date();
    let targetDate = new Date(localStorage.getItem('nextResetDate'));

    // Define a data do primeiro reset para 01/09/2024
    const initialResetDate = new Date('2024-09-01T00:00:00Z');

    if (!targetDate || targetDate <= now) {
        if (now < initialResetDate) {
            // Se ainda não chegou 01/09/2024, defina o primeiro reset para essa data
            targetDate = initialResetDate;
        } else {
            // Se já passou 01/09/2024, defina o próximo reset para 60 dias após o último reset
            targetDate = targetDate ? new Date(targetDate) : initialResetDate;
            targetDate.setDate(targetDate.getDate() + 60); // Adiciona 60 dias à data alvo
            targetDate.setUTCHours(0, 0, 0, 0); // Define para 00:00:00
        }

        console.log('Definindo a próxima data alvo:', targetDate.toISOString());
        localStorage.setItem('nextResetDate', targetDate.toISOString());
    }

    return targetDate;
};

// Função para atualizar o contador de contagem regressiva
const updateCountdown = () => {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) {
        console.error('Elemento com id "countdown" não encontrado.');
        return;
    }

    const targetDate = getNextTargetDate();
    const now = new Date();
    const timeRemaining = targetDate - now;

    if (timeRemaining <= 0) {
        countdownElement.textContent = 'O tempo acabou!';
        clearInterval(countdownInterval); // Para o contador quando o tempo acabar
        console.log('Tempo acabou. Resetando scores imediatamente.');
        resetUserScores(); // Resetar os scores imediatamente

        // Atualizar a próxima data alvo para 60 dias a partir de agora
        const newTargetDate = new Date(now);
        newTargetDate.setDate(newTargetDate.getDate() + 60); // Adiciona 60 dias à nova data alvo
        newTargetDate.setUTCHours(0, 0, 0, 0); // Define para 00:00:00
        localStorage.setItem('nextResetDate', newTargetDate.toISOString());
        console.log(`Nova data alvo após reset: ${newTargetDate.toISOString()}`);
        
        // Reiniciar a contagem regressiva após o reset
        startCountdown();
        return;
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

// Função para iniciar o processo de contagem regressiva
const startCountdown = () => {
    updateCountdown(); // Atualiza o contador imediatamente ao carregar o script
    countdownInterval = setInterval(updateCountdown, 1000); // Atualiza o contador a cada segundo
};

// Função para simular o reset dos scores
const simulateReset = () => {
    // Avançar a data alvo para o passado
    const now = new Date();
    const simulatedTargetDate = new Date(now);
    simulatedTargetDate.setDate(simulatedTargetDate.getDate() - 1); // Define a data alvo como um dia antes de hoje
    localStorage.setItem('nextResetDate', simulatedTargetDate.toISOString());

    console.log('Simulando a passagem do tempo...');
    updateCountdown(); // Atualiza o contador imediatamente para refletir a data simulada

    // Testa o reset
    const targetDate = new Date(simulatedTargetDate);
    if (targetDate <= now) {
        console.log('Simulando o reset dos scores...');
        resetUserScores(); // Resetar os scores

        // Atualizar a próxima data alvo para 60 dias a partir de agora
        const newTargetDate = new Date(now);
        newTargetDate.setDate(newTargetDate.getDate() + 60); // Adiciona 60 dias à nova data alvo
        newTargetDate.setUTCHours(0, 0, 0, 0); // Define para 00:00:00
        localStorage.setItem('nextResetDate', newTargetDate.toISOString());
        console.log(`Nova data alvo após reset: ${newTargetDate.toISOString()}`);
    } else {
        console.log('A data alvo ainda não passou.');
    }
};

// Variável global para controlar o intervalo
let countdownInterval;

// Inicializa o contador com a data inicial e configuração
const initializeCountdown = () => {
    const initialTargetDate = new Date('2024-09-01T00:00:00Z');
    const now = new Date();

    // Se for antes de 01/09/2024, configura a data alvo inicial
    if (now < initialTargetDate) {
        localStorage.setItem('nextResetDate', initialTargetDate.toISOString());
    } else {
        // Se já passou 01/09/2024, configura a próxima data alvo conforme necessário
        getNextTargetDate();
    }

    startCountdown();
};

// Inicia a contagem regressiva ao carregar o script
initializeCountdown();

// Configura o botão para testar o reset dos scores
//document.getElementById('testReset').addEventListener('click', simulateReset);
