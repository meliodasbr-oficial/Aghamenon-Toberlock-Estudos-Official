document.addEventListener('DOMContentLoaded', () => {
    // Substitui o conteúdo da tag <body> com o conteúdo de manutenção
    document.body.innerHTML = `
        <div class="container">
            <h1>Avisos da Manutenção</h1>
            <div id="avisos-container"></div>
        </div>
    `;

    const avisosContainer = document.getElementById('avisos-container');

    const avisosDoServidor = [
        { titulo: 'Aghamenon Toberlock Estudos', mensagem: '' },
        { titulo: 'Em Manutenção', mensagem: 'Site estará ativo dia 09/09/2024 às 08:00h (horário de Brasília).' },
        { titulo: 'Detalhes da Manutenção', mensagem: 'Melhoração de Interface e Otimização do Site.\nNovas Funcionalidades\nNovos Simulados\nSistema de Login\nSistema de Ranking' }
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

    exibirAvisos();
});
