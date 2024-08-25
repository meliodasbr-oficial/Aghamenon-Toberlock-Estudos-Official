import { auth } from './firebaseConfig.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Referências aos elementos da página
const welcomeContainer = document.getElementById('welcome-container');
const loginAlert = document.getElementById('login-alert');
const startButton = document.getElementById('start-button');
const questionContainer = document.getElementById('question-container');
const resultContainer = document.getElementById('result-container');
const loginRedirectButton = document.getElementById('login-redirect-button');
const questionElement = document.getElementById('question');
const answersContainer = document.getElementById('answers');
const nextButton = document.getElementById('next-button');
const scoreElement = document.getElementById('score');
const correctAnswersElement = document.getElementById('correct-answers');
const totalQuestionsElement = document.getElementById('total-questions');
const questionsAnsweredElement = document.getElementById('questions-answered');
const fazerButton = document.getElementById('fazer-button');
const homeButton = document.getElementById('home-button');
const timeElement = document.getElementById('time');
const reviewAnswersContainer = document.getElementById('review-answers');
const timeoutResult = document.getElementById('timeout-result');
const retryButton = document.getElementById('retry-button');
const inactiveTabAlert = document.getElementById('inactive-tab-alert');
const backToSimuladoButton = document.getElementById('back-to-simulado-button');

// Firestore initialization
const db = getFirestore();

// Variáveis para o controle do simulado
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let user = null;
let penaltyApplied = false;
let timer;
let simulationId = ''; // Identificador único do simulado
let visibilityCheckActive = false; // Controla se a verificação de abas está ativa
const userAnswers = [];
const originalAnswerIndices = [];

// Lista de questões
const questions = [
    {
        question: `No man is an island,\n\nEntire of itself;\n\nEvery man is a piece of the continent,\n\nA part of the main.\n[...]\nAny man’s death diminishes me,\n\nBecause I am involved in mankind.`,
        answers: [
            "Risco de choques culturais.",
            "Impacto do ensino de história.",
            "Importância da luta ambiental.",
            "Existência de experiências plurais.",
            "Necessidade de capacitação profissional."
        ],
        correctAnswer: 3
    }
];

// Função para embaralhar um array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Função para exibir o aviso de login
function showLoginAlert() {
    welcomeContainer.classList.add('hidden');
    loginAlert.classList.remove('hidden');
    startButton.classList.add('hidden');
}

// Função para exibir o botão de início do simulado
function showStartButton() {
    welcomeContainer.classList.remove('hidden');
    loginAlert.classList.add('hidden');
    startButton.classList.remove('hidden');
}

// Função para iniciar o simulado
function startSimulado() {
    simulationId = Date.now().toString(); // Gerar um ID único com base no timestamp atual
    welcomeContainer.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    timeoutResult.classList.add('hidden');
    inactiveTabAlert.classList.add('hidden');
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    userAnswers.length = 0;
    originalAnswerIndices.length = 0;
    questionsAnsweredElement.textContent = "0";
    totalQuestionsElement.textContent = questions.length.toString();

    shuffleArray(questions);
    showQuestion();
    restartTimer();

    // Ativa a verificação de visibilidade da aba
    visibilityCheckActive = true;
}

// Função para reiniciar o temporizador de 2 minutos
function restartTimer() {
    if (timer) {
        clearInterval(timer);
    }
    startTimer();
}

// Função para iniciar o temporizador de 2 minutos
function startTimer() {
    penaltyApplied = false;
    const timeLimit = 2 * 60 * 1000; // 2 minutos em milissegundos
    const endTime = Date.now() + timeLimit;

    timer = setInterval(() => {
        const timeRemaining = endTime - Date.now();
        if (timeRemaining <= 0) {
            clearInterval(timer);
            timeElement.textContent = '0'; 
            applyPenalty("O tempo acabou, você perdeu 10 pontos.");
        } else {
            const secondsRemaining = Math.floor(timeRemaining / 1000);
            timeElement.textContent = secondsRemaining.toString();
        }
    }, 1000);
}

