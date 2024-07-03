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
    },
    {
        question: "Um tipo de semente necessita de bastante água nos dois primeiros meses após o plantio. Um produtor pretende estabelecer o melhor momento para o plantio desse tipo de semente, nos meses de outubro a março. Após consultar a previsão do índice mensal de precipitação de chuva (ImPC) da região onde ocorrerá o plantio, para o período chuvoso de 2020-2021, ele obteve os seguintes dados:\n\n• outubro/2020: ImPC = 250 mm;\n• novembro/2020: ImPC = 150 mm;\n• dezembro/2020: ImPC = 200 mm;\n• janeiro/2021: ImPC = 450 mm;\n• fevereiro/2021: ImPC = 100 mm;\n• março/2021: ImPC = 200 mm.\n\nCom base nessas previsões, ele precisa escolher dois meses consecutivos em que a média mensal de precipitação seja a maior possível.\nNo início de qual desses meses o produtor deverá plantar esse tipo de semente?",
        image: null,
        answers: [
            { text: "outubro", correct: false },
            { text: "novembro", correct: false },
            { text: "dezembro", correct: true },
            { text: "janeiro", correct: false }
        ]
    },
    {
        question: "Leia o texto abaixo para responder à questão.\n\nA agricultura urbana é uma prática crescente em diversas cidades ao redor do mundo. Além de contribuir para a segurança alimentar local, ela desempenha um papel crucial na sustentabilidade urbana, promovendo a redução da pegada de carbono e o uso eficiente dos recursos naturais disponíveis nas áreas urbanas. Um dos desafios enfrentados por agricultores urbanos é a qualidade do solo, que muitas vezes é prejudicada pela contaminação e pela falta de nutrientes essenciais. Para mitigar esses problemas, são adotadas técnicas como o uso de compostagem, que transforma resíduos orgânicos em adubo rico em nutrientes para o solo, e a rotação de culturas, que ajuda a manter a fertilidade do solo.\n\nConsiderando as informações do texto, é correto afirmar que a agricultura urbana:\n\nA) Aumenta a pegada de carbono nas cidades.\nB) Não contribui para a segurança alimentar local.\nC) Não enfrenta desafios relacionados à qualidade do solo.\nD) Promove a sustentabilidade urbana.\nE) Reduz a eficiência no uso de recursos naturais.",
        image: null,
        answers: [
            { text: "Aumenta a pegada de carbono nas cidades.", correct: false },
            { text: "Não contribui para a segurança alimentar local.", correct: false },
            { text: "Não enfrenta desafios relacionados à qualidade do solo.", correct: false },
            { text: "Promove a sustentabilidade urbana.", correct: true },
            { text: "Reduz a eficiência no uso de recursos naturais.", correct: false }
        ]
    },
    {
        question: "Leia o trecho abaixo para responder à questão.\n\nNos últimos anos, tem havido um aumento significativo no número de startups voltadas para a economia circular, um modelo econômico que visa maximizar o uso de recursos existentes e minimizar o desperdício. Essas startups não apenas desenvolvem produtos inovadores, mas também reimaginam processos industriais tradicionais para reduzir seu impacto ambiental. Um exemplo disso é a reciclagem de materiais que antes eram considerados resíduos, transformando-os em novos produtos de valor agregado. Além disso, a economia circular fomenta a colaboração entre empresas de diferentes setores, promovendo um ciclo contínuo de inovação e sustentabilidade.\n\nCom base no texto, pode-se inferir que a economia circular:\n\nA) Prioriza o aumento do desperdício de recursos.\nB) Ignora a necessidade de colaboração entre empresas.\nC) Fomenta a inovação e a sustentabilidade.\nD) Reduz a importância de produtos inovadores.\nE) Aumenta o impacto ambiental dos processos industriais.",
        image: null,
        answers: [
            { text: "Prioriza o aumento do desperdício de recursos.", correct: false },
            { text: "Ignora a necessidade de colaboração entre empresas.", correct: false },
            { text: "Fomenta a inovação e a sustentabilidade.", correct: true },
            { text: "Reduz a importância de produtos inovadores.", correct: false },
            { text: "Aumenta o impacto ambiental dos processos industriais.", correct: false }
        ]
    },
    {
        question: "Leia o texto abaixo para responder à questão.\n\nA nanotecnologia é um campo da ciência que estuda materiais e dispositivos extremamente pequenos, na escala de nanômetros (um bilionésimo de metro). Essa tecnologia tem aplicações em diversas áreas, desde a medicina até a eletrônica, devido às propriedades únicas dos materiais nanométricos. Um dos desafios enfrentados pelos pesquisadores é garantir a segurança desses materiais, uma vez que seu comportamento pode ser diferente dos materiais convencionais em escala macroscópica. Portanto, são necessários estudos rigorosos para avaliar os potenciais impactos ambientais e de saúde associados ao uso da nanotecnologia.\n\nCom base no texto, pode-se afirmar que um dos desafios da nanotecnologia é:\n\nA) A falta de aplicações práticas.\nB) A manipulação de materiais em grande escala.\nC) A ausência de propriedades únicas dos materiais nanométricos.\nD) A garantia da segurança dos materiais.\nE) A resistência dos materiais à eletrônica convencional.",
        image: null,
        answers: [
            { text: "A falta de aplicações práticas.", correct: false },
            { text: "A manipulação de materiais em grande escala.", correct: false },
            { text: "A ausência de propriedades únicas dos materiais nanométricos.", correct: false },
            { text: "A garantia da segurança dos materiais.", correct: true },
            { text: "A resistência dos materiais à eletrônica convencional.", correct: false }
        ]
    },
    {
        question: "Qual é a derivada de x²?",
        image: null,
        answers: [
            { text: "2x", correct: true },
            { text: "x", correct: false },
            { text: "x³", correct: false },
            { text: "2", correct: false }
        ]
    },
    {
        question: "Qual é o valor de 7³?",
        image: null,
        answers: [
            { text: "21", correct: false },
            { text: "343", correct: true },
            { text: "49", correct: false },
            { text: "729", correct: false }
        ]
    },
    {
        question: "O movimento migratório que resultou na ocupação do Oeste dos Estados Unidos no século XIX é conhecido como:",
        image: null,
        answers: [
            { text: "Gold Rush", correct: false },
            { text: "Marcha para o Oeste", correct: true },
            { text: "Guerra Civil", correct: false },
            { text: "Manifest Destiny", correct: false }
        ]
    },
    {
        question: "Qual é a função principal do ribossomo?",
        image: null,
        answers: [
            { text: "Produção de energia", correct: false },
            { text: "Síntese de proteínas", correct: true },
            { text: "Armazenamento de lipídios", correct: false },
            { text: "Transporte de substâncias", correct: false }
        ]
    },
    {
        question: "Quem pintou 'A Noite Estrelada'?",
        image: null,
        answers: [
            { text: "Vincent van Gogh", correct: true },
            { text: "Pablo Picasso", correct: false },
            { text: "Claude Monet", correct: false },
            { text: "Leonardo da Vinci", correct: false }
        ]
    },
    {
        question: "Qual é o elemento mais abundante no universo?",
        image: null,
        answers: [
            { text: "Hidrogênio", correct: true },
            { text: "Oxigênio", correct: false },
            { text: "Carbono", correct: false },
            { text: "Hélio", correct: false }
        ]
    },
    {
        question: "Qual é o valor de π (pi) aproximadamente?",
        image: null,
        answers: [
            { text: "3,14", correct: true },
            { text: "2,17", correct: false },
            { text: "1,62", correct: false },
            { text: "4,18", correct: false }
        ]
    },
    {
        question: "Qual é o maior oceano da Terra?",
        image: null,
        answers: [
            { text: "Atlântico", correct: false },
            { text: "Pacífico", correct: true },
            { text: "Índico", correct: false },
            { text: "Ártico", correct: false }
        ]
    },
    {
        question: "Qual é a fórmula da área de um triângulo?",
        image: null,
        answers: [
            { text: "base x altura / 2", correct: true },
            { text: "base x altura", correct: false },
            { text: "base + altura / 2", correct: false },
            { text: "base + altura", correct: false }
        ]
    },
    {
        question: "Qual é o principal gás responsável pelo efeito estufa?",
        image: null,
        answers: [
            { text: "Dióxido de carbono", correct: true },
            { text: "Oxigênio", correct: false },
            { text: "Nitrogênio", correct: false },
            { text: "Hidrogênio", correct: false }
        ]
    },
    {
        question: "Quem foi o responsável pela teoria da relatividade?",
        image: null,
        answers: [
            { text: "Isaac Newton", correct: false },
            { text: "Albert Einstein", correct: true },
            { text: "Galileu Galilei", correct: false },
            { text: "Niels Bohr", correct: false }
        ]
    },
    {
        question: "Qual é a fórmula química da glicose?",
        image: null,
        answers: [
            { text: "C6H12O6", correct: true },
            { text: "C12H22O11", correct: false },
            { text: "H2O", correct: false },
            { text: "CH4", correct: false }
        ]
    },
    {
        question: "Qual é a principal função do pâncreas no sistema digestivo?",
        image: null,
        answers: [
            { text: "Produção de bile", correct: false },
            { text: "Produção de insulina", correct: true },
            { text: "Absorção de nutrientes", correct: false },
            { text: "Produção de ácido clorídrico", correct: false }
        ]
    },
    {
        question: "Qual é o elemento químico com símbolo 'Fe'?",
        image: null,
        answers: [
            { text: "Ferro", correct: true },
            { text: "Flúor", correct: false },
            { text: "Fósforo", correct: false },
            { text: "Francium", correct: false }
        ]
    },
    {
        question: "Qual é o resultado da expressão 3x² - 2x + 1 quando x = 2?",
        image: null,
        answers: [
            { text: "9", correct: false },
            { text: "11", correct: true },
            { text: "15", correct: false },
            { text: "17", correct: false }
        ]
    },
    {
        question: "Em que ano aconteceu a Proclamação da República no Brasil?",
        image: null,
        answers: [
            { text: "1889", correct: true },
            { text: "1822", correct: false },
            { text: "1964", correct: false },
            { text: "1500", correct: false }
        ]
    },
    {
        question: "Qual é a fórmula química do gás carbônico?",
        image: null,
        answers: [
            { text: "CO2", correct: true },
            { text: "O2", correct: false },
            { text: "H2O", correct: false },
            { text: "CH4", correct: false }
        ]
    },
    {
        question: "Qual foi o principal objetivo da Revolução Francesa?",
        image: null,
        answers: [
            { text: "Abolir a monarquia e estabelecer uma república", correct: true },
            { text: "Expandir o território francês", correct: false },
            { text: "Fortalecer a monarquia", correct: false },
            { text: "Promover a industrialização", correct: false }
        ]
    }
    // Adicione mais perguntas conforme necessário
];

let selectedQuestions = [];
let userAnswers = [];
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let totalQuestions = questions.length; // Definir o número correto de perguntas (de acordo com o exemplo)
let timer;
let timeRemaining = 360;
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
    timeRemaining = 360;
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
        score += 25; 
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
    timeRemaining = 360;
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
