import { db } from './firebaseConfig.js'; // Importa db do arquivo de configuração do Firebase
import { collection, writeBatch, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Função para resetar os scores dos usuários
const resetUserScores = async () => {
    try {
        console.log('Iniciando o processo de reset dos scores.');

        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);

        if (querySnapshot.empty) {
            console.error('Nenhum documento encontrado na coleção "users".');
            return;
        }

        const batch = writeBatch(db);
        querySnapshot.forEach((docSnapshot) => {
            const userRef = docSnapshot.ref;
            console.log(`Preparando para resetar scores do usuário com ID: ${userRef.id}`);
            batch.update(userRef, {
                scoreglobal: 0,
                scoreenem: 0,
                scoreobmep: 0
            });
        });

        await batch.commit();
        console.log('Scores resetados com sucesso!');
        
        // Mostrar no console o dia do reset e o próximo reset
        const resetDate = new Date();
        console.log(`Data do reset atual: ${resetDate.toISOString()}`);
        const nextResetDate = getNextTargetDate();
        console.log(`Próxima data de reset: ${nextResetDate.toISOString()}`);
        const nextNextResetDate = getNextNextTargetDate(nextResetDate);
        console.log(`Próxima próxima data de reset: ${nextNextResetDate.toISOString()}`);
        
    } catch (error) {
        console.error('Erro ao resetar scores: ', error);
        // Forçar o reset em caso de erro
        console.log('Tentando forçar o reset dos scores.');
        await forceResetUserScores();
    }
};

// Função para forçar o reset dos scores dos usuários
const forceResetUserScores = async () => {
    try {
        console.log('Forçando o reset dos scores.');

        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);

        if (querySnapshot.empty) {
            console.error('Nenhum documento encontrado na coleção "users" para forçar o reset.');
            return;
        }

        const batch = writeBatch(db);
        querySnapshot.forEach((docSnapshot) => {
            const userRef = docSnapshot.ref;
            console.log(`Forçando o reset dos scores do usuário com ID: ${userRef.id}`);
            batch.update(userRef, {
                scoreglobal: 0,
                scoreenem: 0,
                scoreobmep: 0
            });
        });

        await batch.commit();
        console.log('Scores forçados e resetados com sucesso!');
    } catch (error) {
        console.error('Erro ao forçar o reset dos scores: ', error);
    }
};

// Função para obter a próxima data alvo (60 dias após o último reset) às 00:00 BRT
const getNextTargetDate = () => {
    const now = new Date();
    let targetDate = new Date(localStorage.getItem('nextResetDate'));

    // Define a data do primeiro reset para 01/09/2024 às 00:00 no horário de Brasília
    const initialResetDate = new Date('2024-09-01T03:00:00Z'); // Convertido para UTC (00:00 BRT = 03:00 UTC)

    if (!targetDate || targetDate <= now) {
        if (now < initialResetDate) {
            // Se ainda não chegou 01/09/2024, defina o primeiro reset para essa data
            targetDate = initialResetDate;
        } else {
            // Se já passou 01/09/2024, defina o próximo reset para 60 dias após o último reset
            targetDate = new Date(now);
            targetDate.setUTCDate(targetDate.getUTCDate() + 60); // Adiciona 60 dias
            targetDate.setUTCHours(3, 0, 0, 0); // Define o horário para 00:00 BRT (03:00 UTC)
        }

        console.log('Definindo a próxima data alvo:', targetDate.toISOString());
        localStorage.setItem('nextResetDate', targetDate.toISOString());
    } else {
        console.log('Data alvo já definida:', targetDate.toISOString());
    }

    return targetDate;
};

// Função para obter a próxima próxima data alvo (60 dias após o próximo reset)
const getNextNextTargetDate = (currentTargetDate) => {
    const nextNextTargetDate = new Date(currentTargetDate);
    nextNextTargetDate.setUTCDate(nextNextTargetDate.getUTCDate() + 60); // Adiciona 60 dias
    nextNextTargetDate.setUTCHours(3, 0, 0, 0); // Define o horário para 00:00 BRT (03:00 UTC)
    return nextNextTargetDate;
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

        // Atualizar a próxima data alvo para 60 dias após o reset
        const newTargetDate = getNextTargetDate();
        newTargetDate.setUTCDate(newTargetDate.getUTCDate() + 60); // Define para 60 dias a partir de agora
        newTargetDate.setUTCHours(3, 0, 0, 0); // Define o horário para 00:00 BRT (03:00 UTC)
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
    console.log('Iniciando a contagem regressiva.');
    updateCountdown(); // Atualiza o contador imediatamente ao carregar o script
    countdownInterval = setInterval(updateCountdown, 1000); // Atualiza o contador a cada segundo
};

// Variável global para controlar o intervalo
let countdownInterval;

// Inicializa o contador com a data inicial e configuração
const initializeCountdown = () => {
    const initialTargetDate = new Date('2024-09-01T03:00:00Z'); // Horário de Brasília (00:00 BRT = 03:00 UTC)
    const now = new Date();

    // Se for antes de 01/09/2024, configura a data alvo inicial
    if (now < initialTargetDate) {
        console.log('Configurando a data alvo inicial para:', initialTargetDate.toISOString());
        localStorage.setItem('nextResetDate', initialTargetDate.toISOString());
    } else {
        // Se já passou 01/09/2024, configura a próxima data alvo conforme necessário
        console.log('Data alvo inicial já passada. Calculando próxima data alvo.');
        getNextTargetDate();
    }

    startCountdown();
};

// Inicia a contagem regressiva ao carregar o script
initializeCountdown();