// Função para exibir uma pergunta
function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswerIndex = currentQuestion.correctAnswer;

    const shuffledAnswers = [...currentQuestion.answers];
    shuffleArray(shuffledAnswers);

    questionElement.textContent = currentQuestion.question;
    answersContainer.innerHTML = '';

    const answerMap = shuffledAnswers.map((answer, index) => ({
        answer,
        originalIndex: currentQuestion.answers.indexOf(answer)
    }));

    originalAnswerIndices[currentQuestionIndex] = currentQuestion.correctAnswer;

    const answerLabels = ['A', 'B', 'C', 'D', 'E'];

    answerMap.forEach((answerObj, idx) => {
        const button = document.createElement('button');
        button.textContent = `${answerLabels[idx]}) ${answerObj.answer}`;
        button.classList.add('answer-button');
        button.addEventListener('click', () => selectAnswer(button, answerObj.originalIndex));
        answersContainer.appendChild(button);
    });

    nextButton.classList.add('hidden');
    restartTimer();
}

// Função para selecionar uma resposta
function selectAnswer(button, originalIndex) {
    const selectedButton = answersContainer.querySelector('.selected');
    if (selectedButton) {
        selectedButton.classList.remove('selected');
    }

    disableAnswerButtons();

    button.classList.add('selected');

    const currentQuestion = questions[currentQuestionIndex];
    if (originalIndex === currentQuestion.correctAnswer) {
        score += 2.5;
        correctAnswers++;
    }

    userAnswers[currentQuestionIndex] = button.textContent.split(') ')[1];
    questionsAnsweredElement.textContent = (currentQuestionIndex + 1).toString();

    nextButton.classList.remove('hidden');
}

// Função para desabilitar os botões de resposta
function disableAnswerButtons() {
    const buttons = answersContainer.querySelectorAll('.answer-button');
    buttons.forEach(button => button.disabled = true);
}

// Função para habilitar os botões de resposta
function enableAnswerButtons() {
    const buttons = answersContainer.querySelectorAll('.answer-button');
    buttons.forEach(button => button.disabled = false);
}

// Função para passar para a próxima pergunta
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        resetQuestion();
        showQuestion();
    } else {
        clearInterval(timer);
        showResults();
    }
});

// Função para limpar a seleção e outros resíduos
function resetQuestion() {
    answersContainer.innerHTML = '';
    enableAnswerButtons();
    nextButton.classList.add('hidden');
}

// Função para aplicar penalidade e atualizar o scoreglobal no Firestore
function applyPenalty(message) {
    if (!penaltyApplied) {
        penaltyApplied = true;
        score -= 10;
        score = Math.max(score, 0);

        alert(message);

        if (user) {
            const userRef = doc(db, 'users', user.uid);

            getDoc(userRef).then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    const currentScoreGlobal = docSnapshot.data().scoreglobal || 0;
                    const newScoreGlobal = Math.max(currentScoreGlobal - 10, 0);

                    updateDoc(userRef, { scoreglobal: newScoreGlobal })
                        .then(() => {
                            console.log('scoreglobal atualizado com sucesso!');
                            showTimeoutResult();
                        })
                        .catch((error) => {
                            console.error('Erro ao atualizar o scoreglobal: ', error);
                        });
                } else {
                    setDoc(userRef, { scoreglobal: Math.max(score, 0) })
                        .then(() => {
                            console.log('scoreglobal criado com sucesso!');
                            showTimeoutResult();
                        })
                        .catch((error) => {
                            console.error('Erro ao criar o scoreglobal: ', error);
                        });
                }
            }).catch((error) => {
                console.error('Erro ao buscar documento do usuário: ', error);
            });
        } else {
            showTimeoutResult();
        }
    }
}

// Função para exibir a tela de resultados de tempo esgotado
function showTimeoutResult() {
    questionContainer.classList.add('hidden');
    resultContainer.classList.add('hidden');
    timeoutResult.classList.remove('hidden');
    inactiveTabAlert.classList.add('hidden'); // Garante que o alerta de aba inativa está oculto
    timeElement.textContent = '0';
    reviewAnswersContainer.innerHTML = '';
}

