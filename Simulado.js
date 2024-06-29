const questions = [
    {
        question: "Qual é a fórmula da água?",
        image: null,
        answers: [
            { text: "H2O", correct: true },
            { text: "CO2", correct: false },
            { text: "O2", correct: false },
            { text: "H2SO4", correct: false }
        ]
    },
    {
        question: "Quem pintou a Mona Lisa?",
        image: null,
        answers: [
            { text: "Leonardo da Vinci", correct: true },
            { text: "Vincent van Gogh", correct: false },
            { text: "Pablo Picasso", correct: false },
            { text: "Claude Monet", correct: false }
        ]
    },
    {
        question: "Qual é a capital do Brasil?",
        image: null,
        answers: [
            { text: "Brasília", correct: true },
            { text: "Rio de Janeiro", correct: false },
            { text: "São Paulo", correct: false },
            { text: "Salvador", correct: false }
        ]
    },
    {
        question: "Qual é o maior planeta do sistema solar?",
        image: null,
        answers: [
            { text: "Júpiter", correct: true },
            { text: "Saturno", correct: false },
            { text: "Terra", correct: false },
            { text: "Marte", correct: false }
        ]
    },
    {
        question: "Qual é a unidade básica da vida?",
        image: null,
        answers: [
            { text: "Célula", correct: true },
            { text: "Molécula", correct: false },
            { text: "Átomo", correct: false },
            { text: "Organelo", correct: false }
        ]
    }
];

let selectedQuestions = [];
let userAnswers = [];
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let totalQuestions = 5; // Definir o número correto de perguntas (de acordo com o exemplo)
let timer;
let timeRemaining = 40;
let startTime; // Variável para registrar o tempo de início do simulado
let endTime; // Variável para registrar o tempo de término do simulado

const welcomeContainer = document.getElementById('welcome-container');
const questionContainer = document.getElementById('question-container');
const resultContainer = document.getElementById('result-container');
const questionElement = document.getElementById('question');
const questionImageElement = document.getElementById('question-image');
const answerButtonsElement = document.getElementById('answers');
const nextButton = document.getElementById('next-button');
const scoreElement = document.getElementById('score');
const correctAnswersElement = document.getElementById('correct-answers');
const totalQuestionsElement = document.getElementById('total-questions');
const retryButton = document.getElementById('retry-button');
const startButton = document.getElementById('start-button');
const homeButton = document.getElementById('home-button');
const timerElement = document.getElementById('time');
const reviewAnswersElement = document.getElementById('review-answers');

startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < selectedQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
});
retryButton.addEventListener('click', startQuiz);
homeButton.addEventListener('click', goToHome);

function startQuiz() {
    startTime = new Date(); // Registra o tempo de início do simulado
    welcomeContainer.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    userAnswers = [];
    selectedQuestions = selectRandomQuestions(questions, totalQuestions);
    showQuestion();
    startTimer();
}

function goToHome() {
    welcomeContainer.classList.remove('hidden');
    questionContainer.classList.add('hidden');
    resultContainer.classList.add('hidden');
}

function selectRandomQuestions(questions, num) {
    let selected = [];
    let shuffledQuestions = [];
    while (shuffledQuestions.length < num) {
        let randomIndex = Math.floor(Math.random() * questions.length);
        if (!selected.includes(randomIndex)) {
            selected.push(randomIndex);
            shuffledQuestions.push(questions[randomIndex]);
        }
    }
    return shuffledQuestions;
}

function showQuestion() {
    resetState();
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;
    if (currentQuestion.image) {
        questionImageElement.src = currentQuestion.image;
        questionImageElement.classList.remove('hidden');
    } else {
        questionImageElement.classList.add('hidden');
    }
    
    const shuffledAnswers = shuffle(currentQuestion.answers);
    
    shuffledAnswers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.innerText = `${String.fromCharCode(65 + index)}) ${answer.text}`; // A partir de 'A'
        button.classList.add('answer-button');
        button.dataset.correct = answer.correct;
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
    nextButton.classList.add('hidden');
    timeRemaining = 40;
    timerElement.innerText = timeRemaining;
}

function resetState() {
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
    clearStatusClass(document.body);
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';

    const alreadySelected = answerButtonsElement.querySelector('.selected');
    if (alreadySelected) {
        alreadySelected.classList.remove('selected');
    }

    selectedButton.classList.add('selected');

    userAnswers[currentQuestionIndex] = {
        question: selectedQuestions[currentQuestionIndex].question,
        selectedAnswer: selectedButton.innerText,
        correctAnswer: correct ? 'Sim' : 'Não'
    };

    if (correct) {
        score += 50; 
        correctAnswers++;
    }

    if (currentQuestionIndex < selectedQuestions.length - 1) {
        nextButton.innerText = 'Próxima Pergunta';
        nextButton.classList.remove('hidden');
    } else {
        nextButton.innerText = 'Finalizar';
        nextButton.classList.remove('hidden');
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function showResult() {
    stopTimer();
    endTime = new Date(); 
    const totalTime = (endTime - startTime) / 1000;

    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    scoreElement.innerText = score;
    correctAnswersElement.innerText = correctAnswers;
    totalQuestionsElement.innerText = totalQuestions;
    showReviewAnswers();

    const timeTakenElement = document.getElementById('time-taken');
    timeTakenElement.innerText = `Tempo total: ${totalTime.toFixed(1)} segundos`;
}

function showReviewAnswers() {
    reviewAnswersElement.innerHTML = '';
    userAnswers.forEach((answer, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.innerHTML = `<strong>Pergunta ${index + 1}:</strong> ${answer.question} <br> 
                               <strong>Resposta selecionada:</strong> ${answer.selectedAnswer} <br>
                               <strong>Correta:</strong> ${answer.correctAnswer} <br><br>`;
        reviewAnswersElement.appendChild(answerDiv);
    });
}

function startTimer() {
    timer = setInterval(() => {
        timeRemaining--;
        timerElement.innerText = timeRemaining;
        if (timeRemaining === 0) {
            clearInterval(timer);
            showResult();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timeRemaining = 40;
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
