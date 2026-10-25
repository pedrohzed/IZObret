const TEXTOS = JSON.parse(document.getElementById('dados-textos').textContent);

const botaoAlavanca = document.querySelector('.alavanca');
const seletorFoco = document.querySelector('#foco');

const visorObjeto = document.querySelectorAll('.slot-resultado')[0];
const visorAcao = document.querySelectorAll('.slot-resultado')[1];
const visorDesafio = document.querySelectorAll('.slot-resultado')[2];

const botaoRefinar = document.getElementById('btn-ir-refinar');

botaoAlavanca.addEventListener('click', async () =>{
    if (botaoRefinar) botaoRefinar.classList.add('oculto');
    const temaEscolhido = seletorFoco.options[seletorFoco.selectedIndex].text;
    visorObjeto.textContent = "...";
    visorAcao.textContent = "...";
    visorDesafio.textContent = "...";
    botaoAlavanca.classList.add('puxada');
    botaoAlavanca.disabled = true;

    try {
        const resposta = await fetch('/sortear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ foco: temaEscolhido})
        });

        const dados = await resposta.json();
        const ideias = dados.resultado.split(',');

        if (ideias.length >= 3) {
            const obj = ideias[0].trim();
            const ac = ideias[1].trim();
            const des = ideias[2].trim();
            visorObjeto.textContent = obj;
            visorAcao.textContent = ac;
            visorDesafio.textContent = des;

            if (botaoRefinar) {
                botaoRefinar.classList.remove('oculto');
                botaoRefinar.onclick = () => {
                    const params = new URLSearchParams({
                        foco: temaEscolhido,
                        objeto: obj,
                        acao: ac,
                        desafio: des
                    });
                    window.location.href = `/refinador?${params.toString()}`;
                };
            }
        } else {
            visorObjeto.textContent = "?";
            visorAcao.textContent = TEXTOS.tente1;
            visorDesafio.textContent = TEXTOS.tente2;
        }
    } catch (erro) {
        console.error("Erro na máquina:", erro);
        visorObjeto.textContent = TEXTOS.erro1;
        visorAcao.textContent = TEXTOS.erro2;
        visorDesafio.textContent = "!";
    } finally {
        botaoAlavanca.classList.remove('puxada');
        botaoAlavanca.disabled = false;
    }
});