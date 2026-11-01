const elTextos = document.getElementById('dados-textos');
const TEXTOS = elTextos ? JSON.parse(elTextos.textContent) : (window.TEXTOS || {});

const elIdeia = document.getElementById('dados-ideia');
const dados = elIdeia ? JSON.parse(elIdeia.textContent) : (window.dados || {});

const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const comportamentoRolagem = reduzirMovimento ? 'auto' : 'smooth';

function rolarPara(elemento) {
    elemento.scrollIntoView({ behavior: comportamentoRolagem, block: 'start' });
}

const trilha = document.getElementById('mc-trilha');
const estacoes  = [...document.querySelectorAll('.mc-estacao')];
const detalhes = [...document.querySelectorAll('.mc-detalhe')];
const botaoVoltar = document.getElementById('mc-voltar');
const botaoProximo = document.getElementById('mc-proximo');
let estacaoAtual = 0;

function irParaEstacao(indice) {
    estacaoAtual = Math.max(0, Math.min(indice, estacoes.length - 1));

    estacoes.forEach((botao, i) =>{
        const ativa = i === estacaoAtual;
        botao.classList.toggle('ativa', ativa);
        botao.classList.toggle('feita', i < estacaoAtual);
        botao.setAttribute('aria-selected', ativa ? 'true' : 'false');
        botao.tabIndex = ativa ? 0 : -1;
    });

    detalhes.forEach((detalhe, i) => {
        detalhe.hidden = i !== estacaoAtual;
    });

    trilha.style.setProperty('--prog', `${(estacaoAtual / (estacoes.length - 1)) * 100}%`);

    botaoVoltar.disabled = estacaoAtual === 0;
    const ultima = estacaoAtual === estacoes.length -1;
    botaoProximo.textContent = `${ultima ? TEXTOS.irPlano : TEXTOS.proxima} →`;
}

estacoes.forEach((botao, i) => {
    botao.addEventListener('click', () => irParaEstacao(i));

    botao.addEventListener('keydown', (evento) => {
        if (evento.key === 'ArrowRight' || evento.key === 'ArrowLeft') {
            evento.preventDefault();
            const proxima = estacaoAtual + (evento.key === 'ArrowRight' ? 1 : -1);
            irParaEstacao(proxima);
            estacoes[estacaoAtual].focus();
        }
    });
});

botaoVoltar.addEventListener('click', () => irParaEstacao(estacaoAtual - 1));

botaoProximo.addEventListener('click', () => {
    if (estacaoAtual === estacoes.length - 1) {
        rolarPara(document.getElementById('mc-planejar'));
    } else {
        irParaEstacao(estacaoAtual + 1);
    }
});

const CHAVE_PLANO = 'izobret-plano-v1';
const assinatura = [dados.foco, dados.objeto, dados.acao, dados.desafio].join('|');
const  veioDaMaquina = assinatura !== '|||';

function lerSalvo() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_PLANO));
    } catch (erro) {
        return null;
    }
}

function gravar() {
    try {
        localStorage.setItem(CHAVE_PLANO, JSON.stringify(estado));
    } catch (erro) {

    }
}

let estado = lerSalvo();

if (!estado || (veioDaMaquina && estado.assinatura !== assinatura)) {
    estado = { assinatura: veioDaMaquina ? assinatura : '', sorteio: null, ideia: dados.ideia || '', respostas: {}, passo: 0 };
} else if (dados.ideia && !estado.ideia) {
    estado.ideia = dados.ideia;
}
estado.respostas = estado.respostas || {};

if (veioDaMaquina) {
    estado.sorteio = { ...dados };
} else if (estado.sorteio) {
    document.getElementById('tag-foco').textContent = estado.sorteio.foco || '—';
    document.getElementById('tag-objeto').textContent = estado.sorteio.objeto || '—';
    document.getElementById('tag-acao').textContent = estado.sorteio.acao || '—';
    document.getElementById('tag-desafio').textContent = estado.sorteio.desafio || '—';
}

const sorteioAtual = estado.sorteio || { foco: '', objeto: '', acao: '', desafio: '' };

