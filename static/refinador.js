const elTextos = document.getElementById('dados-textos');
const TEXTOS = elTextos ? JSON.parse(elTextos.textContent) : {};

const elIdeia = document.getElementById('dados-ideia');
const dados = elIdeia ? JSON.parse(elIdeia.textContent) : {};

const botaoPedir = document.getElementById('btn-pedir');
const caixaProfessor = document.getElementById('professor');
const elogio = document.getElementById('p-elogio');
const listaPerguntas = document.getElementById('p-perguntas');

if (botaoPedir) {
    botaoPedir.addEventListener('click', async () => {
        botaoPedir.disabled = true;
        botaoPedir.textContent = TEXTOS.pensando || 'Professor pensando...';

        const corpo = {
            ...(dados || {}),
            hipotese: (document.getElementById('hipotese')?.value || '').trim(),
            teste: (document.getElementById('teste')?.value || '').trim()
        };
            
        try {
            const resposta = await fetch('/refinar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(corpo)
            });
            const resultado = await resposta.json();

            if (!resposta.ok || resultado.erro) throw new Error('falha');

            elogio.textContent = resultado.elogio || '';
            listaPerguntas.innerHTML = '';
            if (Array.isArray(resultado.perguntas)) {
                resultado.perguntas.forEach(pergunta => {
                    const item = document.createElement('li');
                    item.textContent = pergunta;
                    listaPerguntas.appendChild(item);
                });
            }
            if (caixaProfessor) caixaProfessor.classList.remove('oculto');
        } catch (erro) {
            console.error('Erro no refinador:', erro);
            elogio.textContent = TEXTOS.erro || 'Erro ao consultar o professor.';
            listaPerguntas.innerHTML = '';
            if (caixaProfessor) caixaProfessor.classList.remove('oculto');
        } finally {
            botaoPedir.disabled = false;
            botaoPedir.textContent = TEXTOS.botao || 'Pedir ajuda ao Professor IA';
        }
    });
}