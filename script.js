// script.js

document.addEventListener('DOMContentLoaded', () => {
    const avisosContainer = document.getElementById('avisos-container');

    // Simula a obtenção dos avisos do servidor (substitua por sua lógica real)
    const avisosDoServidor = [
        { titulo: 'Aghamenon Estudos', mensagem: ' É um site criado por um estudante do ensino médio, com o objetivo de ajudar outros estudantes e adultos que gostam de estudos.' },
        { titulo: 'Fora do Ar', mensagem: 'Abertura dia 12/07/2024 ás 09:00h (horário de brasília).' }
    ];

    // Função para exibir os avisos na página
    function exibirAvisos() {
        avisosDoServidor.forEach(aviso => {
            const avisoElement = document.createElement('div');
            avisoElement.classList.add('aviso');
            avisoElement.innerHTML = `
                <h3>${aviso.titulo}</h3>
                <p>${aviso.mensagem}</p>
            `;
            avisosContainer.appendChild(avisoElement);
        });
    }

    // Chama a função para exibir os avisos ao carregar a página
    exibirAvisos();
});
