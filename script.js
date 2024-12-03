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
        { titulo: 'Em Manutenção', mensagem: 'Indeterminado' },
        { titulo: 'Detalhes da Manutenção', mensagem: 'O site está passando por uma reformulação completa em seu design e funcionalidades para melhorar a experiência do usuário. A previsão para conclusão será informada em breve.' }
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
