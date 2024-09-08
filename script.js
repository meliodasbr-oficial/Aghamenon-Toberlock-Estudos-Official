document.addEventListener('DOMContentLoaded', () => {
    // Cria uma div que atuará como o "body secundário"
    const bodySecundario = document.createElement('div');
    bodySecundario.classList.add('body-secundario');
    
    // Define o conteúdo do "body secundário"
    bodySecundario.innerHTML = `
        <div class="manutencao">
            <h1>Avisos da Manutenção</h1>
            <div id="avisos-manutencao"></div>
        </div>
    `;

    // Substitui o conteúdo do body principal pelo "body secundário"
    document.body.innerHTML = '';
    document.body.appendChild(bodySecundario);

    const avisosContainer = document.getElementById('avisos-manutencao');

    const avisosDoServidor = [
        { titulo: 'Aghamenon Toberlock Estudos', mensagem: '' },
        { titulo: 'Em Manutenção', mensagem: 'Site estará ativo dia 09/09/2024 às 08:00h (horário de Brasília).' },
        { titulo: 'Detalhes da Manutenção', mensagem: 'Melhoria de Interface e Otimização do Site.\nNovas Funcionalidades\nNovos Simulados\nSistema de Login\nSistema de Ranking' }
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
