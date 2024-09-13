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
        correctAnswer: 3
    },
    {
        question: "(ENEM - 2023)\n Mais iluminada que outras \n Tenho dois seios, estas duas coxas, duas mãos que me são muito úteis, olhos escuros, estas duas sobrancelhas que preencho com maquiagem comprada por dezenove e noventa e orelhas que não aceitam bijuterias. Este corpo é um corpo faminto, dentado, cruel, capaz e violento. Movo os braços e multidões correm desesperadas. Caminho no escuro com o rosto para baixo, pois cada parte isolada de mim tem sua própria vida e não quero domá-las. Animal da caatinga. Forte demais. Engolidora de espadas e espinhos.\n\n Dizem e eu ouvi, mas depois também li, que o estado do Ceará aboliu a escravidão quatro anos antes do restante do país. Todos aqueles corpos que eram trazidos com seus dedos contados, seus calcanhares prontos e seus umbigos em fogo, todos eles foram interrompidos no porto. Um homem — dizem e eu ouvi e depois também li — liderou o levante. E todos esses corpos foram buscar outros incômodos. Foram ser incomodados.\n\n Nesse texto, os recursos expressivos usados pela narradora.",
        answers: ["revelam as marcas da violência de raça e de gênero na construção da identidade.", "questionam o pioneirismo do estado do Ceará no enfrentamento à escravidão.", "reproduzem padrões estéticos em busca da valorização da autoestima feminina.", "sugerem uma atmosfera onírica alinhada ao desejo de resgate da espiritualidade.", "mimetizam, na paisagem, os corpos transformados pela violência da escravidão."],
        correctAnswer: 0
    },
    {
        question: "(ENEM - 2023)\n De quem é esta língua?\n\nUma pequena editora brasileira, a Urutau, acaba de lançar em Lisboa uma “antologia antirracista de poetas estrangeiros em Portugal”, com o título Volta para a tua terra.\n O livro denuncia as diversas formas de racismo a que os imigrantes estão sujeitos. Alguns dos poetas brasileiros antologiados queixam-se do desdém com que um grande número de portugueses acolhe o português brasileiro. É uma queixa frequente.\n “Aqui em Portugal eles dizem / — eles dizem — / que nosso português é errado, que nós não falamos português”, escreve a poetisa paulista Maria Giulia Pinheiro, para concluir: “Se a sua linguagem, a lusitana, / ainda conserva a palavra da opressão / ela não é a mais bonita do mundo./ Ela é uma das mais violentas”.\n\n O texto de Agualusa tematiza o preconceito em relação ao português brasileiro. Com base no trecho citado pelo autor, infere-se que esse preconceito se deve",
        answers: ["à dificuldade de consolidação da literatura brasileira em outros países.", "aos diferentes graus de instrução formal entre os falantes de língua portuguesa.", "à existência de uma língua ideal que alguns falantes lusitanos creem ser a falada em Portugal.", "ao intercâmbio cultural que ocorre entre os povos dos diferentes países de língua portuguesa.", "à distância territorial entre os falantes do português que vivem em Portugal e no Brasil."],
        correctAnswer: 2
    },
    {
        question:"(ENEM - 2023)\n Na Idade Média, as notícias se propagavam com surpreendente eficácia.Segundo uma emérita professora de Sorbonne, um cavalo era capaz de percorrer 30 quilômetros por dia, mas o tempo podia se acelerar dependendo do interesse da notícia. As ordens mendicantes tinham um papel importante na disseminação de informações, assim como os jograis, os peregrinos e os vagabundos, porque todos eles percorriam grandes distâncias. As cidades também tinham correios organizados e selos para lacrar mensagens e tentar certificar a veracidade das correspondências. Graças a tudo isso, a circulação de boatos era intensa e politicamente relevante. Um exemplo clássico de fake news da era medieval é a história do rei que desaparece na batalha e reaparece muito depois, idoso e transformado.\n\n A propagação sistemática de informações é um fenômeno recorrente na história e no desenvolvimento das sociedades. No texto, a eficácia dessa propagação está diretamente relacionada ao(à)",
        answers: ["velocidade de circulação das notícias.","nível de letramento da população marginalizada.", "poder de censura por parte dos serviços públicos.", "legitimidade da voz dos representantes da nobreza.", "diversidade dos meios disponíveis em uma época histórica."],
        correctAnswer: 4
    },
    {
        question:"(ENEM - 2023)\n Se a interferência de contas falsas em discussões políticas nas redes sociais já representava um perigo para os sistemas democráticos, sua sofisticação e maior semelhança com pessoas reais têm agravado o problema pelo mundo.\n O perigo cresceu porque a tecnologia e os métodos evoluíram dos robôs, os “bots” — softwares com tarefas on-line automatizadas —, para os “ciborgues” ou “trolls”, contas controladas diretamente por humanos com ajuda de um pouco de automação.\n Mas pesquisadores começam agora a observar outros padrões de comportamento: quando mensagens não são programadas, sua publicação se concentra só em horários de trabalho, já que é controlada por pessoas cuja profissão é exatamente essa, administrar um perfil falso durante o dia.\n Outra pista: a pobreza vocabular das mensagens publicadas por esses perfis. Um funcionário de uma empresa que supostamente produzia e vendia perfis falsos explica que às vezes “faltava criatividade” para criar mensagens distintas controlando tantos perfis falsos ao mesmo tempo.\n\nDe acordo com o texto, a análise de características da linguagem empregada por perfis automatizados contribui para o(a)",
        answers:["controle da atuação dos profissionais de TI.","desenvolvimento de tecnologias como os “trolls”.","flexibilização dos turnos de trabalho dos controladores.","necessidade de regulamentação do funcionamento dos “bots”.", "identificação de padrões de disseminação de informações inverídicas."],
        correctAnswer: 4
    },
    {
        question:"(ENEM - 2023)\n Maio foi colorido de amarelo, e o foi porque mundialmente amarelo é a cor convencionada para as advertências. No trânsito, essas advertências têm sido fatais. A estimativa, caso nada seja feito, é a de que se atinjam assustadoras 2,4 milhões de mortes no trânsito em 2030 em todo o mundo.\n A pressa constante, o sentimento de invencibilidade, a certeza de invulnerabilidade, a necessidade de poder, a falta de civilidade, a certeza de impunidade, a ausência de solidariedade, a inexistência de compaixão e o desrespeito por si próprio são circunstâncias reais que, não raro, concorrem para o comportamento violento no trânsito.\n O Maio Amarelo, que preconiza a atenção pela vida, é uma das iniciativas nesse sentido. E é precisamente a atenção pela vida que está esquecida. Essa atenção, por certo, requer menos pressa, mais civilidade, limites assegurados, consciência de vulnerabilidade, solidariedade, compaixão e respeito por si e pelo outro. Reafirmar e praticar esses princípios e valores talvez seja um caminho mais seguro e menos violento, que garanta a vida e não celebre a morte.\n\nConsiderando os procedimentos argumentativos utilizados, infere-se que o objetivo desse texto é",
        answers:["enumerar as causas determinantes da violência no trânsito.", "contextualizar a campanha de advertência no cenário mundial.", "divulgar dados numéricos alarmantes sobre acidentes de trânsito.", "sensibilizar o público para a importância de uma direção responsável.", "restringir os problemas da violência no trânsito a aspectos emocionais."],
        correctAnswer: 3
    },
    {
        question:"(ENEM - 2023)\n Ainda daquela vez pude constatar a bizarrice dos costumes que constituíam as leis mais ou menos constantes do seu mundo: ao me aproximar, verifiquei que o Sr. Timóteo, gordo e suado, trajava um vestido de franjas e lantejoulas que pertencera a sua mãe. O corpete descia-lhe excessivamente justo na cintura, e aqui e ali rebentava através da costura um pouco da carne aprisionada, esgarçando a fazenda e tornando o prazer de vestir-se daquele modo uma autêntica espécie de suplício. Movia-se ele com lentidão, meneando todas as suas franjas e abanando-se vigorosamente com um desses leques de madeira de sândalo, o que o envolvia numa enjoativa onda de perfume. Não sei direito o que colocara sobre a cabeça, assemelhava-se mais a um turbante ou a um chapéu sem abas de onde saíam vigorosas mechas de cabelos alourados. Como era costume seu também, trazia o rosto pintado — e para isto, bem como para suas vestimentas, apoderara-se de todo o guarda-roupa deixado por sua mãe, também em sua época famosa pela extravagância com que se vestia — o que sem dúvida fazia sobressair-lhe o nariz enorme, tão característico da família Meneses.\n\nPela voz de uma empregada da casa, a descrição de um dos membros da família exemplifica a renovação da ficção urbana nos anos 1950, aqui observada na",
        answers:["opção por termos e expressões de sentido ambíguo.","crítica social inspirada pelo convívio com os patrões.","descrição impressionista do fetiche do personagem.","presença de um foco narrativo de caráter impreciso.","ambiência de mistério das relações entre familiares."],
        correctAnswer: 2
    },
    {
        question:"(ENEM - 2023)\nGirassol da madrugada\n\nTeu dedo curioso me segue lento no rosto\nOs sulcos, as sombras machucadas por onde a\n[vida passou.\nQue silêncio, prenda minha... Que desvio triunfal\n[da verdade,\nQue círculos vagarosos na lagoa em que uma asa\n[gratuita roçou...\n\nTive quatro amores eternos...\nO primeiro era moça donzela,\nO segundo... eclipse, boi que fala, cataclisma,\nO terceiro era a rica senhora,\nO quarto és tu... E eu afinal me repousei dos\n[meus cuidados\n\nPerante o outro, o eu lírico revela, na força das memórias evocadas, a",
        answers:["vergonha das marcas provocadas pela passagem do tempo.","indecisão em face das possibilidades afetivas do presente.", "serenidade sedimentada pela entrega pacífica ao desejo.", "frustração causada pela vontade de retorno ao passado.", "disponibilidade para a exploração do prazer efêmero."],
        correctAnswer: 2
    },
    {
        question:"(ENEM - 2023)\nDão Lalalão\n\n Do povoado do Ão, ou dos sítios perto, alguém precisava urgente de querer vir por escutar a novela do rádio. Ouvia-a, aprendia-a, guardava na ideia, e, retornado ao Ão, no dia seguinte, a repetia a outros.\n Assim estavam jantando, vinham os do povoado receber a nova parte da novela do rádio. Ouvir já tinham ouvido tudo, de uma vez, fugia da regra: falhara ali no Ão, na véspera, o caminhão de um comprador de galinhas e ovos, seo Abrãozinho Buristém, que carregava um rádio pequeno, de pilhas, armara um fio no arame da cerca... Mas queriam escutar outra vez, por confirmação. — “A estória é estável de boa, mal que acompridada: taca e não rende...” — explicava o Zuz ao Dalberto.\n Soropita começou a recontar o capítulo da novela. Sem trabalho, se recordava das palavras, até com clareza — disso se admirava. Contava com prazer de demorar, encher a sala com o poder de outros altos personagens. Tomar a atenção de todos, pudesse contar aquilo noite adiante. Era preciso trazer luz, nem uns enxergavam mais os outros; quando alguém ria, ria de muito longe. O capítulo da novela estava terminando.\n\nNesse trecho do conto, o gosto dos moradores do povoado por ouvir a novela de rádio recontada por Soropita deve-se ao(à)",
        answers:["qualidade do som do rádio.", "estabilidade do enredo contado.", "ineditismo do capítulo da novela.", "jeito singular de falar aos ouvintes.", "dificuldade de compreensão da história."],
        correctAnswer: 3
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