const secaoAprender = document.getElementById('mc-aprender');
const secaoPlanejar = document.getElementById('mc-planejar');
const secaoPlano = document.getElementById('mc-plano');
const etapasPlano = [...document.querySelectorAll('.mc-etapa')];
const pontos = [...document.querySelectorAll('.mc-ponto')];
const campos = [...document.querySelectorAll('.mc-campo')];
const campoIdeia = document.getElementById('mc-ideia');
const botaoAnterior = document.getElementById('mc-anterior');
const botaoSeguinte = document.getElementById('mc-seguinte');
const botaoPedir = document.getElementById('btn-pedir');
const caixaProfessor = document.getElementById('professor');
const elogio = document.getElementById('p-elogio');
const listaPerguntas = document.getElementById('p-perguntas');
let passoAtual = 0;

campoIdeia.value = estado.ideia || '';
campoIdeia.addEventListener('input', () => {
    estado.ideia = campoIdeia.value;
    gravar();
});

campos.forEach((campo) => {
    campo.value = estado.respostas[campo.id] || '';
    campo.addEventListener('input', () => {
        estado.respostas[campo.id] = campo.value;
        gravar();
        atualizarPontos();
    });
});

function passoTemResposta(i) {
    return [...etapasPlano[i].querySelectorAll('.mc-campo')].some((campo) => campo.value.trim() !== '');
}

function atualizarPontos() {
    pontos.forEach((ponto, i) => ponto.classList.toggle('completo', passoTemResposta(i)));
}

function irParaPasso(indice, rolar) {
    passoAtual = Math.max(0, Math.min(indice, etapasPlano.length - 1));
    estado.passo = passoAtual;
    gravar();

    etapasPlano.forEach((etapa, i) => {
        etapa.hidden = i !== passoAtual;
    });

    pontos.forEach((ponto, i) => {
        ponto.classList.toggle('ativo', i === passoAtual);
        if ( i === passoAtual) {
            ponto.setAttribute('aria-current', 'step');
        } else {
            ponto.removeAttribute('aria-current');
        }
    });

    botaoAnterior.disabled = passoAtual === 0;
    const ultimo = passoAtual === etapasPlano.length - 1;
    botaoSeguinte.textContent = ultimo ? `${TEXTOS.verPlano} 🚀` : `${TEXTOS.proxima} →`;

    caixaProfessor.classList.add('oculto');
    atualizarPontos();

    if (rolar) {
        rolarPara(document.getElementById('mc-progresso'));
    }
}

pontos.forEach((ponto, i) => ponto.addEventListener('click', () => irParaPasso(i, false)));
botaoAnterior.addEventListener('click', () => irParaPasso(passoAtual - 1, true));

botaoSeguinte.addEventListener('click', () => {
    if (passoAtual === etapasPlano.length - 1) {
        mostrarPlano();
    } else {
        irParaPasso(passoAtual + 1, true);
    }
});

function resumoDosPassosAnteriores() {
    const partes = [];
    for (let i = 0; i < passoAtual; i++) {
        const respostas = [...etapasPlano[i].querySelectorAll('.mc-campo')]
            .map((campo) => campo.value.trim())
            .filter(Boolean);
        if (respostas.length > 0) {
            partes.push(`${etapasPlano[i].dataset.nome}: ${respostas.join(' / ')}`);
        }
    }
    return partes.join('\n');
}

botaoPedir.addEventListener('click', async () => {
    botaoPedir.disabled = true;
    botaoPedir.textContent = TEXTOS.pensando || 'Professor pensando...';

    // Dá feedback imediato ao usuário na interface
    caixaProfessor.classList.remove('oculto');
    elogio.textContent = '🧑‍🔬 ' + (TEXTOS.pensando || 'Professor pensando...');
    listaPerguntas.innerHTML = '<li style="list-style: none; opacity: 0.85;">Analisando suas respostas para criar as melhores perguntas...</li>';

    const etapa = etapasPlano[passoAtual];
    const corpo = {
        ...sorteioAtual,
        ideia: campoIdeia.value,
        etapa: etapa.dataset.nome,
        perguntas: [...etapa.querySelectorAll('.campo-grupo')].map((grupo) => ({
            pergunta: grupo.querySelector('label').textContent.trim(),
            resposta: grupo.querySelector('textarea').value.trim()
        })),
        anteriores: resumoDosPassosAnteriores()
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
        (resultado.perguntas || []).forEach((pergunta) => {
            const item = document.createElement('li');
            item.textContent = pergunta;
            listaPerguntas.appendChild(item);
        });
    } catch (erro) {
        console.error(erro);
        elogio.textContent = TEXTOS.erro;
        listaPerguntas.innerHTML = '';
    } finally {
        caixaProfessor.classList.remove('oculto');
        botaoPedir.disabled = false;
        botaoPedir.textContent = TEXTOS.botao;
    }
});

