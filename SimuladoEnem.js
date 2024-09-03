import { auth } from './firebaseConfig.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

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

const db = getFirestore();

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

// Lista de questões (exemplo)
const questions = [
    {
        question: "(ENEM - 2023)\n A sessão do Comitê Olímpico Internacional (COI) aprovou uma mudança histórica e inédita no lema olímpico, criado em 1894 pelo Barão Pierre de Coubertin para expressar os valores e a excelência do esporte. Mais de 120 anos depois, o lema tem sua primeira alteração para ressaltar a solidariedade e incluir a palavra “juntos”: mais rápido, mais alto, mais forte — juntos. A mudança foi aprovada por unanimidade pelos membros do COI e celebrada pelo presidente da entidade. \n\n De acordo com o texto, a alteração do lema olímpico teve como objetivo a",
        answers: ["unificação do lema anterior ao atual.", "aproximação entre o lema olímpico e o COI.", "junção do lema olímpico com os princípios esportivos.", "associação entre o lema olímpico e a cooperatividade.", "vinculação entre o lema olímpico e os eventos atléticos."],
        correctAnswer: 0
    },
    {
        question: "(ENEM - 2023)\n Mais iluminada que outras \n Tenho dois seios, estas duas coxas, duas mãos que me são muito úteis, olhos escuros, estas duas sobrancelhas que preencho com maquiagem comprada por dezenove e noventa e orelhas que não aceitam bijuterias. Este corpo é um corpo faminto, dentado, cruel, capaz e violento. Movo os braços e multidões correm desesperadas. Caminho no escuro com o rosto para baixo, pois cada parte isolada de mim tem sua própria vida e não quero domá-las. Animal da caatinga. Forte demais. Engolidora de espadas e espinhos.\n\n Dizem e eu ouvi, mas depois também li, que o estado do Ceará aboliu a escravidão quatro anos antes do restante do país. Todos aqueles corpos que eram trazidos com seus dedos contados, seus calcanhares prontos e seus umbigos em fogo, todos eles foram interrompidos no porto. Um homem — dizem e eu ouvi e depois também li — liderou o levante. E todos esses corpos foram buscar outros incômodos. Foram ser incomodados.\n\n Nesse texto, os recursos expressivos usados pela narradora.",
        answers: ["revelam as marcas da violência de raça e de gênero na construção da identidade.", "questionam o pioneirismo do estado do Ceará no enfrentamento à escravidão.", "reproduzem padrões estéticos em busca da valorização da autoestima feminina.", "sugerem uma atmosfera onírica alinhada ao desejo de resgate da espiritualidade.", "mimetizam, na paisagem, os corpos transformados pela violência da escravidão."],
        correctAnswer: 0
    },
    {
        question: "(ENEM - 2023)\n De quem é esta língua?\n\nUma pequena editora brasileira, a Urutau, acaba de lançar em Lisboa uma “antologia antirracista de poetas estrangeiros em Portugal”, com o título Volta para a tua terra.\n O livro denuncia as diversas formas de racismo a que os imigrantes estão sujeitos. Alguns dos poetas brasileiros antologiados queixam-se do desdém com que um grande número de portugueses acolhe o português brasileiro. É uma queixa frequente.\n “Aqui em Portugal eles dizem / — eles dizem — / que nosso português é errado, que nós não falamos português”, escreve a poetisa paulista Maria Giulia Pinheiro, para concluir: “Se a sua linguagem, a lusitana, / ainda conserva a palavra da opressão / ela não é a mais bonita do mundo./ Ela é uma das mais violentas”.\n\n O texto de Agualusa tematiza o preconceito em relação ao português brasileiro. Com base no trecho citado pelo autor, infere-se que esse preconceito se deve",
        answers: ["à dificuldade de consolidação da literatura brasileira em outros países.", "aos diferentes graus de instrução formal entre os falantes de língua portuguesa.", "à existência de uma língua ideal que alguns falantes lusitanos creem ser a falada em Portugal.", "ao intercâmbio cultural que ocorre entre os povos dos diferentes países de língua portuguesa.", "à distância territorial entre os falantes do português que vivem em Portugal e no Brasil."],
        correctAnswer: 0
    },
    // Adicione mais questões conforme necessário
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showLoginAlert() {
    welcomeContainer.classList.add('hidden');
    loginAlert.classList.remove('hidden');
    startButton.classList.add('hidden');
}

function showStartButton() {
    welcomeContainer.classList.remove('hidden');
    loginAlert.classList.add('hidden');
    startButton.classList.remove('hidden');
}

function startSimulado() {
    simulationId = Date.now().toString();
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
    
    // Atualiza o total de perguntas no elemento total-questions
    totalQuestionsElement.textContent = questions.length.toString();
    
    // Atualiza o total de perguntas no elemento total-questions-span
    const totalQuestionsSpan = document.getElementById('total-questions-span');
    if (totalQuestionsSpan) {
        totalQuestionsSpan.textContent = questions.length.toString();
    }

    shuffleArray(questions);
    showQuestion();
    restartTimer();

    visibilityCheckActive = true;
}


function restartTimer() {
    if (timer) {
        clearInterval(timer);
    }
    startTimer();
}

function startTimer() {
    penaltyApplied = false;
    const timeLimit = 2 * 60 * 1000;
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

function disableAnswerButtons() {
    const buttons = answersContainer.querySelectorAll('.answer-button');
    buttons.forEach(button => button.disabled = true);
}

function enableAnswerButtons() {
    const buttons = answersContainer.querySelectorAll('.answer-button');
    buttons.forEach(button => button.disabled = false);
}

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

function resetQuestion() {
    answersContainer.innerHTML = '';
    enableAnswerButtons();
    nextButton.classList.add('hidden');
}

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
                    const currentScoreEnem = docSnapshot.data().scoreenem || 0;
                    const newScoreEnem = Math.max(currentScoreEnem - 10, 0);

                    updateDoc(userRef, { scoreenem: newScoreEnem })
                        .then(() => {
                            console.log('scoreenem atualizado com sucesso!');
                            showTimeoutResult();
                        })
                        .catch((error) => {
                            console.error('Erro ao atualizar o scoreenem: ', error);
                        });
                } else {
                    setDoc(userRef, { scoreenem: Math.max(score, 0) })
                        .then(() => {
                            console.log('scoreenem criado com sucesso!');
                            showTimeoutResult();
                        })
                        .catch((error) => {
                            console.error('Erro ao criar o scoreenem: ', error);
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

function showTimeoutResult() {
    questionContainer.classList.add('hidden');
    resultContainer.classList.add('hidden');
    timeoutResult.classList.remove('hidden');
    inactiveTabAlert.classList.add('hidden');
    timeElement.textContent = '0';
    reviewAnswersContainer.innerHTML = '';
}

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
                const currentScoreEnem = docSnapshot.data().scoreenem || 0;
                const newScoreEnem = Math.max(currentScoreEnem + score, 0);

                updateDoc(userRef, { scoreenem: newScoreEnem })
                    .then(() => {
                        console.log('scoreenem atualizado com sucesso!');
                    })
                    .catch((error) => {
                        console.error('Erro ao atualizar o scoreenem: ', error);
                    });
            } else {
                setDoc(userRef, { scoreenem: Math.max(score, 0) })
                    .then(() => {
                        console.log('scoreenem criado com sucesso!');
                    })
                    .catch((error) => {
                        console.error('Erro ao criar o scoreenem: ', error);
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
