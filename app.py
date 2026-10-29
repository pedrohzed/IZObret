import json
import os
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_babel import Babel, get_locale
from google import genai
from google.genai import types

load_dotenv()
app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev-secret-key-izobret-2026")
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

IDIOMAS = ["pt", "en"]

def escolher_idioma():
    return session.get("idioma") or request.accept_languages.best_match(IDIOMAS) or "pt"

babel = Babel(app, locale_selector=escolher_idioma)

@app.context_processor
def injetar_idioma():
    return {"idioma": str(get_locale())}

@app.route("/idioma/<codigo>")
def trocar_idioma(codigo):
    if codigo in IDIOMAS:
        session["idioma"] = codigo
    return redirect(request.referrer or url_for("home"))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/faiscas')
def maquina_de_faiscas():
    return render_template('faiscas.html')

@app.route('/refinador')
def refinador():
    foco = request.args.get('foco', '')
    objeto = request.args.get('objeto', '')
    acao = request.args.get('acao', '')
    desafio = request.args.get('desafio', '')
    return render_template('refinador.html', foco=foco, objeto=objeto, acao=acao, desafio=desafio)

@app.route('/ods')
def ods():
    return render_template('ods.html')

@app.route('/refinar', methods=['POST'])
def refinar():
    dados = request.get_json() or {}
    idioma = "English (US)" if str(get_locale()) == "en" else "português do Brasil"
    prompt = f"""
    
você é um professor de ciências divertido e curioso, conversando com uma criança com idade entre 8 a 14 anos que está inventando uma solução para um problema real.

Ideia sorteada:
- Foco: {dados.get('foco', '')}
- Objeto: {dados.get('objeto', '')}
- Ação: {dados.get('acao', '')}
- Desafio: {dados.get('desafio', '')}

O que a criança escreveu:
- Hipótese: {dados.get('hipotese') or '(ainda não escreveu)'}
- Plano de teste: {dados.get('teste') or '(ainda não escreveu)'}
Regras:
1. NUNCA entregue a resposta pronta e nem reescreva a hipótese ou o teste por ela.
2. Faça perguntas que a façam pensar (o que você espera que aconteça? como saber se funcionou? o que você mediria? o que poderia dar errado?)
3. Se algum campo estiver vazio, ajude a começar com uma pergunta ou um exemplo de outro tema.
4.Use linguagem simples, curta e animada. Responda INTEIRAMENTE em {idioma}.

Devolva APENAS um JSON neste formato:
{{"elogio": "uma frase elogiando algo concreto", "perguntas": ["pergunta 1", "pergunta 2", "pergunta 3"]}}
"""
    
    try:
        resposta = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json"),
        )
        return json.loads(resposta.text)
    except Exception as erro:
        print("Erro no refinador:", erro)
        return {"erro": True}, 500

@app.route('/sortear', methods=['POST'])
def sortear_ideias():
    idioma = "English (US)" if str(get_locale()) == "en" else "português do Brasil"
    dados = request.get_json() or {}
    foco = dados.get('foco', '')

    instrucao = f"""Você é uma máquina de ideias para crianças inventoras. O tema escolhido foi: {foco}. Responda INTEIRAMENTE em {idioma}. Devolva APENAS um JSON válido neste formato:
{{"objeto": "um objeto físico", "acao": "um verbo de ação", "desafio": "um desafio a resolver"}}
Exemplo: {{"objeto": "Robô submarino", "acao": "Purificar", "desafio": "Água poluída do rio"}}"""

    try:
        resposta = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=instrucao,
            config=types.GenerateContentConfig(response_mime_type="application/json"),
        )
        return jsonify(json.loads(resposta.text))
    except Exception as erro:
        print("Erro no sorteio:", erro)
        return jsonify({"erro": True}), 500

if __name__ == '__main__':
    app.run(debug=True) 