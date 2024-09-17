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
const accuracyElement = document.getElementById('accuracy-rate');

// Firestore initialization
const db = getFirestore();

// Variáveis para o controle do simulado
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let currentErrors = 0;
let user = null;
let penaltyApplied = false;
let timer;
let simulationId = ''; // Identificador único do simulado
let visibilityCheckActive = false; // Controla se a verificação de abas está ativa
let limitedQuestions = [];
const userAnswers = [];
const originalAnswerIndices = [];

// Lista de questões
const questions = [
    {
        question: "Qual é a fórmula da água?",
        answers: [
            "H2O",
            "CO2",
            "O2",
            "H2SO4"
        ],
        correctAnswer: 0
    },
    {
        question: "Quem pintou a Mona Lisa?",
        answers: [
            "Leonardo da Vinci",
            "Vincent van Gogh",
            "Pablo Picasso",
            "Claude Monet"
        ],
        correctAnswer: 0
    },
    {
        question: "Qual é a capital do Brasil?",
        answers: [
            "Brasília",
            "Rio de Janeiro",
            "São Paulo",
            "Salvador"
        ],
        correctAnswer: 0
    },
    {
        question: "Qual é o maior planeta do sistema solar?",
        answers: [
            "Júpiter",
            "Saturno",
            "Terra",
            "Marte"
        ],
        correctAnswer: 0
    },
    {
        question: "Qual é a unidade básica da vida?",
        answers: [
            "Célula",
            "Molécula",
            "Átomo",
            "Organelo"
        ],
        correctAnswer: 0
    },
    {
        question: "Um tipo de semente necessita de bastante água nos dois primeiros meses após o plantio. Um produtor pretende estabelecer o melhor momento para o plantio desse tipo de semente, nos meses de outubro a março. Após consultar a previsão do índice mensal de precipitação de chuva (ImPC) da região onde ocorrerá o plantio, para o período chuvoso de 2020-2021, ele obteve os seguintes dados:\n\n• outubro/2020: ImPC = 250 mm;\n• novembro/2020: ImPC = 150 mm;\n• dezembro/2020: ImPC = 200 mm;\n• janeiro/2021: ImPC = 450 mm;\n• fevereiro/2021: ImPC = 100 mm;\n• março/2021: ImPC = 200 mm.\n\nCom base nessas previsões, ele precisa escolher dois meses consecutivos em que a média mensal de precipitação seja a maior possível.\nNo início de qual desses meses o produtor deverá plantar esse tipo de semente?",
        answers: [
            "outubro",
            "novembro",
            "dezembro",
            "janeiro"
        ],
        correctAnswer: 2
    },
    {
        question: "Leia o texto abaixo para responder à questão.\n\nA agricultura urbana é uma prática crescente em diversas cidades ao redor do mundo. Além de contribuir para a segurança alimentar local, ela desempenha um papel crucial na sustentabilidade urbana, promovendo a redução da pegada de carbono e o uso eficiente dos recursos naturais disponíveis nas áreas urbanas. Um dos desafios enfrentados por agricultores urbanos é a qualidade do solo, que muitas vezes é prejudicada pela contaminação e pela falta de nutrientes essenciais. Para mitigar esses problemas, são adotadas técnicas como o uso de compostagem, que transforma resíduos orgânicos em adubo rico em nutrientes para o solo, e a rotação de culturas, que ajuda a manter a fertilidade do solo.\n\nConsiderando as informações do texto, é correto afirmar que a agricultura urbana:",
        answers: [
            "Aumenta a pegada de carbono nas cidades.",
            "Não contribui para a segurança alimentar local.",
            "Não enfrenta desafios relacionados à qualidade do solo.",
            "Promove a sustentabilidade urbana.",
            "Reduz a eficiência no uso de recursos naturais."
        ],
        correctAnswer: 3
    },
    {
        question: "Leia o trecho abaixo para responder à questão.\n\nNos últimos anos, tem havido um aumento significativo no número de startups voltadas para a economia circular, um modelo econômico que visa maximizar o uso de recursos existentes e minimizar o desperdício. Essas startups não apenas desenvolvem produtos inovadores, mas também reimaginam processos industriais tradicionais para reduzir seu impacto ambiental. Um exemplo disso é a reciclagem de materiais que antes eram considerados resíduos, transformando-os em novos produtos de valor agregado. Além disso, a economia circular fomenta a colaboração entre empresas de diferentes setores, promovendo um ciclo contínuo de inovação e sustentabilidade.\n\nCom base no texto, pode-se inferir que a economia circular:",
        answers: [
            "Prioriza o aumento do desperdício de recursos.",
            "Ignora a necessidade de colaboração entre empresas.",
            "Fomenta a inovação e a sustentabilidade.",
            "Reduz a importância de produtos inovadores.",
            "Aumenta o impacto ambiental dos processos industriais."
        ],
        correctAnswer: 2
    },
    {
        question: "Leia o texto abaixo para responder à questão.\n\nA nanotecnologia é um campo da ciência que estuda materiais e dispositivos extremamente pequenos, na escala de nanômetros (um bilionésimo de metro). Essa tecnologia tem aplicações em diversas áreas, desde a medicina até a eletrônica, devido às propriedades únicas dos materiais nanométricos. Um dos desafios enfrentados pelos pesquisadores é garantir a segurança desses materiais, uma vez que seu comportamento pode ser diferente dos materiais convencionais em escala macroscópica. Portanto, são necessários estudos rigorosos para avaliar os potenciais impactos ambientais e de saúde associados ao uso da nanotecnologia.\n\nCom base no texto, pode-se afirmar que um dos desafios da nanotecnologia é:",
        answers: [
            "A falta de aplicações práticas.",
            "A manipulação de materiais em grande escala.",
            "A ausência de propriedades únicas dos materiais nanométricos.",
            "A garantia da segurança dos materiais.",
            "A resistência dos materiais à eletrônica convencional."
        ],
        correctAnswer: 3
    },
    {
        question: "Qual é a derivada de x²?",
        answers: [
            "2x",
            "x",
            "x³",
            "2"
        ],
        correctAnswer: 0
    },
    {
        question: "Qual é o valor de 7³?",
        answers: [
            "21",
            "343",
            "49",
            "729"
        ],
        correctAnswer: 1
    },    
    {
        question: "O movimento migratório que resultou na ocupação do Oeste dos Estados Unidos no século XIX é conhecido como:",
        answers: [
            "Gold Rush",
            "Marcha para o Oeste",
            "Guerra Civil",
            "Manifest Destiny"
        ],
        correctAnswer: 1
    },
    {
        question: "Qual é a função principal do ribossomo?",
        answers: [
            "Produção de energia",
            "Síntese de proteínas",
            "Armazenamento de lipídios",
            "Transporte de substâncias"
        ],
        correctAnswer: 1
    },
    {
        question: "Quem pintou 'A Noite Estrelada'?",
        answers: [
            "Vincent van Gogh",
            "Pablo Picasso",
            "Claude Monet",
            "Leonardo da Vinci"
        ],
        correctAnswer: 0
    },
    {
        question: "Qual é o elemento mais abundante no universo?",
        answers: [
            "Hidrogênio",
            "Oxigênio",
            "Carbono",
            "Hélio"
        ],
        correctAnswer: 0
    },
    {
        question: "Qual é o valor de π (pi) aproximadamente?",
        answers: [
            "3,14",
            "2,17",
            "1,62",
            "4,18"
        ],
        correctAnswer: 0
    },
    {
        question: "Qual é o maior oceano da Terra?",
        answers: [
            "Atlântico",
            "Pacífico",
            "Índico",
            "Ártico"
        ],
        correctAnswer: 1
    },
    {
        question: "Qual é a fórmula da área de um triângulo?",
        answers: [
            "base x altura / 2",
            "base x altura",
            "base + altura / 2",
            "base + altura"
        ],
        correctAnswer: 0
    },
    {
        question: "Qual é o principal gás responsável pelo efeito estufa?",
        answers: [
            "Dióxido de carbono",
            "Oxigênio",
            "Nitrogênio",
            "Hidrogênio"
        ],
        correctAnswer: 0
    },
    {
        question: "Quem foi o responsável pela teoria da relatividade?",
        answers: [
            "Isaac Newton",
            "Albert Einstein",
            "Galileu Galilei",
            "Niels Bohr"
        ],
        correctAnswer: 1
    },
    {
        question: "Qual é a fórmula química da glicose?",
        answers: [
            "C6H12O6",
            "C12H22O11",
            "H2O",
            "CH4"
        ],
        correctAnswer: 0
    },
    {
        question: "Qual é a principal função do pâncreas no sistema digestivo?",
        answers: [
            "Produção de bile",
            "Produção de insulina",
            "Absorção de nutrientes",
            "Produção de ácido clorídrico"
        ],
        correctAnswer: 1
    },
    {
        question: "Qual é o elemento químico com símbolo 'Fe'?",
        answers: [
            "Ferro",
            "Flúor",
            "Fósforo",
            "Francium"
        ],
        correctAnswer: 0
    },
    {
        question: "Qual é o resultado da expressão 3x² - 2x + 1 quando x = 2?",
        answers: [
            "9",
            "11",
            "15",
            "17"
        ],
        correctAnswer: 0
    },
    {
        question: "Em que ano aconteceu a Proclamação da República no Brasil?",
        answers: [
            "1889",
            "1822",
            "1964",
            "1500"
        ],
        correctAnswer: 0
    },
    {
        question: "Qual é a fórmula química do gás carbônico?",
        answers: [
            "CO2",
            "O2",
            "H2O",
            "CH4"
        ],
        correctAnswer: 0
    },
        {
            question: "A Lei de Terras, aprovada em 1850, duas semanas após a proibição do tráfico de escravos, tentou pôr ordem na confusão existente em matéria de propriedade rural, determinando que, no futuro, as terras públicas fossem vendidas e não doadas, como acontecera com as antigas sesmarias, estabeleceu normas para legalizar a posse de terras e procurou forçar o registro das propriedades.\n\n Sobre essa Lei de Terras é correto afirmar que",
            answers: [
                "Sua promulgação coincidiu com a Lei Eusébio de Queiroz, mas não há nenhuma relação de causalidade entre ambas.",
                "Ao entrar em vigor, não foi respeitada, podendo ser considerada mais uma ''lei para inglês ver''.",
                "Sua promulgação foi concebida como uma forma de evitar o acesso à propriedade da terra por parte de futuros imigrantes.",
                "Sua aprovação naquele momento decorreu de os Estados Unidos terem acabado de aprovar uma lei de terras para o seu território."
            ],
            correctAnswer: 2
        },
        {
            question: "O ano de 1848 assistiu a várias revoluções na Europa como, por exemplo, na França e na Itália. O espírito ''quarenta e oito'', como se chamou este período, também atingiu o Brasil e, particularmente, Pernambuco. Esta questão diz respeito à Revolução Praieira.",
            answers: [
                "Os revolucionários praieiros pretendiam que o Governo interviesse nos fenômenos de produção, distribuição e comércio promovendo nosso retorno à condição de colônia.",
                "Os revolucionários de Pernambuco lançaram um ''Manifesto ao Mundo'' esclarecendo suas posições no que diz respeito ao voto universal do povo brasileiro, ao trabalho como garantia de vida para o cidadão brasileiro e à reforma do poder judicial dentre outras.",
                "O Partido da Praia, integrado por conservadores pernambucanos, tinha no jornal o Diário Novo um instrumento de veiculação de suas ideias políticas.",
                "A concentração da propriedade fundiária e a permanência da gestão holandesa em Pernambuco foram fatores que provocaram a Revolução Praieira."
            ],
            correctAnswer: 1
        },
        {
            question: "Na segunda metade do século XIX, o governo brasileiro realizou uma série de iniciativas, no que diz respeito ao desenvolvimento urbano. Sobre esta questão, assinale a alternativa correta.",
            answers: [
                "Grandes empreendimentos fluviais surgiram, fundamentados na vasta rede hidrográfica que o país possui - o Rio São Francisco e o Rio Araguaia, são exemplos de navegabilidade sem dificuldades.",
                "Construções de represas, aproveitando o potencial hidrográfico dos rios São Francisco, Amazonas e Paraná para a produção de energia, facilitaram a industrialização.",
                "A navegação marítima, o transporte terrestre, incluindo as ferrovias, a iluminação a gás e o abastecimento d água foram algumas iniciativas que mudaram a face das grandes cidades do país.",
                "O desenvolvimento de uma malha ferroviária, não apenas para escoar a produção agrícola, mas para ligar regiões, possibilitou o crescimento industrial em regiões interioranas."
            ],
            correctAnswer: 2
        },
        {
            question: "O descontentamento do Exército, que culminou na Questão Militar no final do Império, pode ser atribuído",
            answers: [
                "à predominância do poder civil que não prestigiava os militares e lhes proibia o debate político pela imprensa.",
                "às pressões exercidas pela Igreja junto aos militares para abolir a monarquia.",
                "à propaganda do militarismo sul-americano na imprensa brasileira.",
                "às tendências ultrademocráticas das forças armadas, que desejavam conceder maior participação política aos analfabetos."
            ],
            correctAnswer: 0
        },
        {
            question: "A chamada ''Questão Religiosa'', ocorrida durante o Segundo Reinado, foi uma disputa entre o Estado Imperial e a Igreja Católica devido à",
            answers: [
                "rejeição, pelo governo, dos dispositivos da bula Syllabus, baixada pelo papa Pio IX, que proibia a permanência de membros da maçonaria dentro dos quadros da Igreja.",
                "rejeição da encíclica Rerum Novarum, baixada pelo papa Leão XIII, que defendia a coexistência harmoniosa do capital e do trabalho, no sentido de evitar a luta de classes.",
                "adesão do governo imperial aos ditames do Tratado de Latrão, que limitava os poderes da Igreja expressos na instituição do Padroado.",
                "recusa do governo de Dom Pedro II em aceitar as manobras parlamentares dos deputados católicos, visando à extinção do direito do Padroado."
            ],
            correctAnswer: 0
        },
        {
            question: "A estabilidade do Império brasileiro após 1850 favoreceu o crescimento e a prosperidade econômica. Nesse período, os empreendimentos econômicos mais arrojados partiram do barão de Mauá, que construiu ferrovias, criou bancos, investiu na navegação fluvial. Contudo, as iniciativas de Mauá na área industrial encontraram fortes obstáculos, a saber:",
            answers: [
                "a carência de mão de obra assalariada e a concorrência das manufaturas inglesas, favorecidas pelas taxas de importação.",
                "a expansão da cafeicultura no Oeste paulista e o início da organização do movimento operário.",
                "a tarifa alfandegária benéfica à produção nacional e o declínio da economia açucareira da região Nordeste.",
                "a concorrência com a emergente produção industrial do Paraguai."
            ],
            correctAnswer: 0
        },
        {
            question: "Em qual das frases a seguir a crase está empregada corretamente?",
            answers: [
                "A reunião será à partir das 14h.",
                "Vou à escola todos os dias.",
                "Ela entregou o trabalho à tempo.",
                "Fomos à praia no final de semana passada."
            ],
            correctAnswer: 1
        },
        {
            question: "Qual das opções apresenta um exemplo correto de voz passiva analítica?",
            answers: [
                "As provas foram corrigidas pelo professor.",
                "O professor corrigiu as provas.",
                "Corrigiram as provas.",
                "As provas estão corrigindo."
            ],
            correctAnswer: 0
        },
        {
            question: "Qual das frases a seguir apresenta um exemplo de regência nominal correta?",
            answers: [
                "Ela é fiel a seus princípios.",
                "Ele é ansioso com a viagem.",
                "A professora é rigorosa em os alunos.",
                "João está atento com os detalhes."
            ],
            correctAnswer: 0
        },
        {
            question: "Qual das opções contém um exemplo correto de concordância verbal?",
            answers: [
                "Fazem dois anos que não nos vemos.",
                "A maioria das pessoas concordaram com a decisão.",
                "Houveram muitos problemas na execução do projeto.",
                "Fui eu que fez o trabalho."
            ],
            correctAnswer: 0
        },
        {
            question: "Em qual das opções a vírgula está corretamente empregada?",
            answers: [
                "Se você for, eu também vou.",
                "Ela gosta de ler, e de escrever.",
                "O filme, que assistimos ontem foi emocionante.",
                "Pedro foi ao mercado comprar frutas e verduras, para o jantar."
            ],
            correctAnswer: 0
        },
        {
            question: "Qual das frases apresenta a correta flexão do verbo ''intervir'' no pretérito perfeito do indicativo?",
            answers: [
                "Ele interviu na reunião.",
                "Nós interviemos no conflito.",
                "Ela interveio na discussão.",
                "Eu intervi a situação."
            ],
            correctAnswer: 2
        },   
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
    // Limita o número de perguntas a 30, caso existam mais que isso
    shuffleArray(questions);
    limitedQuestions = questions.slice(0, 5); // Seleciona até 30 perguntas
    totalQuestionsElement.textContent = limitedQuestions.length.toString();

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
    const currentQuestion = limitedQuestions[currentQuestionIndex]; // Usa limitedQuestions em vez de questions
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

// Certifique-se de passar o array limitado ao avançar as perguntas
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < limitedQuestions.length) {
        resetQuestion();
        showQuestion(); // Agora usará limitedQuestions automaticamente
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
    totalQuestionsElement.textContent = limitedQuestions.length.toString(); // Usa o número de perguntas limitadas

    // Exibe o número de respostas corretas e o total de perguntas no formato desejado
    const totalQuestions = limitedQuestions.length;
    const correctAnswersText = `${correctAnswers} respostas corretas de ${totalQuestions}`;
    correctAnswersElement.textContent = correctAnswersText;
    
    // Calcular e exibir a precisão de acerto
    const accuracyRate = (correctAnswers / totalQuestions) * 100;
    accuracyElement.textContent = `Precisão: ${accuracyRate.toFixed(2)}%`;

    reviewAnswersContainer.innerHTML = '';

    // Usa limitedQuestions para exibir apenas as perguntas que foram exibidas no simulado
    limitedQuestions.forEach((question, index) => {
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
        resultText.innerHTML = `<strong>Resposta: </strong>${isCorrect ? 'Correta' : 'Errada'}`;
        questionDiv.appendChild(resultText);

        const correctAnswerText = document.createElement('p');
        correctAnswerText.innerHTML = `<strong>Resposta correta:</strong> ${question.answers[question.correctAnswer]}`;
        questionDiv.appendChild(correctAnswerText);

        const separator = document.createElement('hr');
        questionDiv.appendChild(separator);

        reviewAnswersContainer.appendChild(questionDiv);
        
        // Atualiza o contador de erros
        if (!isCorrect) {
            currentErrors += 1;
        }
    });

    if (user) {
        const userRef = doc(db, 'users', user.uid);
        const simulationRef = doc(db, 'simulations', simulationId); // Referência ao documento do simulado

        getDoc(userRef).then((docSnapshot) => {
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                const currentScoreGlobal = userData.scoreglobal || 0;
                const totalSimulated = userData.totalSimulated || 0;
                const totalCorrectAnswers = userData.totalCorrectAnswers || 0;
                const totalErrors = userData.totalErrors || 0;

                // Atualiza o scoreglobal do usuário
                const newScoreGlobal = Math.max(currentScoreGlobal + score, 0);
                const newTotalSimulated = totalSimulated + 1;
                const newTotalCorrectAnswers = totalCorrectAnswers + correctAnswers;
                const newTotalErrors = totalErrors + currentErrors; // Soma os erros do simulado atual

                // Calcular a precisão média com precisão de até 2 casas decimais
                const totalAnswers = newTotalCorrectAnswers + newTotalErrors;
                const averageAccuracy = (newTotalCorrectAnswers / totalAnswers) * 100;
                
                // Evitar 100% exato se possível
                const finalAverageAccuracy = Math.min(99.99, averageAccuracy);

                // Atualiza Firestore com novos valores
                updateDoc(userRef, { 
                    scoreglobal: newScoreGlobal,
                    totalSimulated: newTotalSimulated,
                    totalCorrectAnswers: newTotalCorrectAnswers,
                    totalErrors: newTotalErrors,
                    averageAccuracy: finalAverageAccuracy.toFixed(2)
                })
                .then(() => {
                    console.log('scoreglobal e estatísticas do usuário atualizados com sucesso!');
                })
                .catch((error) => {
                    console.error('Erro ao atualizar o scoreglobal e estatísticas do usuário: ', error);
                });

            } else {
                // Cria o documento do usuário se não existir
                setDoc(userRef, {
                    scoreglobal: Math.max(score, 0),
                    totalSimulated: 1,
                    totalCorrectAnswers: correctAnswers,
                    totalErrors: currentErrors, // Usa currentErrors para o primeiro simulado
                    averageAccuracy: (correctAnswers / (correctAnswers + currentErrors) * 100).toFixed(2)
                })
                .then(() => {
                    console.log('Documento do usuário criado com sucesso!');
                })
                .catch((error) => {
                    console.error('Erro ao criar documento do usuário: ', error);
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
            totalQuestions: limitedQuestions.length, // Usa o número de perguntas limitadas
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
