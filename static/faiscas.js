const elTextos = document.getElementById('dados-textos');
const TEXTOS = elTextos ? JSON.parse(elTextos.textContent) : {};

const maquina = document.getElementById('maquina');
const alavanca = document.getElementById('alavanca');
const seletorFoco = document.getElementById('foco');
const campoPrevia = document.getElementById('ideia-previa');
const botaoRefinar = document.getElementById('btn-ir-refinar');
const rolos = [...document.querySelectorAll('.mq-rolo')];
const canvas = document.getElementById('mq-canvas');
const ctx = canvas.getContext('2d');

const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pausa = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

const SIMBOLOS = ['⚡', '🔧', '💡', '⚙️', '🧪', '🚀', '🔩', '🧲'];

document.querySelectorAll('.mq-luzes').forEach((fileira) => {
    for(let i = 0; i < 14;i++) {
        const luz = document.createElement('span');
        luz.className = 'mq-luz';
        fileira.appendChild(luz);
    }
});

rolos.forEach((rolo, i) => {
    const fita = rolo.querySelector('.mq-fita');
    const quatro = [0, 1, 2, 3].map((k) => SIMBOLOS[(i + k * 2) % SIMBOLOS.length]);
    [...quatro, ...quatro].forEach((simbolo) => {
        const item = document.createElement('span');
        item.textContent = simbolo;
        fita.appendChild(item);
    });
    fita.style.animationDuration = `${0.3 + i * 0.04}s`;
});

const CORES = ['#fecf27', '#ffb02e', '#ff7a3d', '#ffffff', '#9fd0ff'];
let particulas = [];
let animando = false;

function ajustarCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', ajustarCanvas);
ajustarCanvas();

function desenharEstrela(raio) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? raio : raio * 0.3;
        const angulo = (i * Math.PI) / 4;
        ctx.lineTo(Math.cos(angulo) * r, Math.sin(angulo) * r);
    }
    ctx.closePath();
    ctx.fill();
}

function explodir(x, y, quantidade = 28) {
    if(reduzirMovimento) return;

    for (let i = 0; i <quantidade; i++){
        const angulo = Math.random() * Math.PI * 2;
        const velocidade = 2 + Math.random() * 6;
        particulas.push({
            x,
            y,
            vx: Math.cos(angulo) * velocidade,
            vy: Math.sin(angulo) * velocidade - 2,
            vida: 1,
            gravidade: 0.12 + Math.random() * 0.1,
            tamanho: 2 + Math.random() * 4,
            cor: CORES[Math.floor(Math.random() * CORES.length)],
            giro: Math.random() * 6,
            velGiro: (Math.random() - 0.5) * 0.4,
            estrela: Math.random() < 0.35
        });
    }

    if (!animando) {
        animando = true;
        requestAnimationFrame(animar);
    }
}

function animar() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particulas = particulas.filter((p) => p.vida > 0);

    for (const p of particulas) {
        p.vx *= 0.985;
        p.vy += p.gravidade;
        p.x += p.vx;
        p.y += p.vy;
        p.vida -= 0.016;
        p.giro += p.velGiro;

        ctx.save();
        ctx.globalAlpha = Math.max(p.vida, 0);
        ctx.fillStyle = p.cor;
        ctx.shadowColor = p.cor;
        ctx.shadowBlur = 10;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.giro);
        if (p.estrela) {
            desenharEstrela(p.tamanho * 1.6);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.tamanho / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    if (particulas.length > 0) {
        requestAnimationFrame(animar);
    } else {
        animando = false;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
}

function centroDe(elemento) {
    const r = elemento.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2};
}

function girarRolo(rolo) {
    rolo.classList.remove('parou');
    rolo.classList.add('girando');
}

function pararRolo(rolo, texto) {
    const resultado = rolo.querySelector('.mq-resultado');
    resultado.textContent = texto;
    resultado.classList.toggle('longo', texto.length > 22);

    rolo.classList.remove('girando', 'parou');
    void rolo.offsetWidth;
    rolo.classList.add('parou');

    const { x, y } = centroDe(rolo.querySelector('.mq-janela'));
    explodir(x, y, 22);
}

alavanca.addEventListener('click', async () => {
    if (alavanca.disabled) return;

    alavanca.disabled = true;
    botaoRefinar.classList.add('oculto');
    maquina.classList.remove('celebrando');

    const temaEscolhido = seletorFoco.options[seletorFoco.selectedIndex].text;
    const ideiaPrevia = campoPrevia ? campoPrevia.value.trim() : '';

    alavanca.classList.add('puxada');
    const bola = centroDe(alavanca.querySelector('.mq-bola'));
    explodir(bola.x, bola.y, 12);
    setTimeout(() => alavanca.classList.remove('puxada'), 450);

    rolos.forEach(girarRolo);

    let ideia = null;
    let falhou = false;

    try {
        const [resposta] = await Promise.all([
            fetch('/sortear', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ foco: temaEscolhido, previa: ideiaPrevia })
            }),
            pausa(reduzirMovimento ? 0 : 1400)
        ]);
        
        const dados = await resposta.json();
        if (!resposta.ok || dados.erro) throw new Error('falha');

        const objeto = (dados.objeto || '').trim();
        const acao = (dados.acao || '').trim();
        const desafio = (dados.desafio || '').trim();
        if (objeto && acao && desafio) {
            ideia = { objeto, acao, desafio };
        }
    } catch (erro) {
        console.error('Erro na máquina:', erro);
        falhou = true;
        await pausa(reduzirMovimento ? 0 : 800);
    }

    let textos;
    if (ideia) {
        textos = [ideia.objeto, ideia.acao, ideia.desafio];
    } else if (falhou) {
        textos = [TEXTOS.erro1, TEXTOS.erro2, '!'];
    } else {
        textos = ['?', TEXTOS.tente1, TEXTOS.tente2];
    }

    for (let i = 0; i < rolos.length; i++) {
        await pausa(reduzirMovimento ? 0 : 550);
        pararRolo(rolos[i], textos[i]);
    }

    if (ideia) {
        maquina.classList.add('celebrando');
        setTimeout(() => maquina.classList.remove('celebrando'), 1800);

        const letreiro = centroDe(maquina.querySelector('.mq-letreiro'));
        explodir(letreiro.x, letreiro.y, 50);

        botaoRefinar.classList.remove('oculto');
        botaoRefinar.onclick = () => {
            const params = new URLSearchParams({
                foco: temaEscolhido,
                objeto: ideia.objeto,
                acao: ideia.acao,
                desafio: ideia.desafio
            });
            if (ideiaPrevia) {
                params.set('ideia', ideiaPrevia);
            }
            window.location.href = `/refinador?${params.toString()}`;
        };
    }
    alavanca.disabled = false;
});