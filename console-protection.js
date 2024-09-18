import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js';

(function() {
    const firebaseConfig = { 
        apiKey: "AIzaSyDr27BIHswRcTvvE5lUpR-l4OMGwGFQQaw",
        authDomain: "meliodaslogin-bae06.firebaseapp.com",
        projectId: "meliodaslogin-bae06",
        storageBucket: "meliodaslogin-bae06",
        messagingSenderId: "292569281051",
        appId: "1:292569281051:web:473895afda6419bc747ebe",
        measurementId: "G-3N0G8EFNMV"
    };

    // Inicializar o Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);

    const warningMessage = `
        Você não é um desenvolvedor autorizado do Aghamenon Toberlock Estudos.
        Qualquer tentativa de acessar informações internas pode resultar em ações legais.
        Por favor, saia imediatamente se você não tiver permissão para acessar este conteúdo.
    `;

    function showConsoleWarning() {
        console.log(warningMessage);
        ['log', 'info', 'warn', 'error'].forEach(method => {
            console[method] = function() {
                console.warn('Acesso ao console restrito. Saia imediatamente.');
            };
        });

        // Capturar informações do usuário e registrar no Firestore
        captureAndLogData();

        // Redirecionar para página de aviso
        window.location.href = 'https://meliodasbr-oficial.github.io/Aghamenon-Toberlock-Estudos-Official/access-denied';
    }

    function detectDevTools() {
        const threshold = 160; // Tamanho mínimo da diferença
        let devtoolsOpen = false;

        function check() {
            if (window.outerWidth - window.innerWidth > threshold ||
                window.outerHeight - window.innerHeight > threshold) {
                if (!devtoolsOpen) {
                    devtoolsOpen = true;
                    showConsoleWarning();
                }
            } else {
                devtoolsOpen = false;
            }
        }

        // Checar a cada 100ms
        setInterval(check, 100);

        // Verificar também quando a janela for redimensionada
        window.addEventListener('resize', check);

        // Verificar se as ferramentas de desenvolvedor estão abertas
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                check();
            }
        });
    }

    function captureAndLogData() {
        // Pegar a localização do usuário
        navigator.geolocation.getCurrentPosition(async (position) => {
            const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            // Verificar se o usuário está logado e pegar o email e número de telefone
            const user = auth.currentUser;
            const email = user ? user.email : "Anônimo";
            const phoneNumber = user && user.phoneNumber ? user.phoneNumber : "Não fornecido";

            // Pegar a plataforma (navegador e sistema operacional)
            const platform = navigator.userAgent;

            // Pegar a data e hora do acesso
            const accessTime = new Date().toISOString();

            // Criar o documento no Firestore
            try {
                await addDoc(collection(db, 'deniedAccess'), {
                    email: email,
                    phoneNumber: phoneNumber,
                    location: location,
                    platform: platform,
                    accessTime: accessTime
                });
                console.log("Acesso não autorizado registrado com sucesso.");
            } catch (error) {
                console.error("Erro ao registrar acesso não autorizado: ", error);
            }
        }, (error) => {
            console.error("Erro ao obter localização: ", error.message);
        });
    }

    // Função para verificar se é Safari em iOS
    function isIosSafari() {
        const ua = navigator.userAgent;
        return /iPhone|iPad|iPod/.test(ua) && /Safari/.test(ua) && !/Chrome/.test(ua);
    }

    // Se não for Safari no iPhone, inicia a detecção de devtools
    if (!isIosSafari()) {
        detectDevTools();
    }
})();