function coletarPlano() {
    return etapasPlano.map((etapa) => ({
        nome: etapa.dataset.nome,
        icone:etapa.dataset.icone,
        cor: etapa.style.getPropertyValue('--cor'),
        itens: [...etapa.querySelectorAll('.campo-grupo')].map((grupo) => ({
            pergunta: grupo.querySelector('label').textContent.trim(),
            resposta: grupo.querySelector('textarea').value.trim()
        }))
    }));
}

function montarPlano() {
    const ideia = campoIdeia.value.trim();
    document.getElementById('mc-plano-ideia').textContent = ideia;

    const lista = document.getElementById('mc-plano-lista');
    lista.innerHTML = '';

    coletarPlano().forEach((etapa, i) =>{
        const bloco = document.createElement('section');
        bloco.className = 'mc-plano-etapa';
        bloco.style.setProperty('--cor', etapa.cor);

        const titulo = document.createElement('h3');
        titulo.textContent = `${etapa.icone} ${i + 1}. ${etapa.nome}`;
        bloco.appendChild(titulo);

        etapa.itens.forEach((item) => {
            const pergunta = document.createElement('p');
            pergunta.className = 'mc-plano-q';
            pergunta.textContent = item.pergunta;

            const resposta = document.createElement('p');
            resposta.className = item.resposta ? 'mc-plano-a' : 'mc-plano-a vazio';
            resposta.textContent = item.resposta || TEXTOS.vazio;

            bloco.appendChild(pergunta);
            bloco.appendChild(resposta);
        });

        lista.appendChild(bloco);
    });
}

function mostrarPlano() {
    montarPlano();
    secaoAprender.hidden = true;
    secaoPlanejar.hidden = true;
    secaoPlano.hidden = false;
    document.body.classList.add('mostrando-plano');
    window.scrollTo({ top: 0, behavior: comportamentoRolagem });
}

function editarRespostas() {
    secaoPlano.hidden = true;
    secaoAprender.hidden = false;
    secaoPlanejar.hidden = false;
    document.body.classList.remove('mostrando-plano');
    rolarPara(secaoPlanejar);
}

function textoDoPlano() {
    const linhas = [TEXTOS.tituloPlano, ''];
    if (campoIdeia.value.trim()) {
        linhas.push(campoIdeia.value.trim(), '');
    }
    coletarPlano().forEach((etapa, i) => {
        linhas.push(`${i+1}. ${etapa.nome}`);
        etapa.itens.forEach((item) => {
            linhas.push(item.pergunta, item.resposta || TEXTOS.vazio, '');
        });
    });
    return linhas.join('\n');
}

async function copiarTexto(texto) {
    try {
        await navigator.clipboard.writeText(texto);
    } catch (erro) {
        const area = document.createElement('textarea');
        area.value = texto;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        area.remove();
    }
}

const botaoCopiar = document.getElementById('mc-copiar');
botaoCopiar.addEventListener('click', async () => {
    await copiarTexto(textoDoPlano());
    botaoCopiar.textContent = `✅ ${TEXTOS.copiado}`;
    setTimeout(() => {
        botaoCopiar.textContent = TEXTOS.copiar;
    }, 2200);
});

document.getElementById('mc-imprimir').addEventListener('click', () => window.print());
document.getElementById('mc-editar').addEventListener('click',editarRespostas);

irParaEstacao(0);
irParaPasso(estado.passo || 0, false);