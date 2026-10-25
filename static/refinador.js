const botaoPedir = document.getElementById('btn-pedir');
const caixaProfessor = document.getElementById('professor');
const elogio = document.getElementById('p-elogio');
const listaPerguntas = document.getElementById('p-perguntas');

botaoPedir.addEventListener('click', async () => {
    botaoPedir.disabled = true;
    botaoPedir.textContent = TEXTOS.pensando;

    const corpo = {
        ...(dados || {}),
        hipotese: document.getElementById('hipotese').value,
        teste: document.getElementById('teste').value
        };
        
    try {
        const resposta = await fetch('/refinar', {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify(corpo)
        });
        const resultado = await resposta.json();

        if (!resposta.ok || resultado.erro) throw new Erro ('falha');

        elogio.textContent = resultado.elogio;
        listaPerguntas.innerHTML = '';
        resultado.perguntas.forEach(pergunta => {
            const item = document.createElement('li');
            item.textContent = pergunta;
            listaPerguntas.appendChild(item);
        });
        caixaProfessor.classList.remove('oculto');
    } catch (erro) {
        console.error(erro);
        elogio.textContent = TEXTOS.erro;
        listaPerguntas.innerHTML = '';
        caixaProfessor.classList.remove('oculto');
    } finally {
        botaoPedir.disabled = false;
        botaoPedir.textContent = TEXTOS.botao;
    }
});