// Função para exibir os resultados e atualizar a pontuação no Firestore
function showResults() {
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    timeoutResult.classList.add('hidden');
    scoreElement.textContent = score.toFixed(2);
    correctAnswersElement.textContent = correctAnswers.toString();
    totalQuestionsElement.textContent = questions.length.toString();

    reviewAnswersContainer.innerHTML = '';

    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('result-detail');

        const questionText = document.createElement('p');
        questionText.innerHTML = `<strong>Pergunta ${index + 1}:</strong> ${question.question}`;
        questionDiv.appendChild(questionText);

        const userAnswerText = document.createElement('p');
        userAnswerText.innerHTML = `<strong>Sua Resposta:</strong> ${userAnswers[index] || 'Nenhuma resposta'}`;
        questionDiv.appendChild(userAnswerText);

        const isCorrect = userAnswers[index] === question.answers[question.correctAnswer];
        const resultText = document.createElement('p');
        resultText.innerHTML = `<strong>Resposta: </strong>${isCorrect ? 'Correta' : 'Errado'}`;
        questionDiv.appendChild(resultText);

        const correctAnswerText = document.createElement('p');
        correctAnswerText.innerHTML = `<strong>Resposta correta:</strong> ${question.answers[question.correctAnswer]}`;
        questionDiv.appendChild(correctAnswerText);

        const separator = document.createElement('hr');
        questionDiv.appendChild(separator);

        reviewAnswersContainer.appendChild(questionDiv);
    });

    if (user) {
        const userRef = doc(db, 'users', user.uid);
        const simulationRef = doc(db, 'simulations', simulationId); // Referência ao documento do simulado

        getDoc(userRef).then((docSnapshot) => {
            if (docSnapshot.exists()) {
                const currentScoreGlobal = docSnapshot.data().scoreglobal || 0;
                const newScoreGlobal = Math.max(currentScoreGlobal + score, 0);

                updateDoc(userRef, { scoreglobal: newScoreGlobal })
                    .then(() => {
                        console.log('scoreglobal atualizado com sucesso!');
                    })
                    .catch((error) => {
                        console.error('Erro ao atualizar o scoreglobal: ', error);
                    });
            } else {
                setDoc(userRef, { scoreglobal: Math.max(score, 0) })
                    .then(() => {
                        console.log('scoreglobal criado com sucesso!');
                    })
                    .catch((error) => {
                        console.error('Erro ao criar o scoreglobal: ', error);
                    });
            }
        }).catch((error) => {
            console.error('Erro ao buscar documento do usuário: ', error);
        });

        // Salvar os resultados do simulado no Firestore
        setDoc(simulationRef, {
            userId: user.uid,
            score,
            correctAnswers,
            totalQuestions: questions.length,
            answers: userAnswers
        }).then(() => {
            console.log('Resultados do simulado salvos com sucesso!');
        }).catch((error) => {
            console.error('Erro ao salvar resultados do simulado: ', error);
        });
    }

    // Desativa a verificação de visibilidade da aba
    visibilityCheckActive = false;
}

// Função para reiniciar o simulado
function restartSimulado() {
    resultContainer.classList.add('hidden');
    timeoutResult.classList.add('hidden');
    inactiveTabAlert.classList.add('hidden'); // Garante que o alerta de aba inativa está oculto
    questionContainer.classList.remove('hidden');
    startSimulado();
}

// Função para verificar a autenticação do usuário
function checkAuth() {
    onAuthStateChanged(auth, (userAuth) => {
        user = userAuth;
        if (user) {
            showStartButton();
        } else {
            showLoginAlert();
        }
    });
}

// Função para lidar com a mudança de visibilidade da aba
function handleVisibilityChange() {
    if (visibilityCheckActive) {
        if (document.hidden) {
            inactiveTabAlert.classList.remove('hidden');
            if (!penaltyApplied) {
                applyPenalty("A aba está inativa, você perdeu 10 pontos devido à troca de aba. Por favor, caso você pretende trapaciar ou fazer alguma outra coisa, saia do simulado antes de entrar em outra aba ou guia.");
            }
        } else {
            inactiveTabAlert.classList.add('hidden');
        }
    }
}

// Adiciona o listener para mudanças de visibilidade
document.addEventListener('visibilitychange', handleVisibilityChange);

// Eventos dos botões
startButton.addEventListener('click', startSimulado);
loginRedirectButton.addEventListener('click', () => {
    window.location.href = 'auth.html';
});
homeButton.addEventListener('click', () => {
    window.location.href = 'Simulado-Rankeado.html';
});
fazerButton.addEventListener('click', restartSimulado);
retryButton.addEventListener('click', restartSimulado);
backToSimuladoButton.addEventListener('click', () => {
    // Esconde o alerta e volta ao simulado
    inactiveTabAlert.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    restartTimer(); // Reinicia o temporizador se necessário
});

// Verifica a autenticação do usuário ao carregar a página
checkAuth();
