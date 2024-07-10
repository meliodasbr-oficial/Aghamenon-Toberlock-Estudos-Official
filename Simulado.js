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
        image: "/monalisa.jpg",
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
        question: "Leia o texto abaixo para responder à questão.\n\nA agricultura urbana é uma prática crescente em diversas cidades ao redor do mundo. Além de contribuir para a segurança alimentar local, ela desempenha um papel crucial na sustentabilidade urbana, promovendo a redução da pegada de carbono e o uso eficiente dos recursos naturais disponíveis nas áreas urbanas. Um dos desafios enfrentados por agricultores urbanos é a qualidade do solo, que muitas vezes é prejudicada pela contaminação e pela falta de nutrientes essenciais. Para mitigar esses problemas, são adotadas técnicas como o uso de compostagem, que transforma resíduos orgânicos em adubo rico em nutrientes para o solo, e a rotação de culturas, que ajuda a manter a fertilidade do solo.\n\nConsiderando as informações do texto, é correto afirmar que a agricultura urbana:",
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
        question: "Leia o trecho abaixo para responder à questão.\n\nNos últimos anos, tem havido um aumento significativo no número de startups voltadas para a economia circular, um modelo econômico que visa maximizar o uso de recursos existentes e minimizar o desperdício. Essas startups não apenas desenvolvem produtos inovadores, mas também reimaginam processos industriais tradicionais para reduzir seu impacto ambiental. Um exemplo disso é a reciclagem de materiais que antes eram considerados resíduos, transformando-os em novos produtos de valor agregado. Além disso, a economia circular fomenta a colaboração entre empresas de diferentes setores, promovendo um ciclo contínuo de inovação e sustentabilidade.\n\nCom base no texto, pode-se inferir que a economia circular:",
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
        question: "Leia o texto abaixo para responder à questão.\n\nA nanotecnologia é um campo da ciência que estuda materiais e dispositivos extremamente pequenos, na escala de nanômetros (um bilionésimo de metro). Essa tecnologia tem aplicações em diversas áreas, desde a medicina até a eletrônica, devido às propriedades únicas dos materiais nanométricos. Um dos desafios enfrentados pelos pesquisadores é garantir a segurança desses materiais, uma vez que seu comportamento pode ser diferente dos materiais convencionais em escala macroscópica. Portanto, são necessários estudos rigorosos para avaliar os potenciais impactos ambientais e de saúde associados ao uso da nanotecnologia.\n\nCom base no texto, pode-se afirmar que um dos desafios da nanotecnologia é:",
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
        image: "/A noite Estrelada.jpg",
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
    },
    {
        question: "A imagem acima faz referência a momentos de tensão na política externa Brasileira durante o século XIX(19). Um desses episódios envolveu a Inglaterra na chamada Questão Christie (1863) e foi deflagrada pela",
        image: "/Questao-de-historia.jpg",
        answers: [
            { text: "resistência das elites escravistas brasileiras em extinguir o tráfico de africanos, gerando descontentamento entre os diplomatas ingleses.", correct: false },
            { text: "decisão do governo brasileiro de não renovar o tratado de comércio com a Inglaterra, favorecendo a situação financeira do governo imperial.", correct: false },
            { text: "aprovação da lei Bill Aberdeen pelo Parlamento inglês, proibindo o tráfico de escravos no Atlântico, sob pena de apreensão de navios negreiros.", correct: false },
            { text: "pilhagem da carga de um navio inglês naufragado no Brasil e pelo aprisionamento, pela Inglaterra, de navios brasileiros no Rio de Janeiro.", correct: true }
        ]
    },
    {
        question: "A Lei de Terras, aprovada em 1850, duas semanas após a proibição do tráfico de escravos, tentou pôr ordem na confusão existente em matéria de propriedade rural, determinando que, no futuro, as terras públicas fossem vendidas e não doadas, como acontecera com as antigas sesmarias, estabeleceu normas para legalizar a posse de terras e procurou forçar o registro das propriedades.\n\nSobre essa Lei de Terras é correto afirmar que",
        image: null,
        answers: [
            { text: "Sua promulgação coincidiu com a Lei Eusébio de Queiroz, mas não há nenhuma relação de causalidade entre ambas.", correct: false },
            { text: "Ao entrar em vigor, não foi respeitada, podendo ser considerada mais uma ''lei para inglês ver''.", correct: false },
            { text: "Sua promulgação foi concebida como uma forma de evitar o acesso à propriedade da terra por parte de futuros imigrantes.", correct: true },
            { text: "Sua aprovação naquele momento decorreu de os Estados Unidos terem acabado de aprovar uma lei de terras para o seu território.", correct: false }
        ]
    },
    {
        question: "O ano de 1848 assistiu a várias revoluções na Europa como, por exemplo, na França e na Itália. O espírito ''quarenta e oito'', como se chamou este período, também atingiu o Brasil e, particularmente, Pernambuco. Esta questão diz respeito à Revolução Praieira.",
        image: null,
        answers: [
            { text: "Os revolucionários praieiros pretendiam que o Governo interviesse nos fenômenos de produção, distribuição e comércio promovendo nosso retorno à condição de colônia.", correct: false },
            { text: "Os revolucionários de Pernambuco lançaram um ''Manifesto ao Mundo'' esclarecendo suas posições no que diz respeito ao voto universal do povo brasileiro, ao trabalho como garantia de vida para o cidadão brasileiro e à reforma do poder judicial dentre outras.", correct: true },
            { text: "O Partido da Praia, integrado por conservadores pernambucanos, tinha no jornal o Diário Novo um instrumento de veiculação de suas ideias políticas.", correct: false },
            { text: "A concentração da propriedade fundiária e a permanência da gestão holandesa em Pernambuco foram fatores que provocaram a Revolução Praieira.", correct: false }
        ]
    },
    {
        question: "Na segunda metade do século XIX, o governo brasileiro realizou uma série de iniciativas, no que diz respeito ao desenvolvimento urbano. Sobre esta questão, assinale a alternativa correta.",
        image: null,
        answers: [
            { text: "Grandes empreendimentos fluviais surgiram, fundamentados na vasta rede hidrográfica que o país possui - o Rio São Francisco e o Rio Araguaia, são exemplos de navegabilidade sem dificuldades.", correct: false },
            { text: "Construções de represas, aproveitando o potencial hidrográfico dos rios São Francisco, Amazonas e Paraná para a produção de energia, facilitaram a industrialização.", correct: false },
            { text: "A navegação marítima, o transporte terrestre, incluindo as ferrovias, a iluminação a gás e o abastecimento d água foram algumas iniciativas que mudaram a face das grandes cidades do país.", correct: true },
            { text: "O desenvolvimento de uma malha ferroviária, não apenas para escoar a produção agrícola, mas para ligar regiões, possibilitou o crescimento industrial em regiões interioranas.", correct: false }
        ]
    },
    {
        question: "O descontentamento do Exército, que culminou na Questão Militar no final do Império, pode ser atribuído",
        image: null,
        answers: [
            { text: "à predominância do poder civil que não prestigiava os militares e lhes proibia o debate político pela imprensa.", correct: true },
            { text: "às pressões exercidas pela Igreja junto aos militares para abolir a monarquia.", correct: false },
            { text: "à propaganda do militarismo sul-americano na imprensa brasileira.", correct: false },
            { text: "às tendências ultrademocráticas das forças armadas, que desejavam conceder maior participação política aos analfabetos.", correct: false }
        ]
    },
    {
        question: "A chamada ''Questão Religiosa'', ocorrida durante o Segundo Reinado, foi uma disputa entre o Estado Imperial e a Igreja Católica devido à",
        image: null,
        answers: [
            { text: "rejeição, pelo governo, dos dispositivos da bula Syllabus, baixada pelo papa Pio IX, que proibia a permanência de membros da maçonaria dentro dos quadros da Igreja.", correct: true },
            { text: "rejeição da encíclica Rerum Novarum, baixada pelo papa Leão XIII, que defendia a coexistência harmoniosa do capital e do trabalho, no sentido de evitar a luta de classes.", correct: false },
            { text: "adesão do governo imperial aos ditames do Tratado de Latrão, que limitava os poderes da Igreja expressos na instituição do Padroado.", correct: false },
            { text: "recusa do governo de Dom Pedro II em aceitar as manobras parlamentares dos deputados católicos, visando à extinção do direito do Padroado.", correct: false }
        ]
    },
    {
        question: "A estabilidade do Império brasileiro após 1850 favoreceu o crescimento e a prosperidade econômica. Nesse período, os empreendimentos econômicos mais arrojados partiram do barão de Mauá, que construiu ferrovias, criou bancos, investiu na navegação fluvial. Contudo, as iniciativas de Mauá na área industrial encontraram fortes obstáculos, a saber:",
        image: null,
        answers: [
            { text: "a carência de mão de obra assalariada e a concorrência das manufaturas inglesas, favorecidas pelas taxas de importação.", correct: true },
            { text: "a expansão da cafeicultura no Oeste paulista e o início da organização do movimento operário.", correct: false },
            { text: "a tarifa alfandegária benéfica à produção nacional e o declínio da economia açucareira da região Nordeste.", correct: false },
            { text: "a concorrência com a emergente produção industrial do Paraguai.", correct: false }
        ]
    },
    {
        question: "Em qual das frases a seguir a crase está empregada corretamente?",
        image: null,
        answers: [
            { text: "A reunião será à partir das 14h.", correct: false },
            { text: "Vou à escola todos os dias.", correct: true },
            { text: "Ela entregou o trabalho à tempo.", correct: false },
            { text: "Fomos à praia no final de semana passada.", correct: false }
        ]
    },
    {
        question: "Qual das opções apresenta um exemplo correto de voz passiva analítica?",
        image: null,
        answers: [
            { text: "As provas foram corrigidas pelo professor.", correct: true },
            { text: "O professor corrigiu as provas.", correct: false },
            { text: "Corrigiram as provas.", correct: false },
            { text: "As provas estão corrigindo.", correct: false }
        ]
    },
    {
        question: "Qual das frases a seguir apresenta um exemplo de regência nominal correta?",
        image: null,
        answers: [
            { text: "Ela é fiel a seus princípios.", correct: true },
            { text: "Ele é ansioso com a viagem.", correct: false },
            { text: "A professora é rigorosa em os alunos.", correct: false },
            { text: "João está atento com os detalhes.", correct: false }
        ]
    },
    {
        question: "Qual das opções contém um exemplo correto de concordância verbal?",
        image: null,
        answers: [
            { text: "Fazem dois anos que não nos vemos.", correct: true },
            { text: "A maioria das pessoas concordaram com a decisão.", correct: false },
            { text: "Houveram muitos problemas na execução do projeto.", correct: false },
            { text: "Fui eu que fez o trabalho.", correct: false }
        ]
    },
    {
        question: "Em qual das opções a vírgula está corretamente empregada?",
        image: null,
        answers: [
            { text: "Se você for, eu também vou.", correct: true },
            { text: "Ela gosta de ler, e de escrever.", correct: false },
            { text: "O filme, que assistimos ontem foi emocionante.", correct: false },
            { text: "Pedro foi ao mercado comprar frutas e verduras, para o jantar.", correct: false }
        ]
    },
    {
        question: "Qual das frases apresenta a correta flexão do verbo ''intervir'' no pretérito perfeito do indicativo?",
        image: null,
        answers: [
            { text: "Ele interviu na reunião.", correct: false },
            { text: "Nós interviemos no conflito.", correct: false },
            { text: "Ela interveio na discussão.", correct: true },
            { text: "Eu intervi a situação.", correct: false }
        ]
    }

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
