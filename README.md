# IZObret - Incubadora de Ideias

O **IZObret** é uma plataforma web criada para incentivar o pensamento científico, a criatividade e a resolução de problemas reais entre crianças e jovens de 8 a 14 anos.

A proposta é guiar pequenos inventores através de um método simples em etapas, transformando ideias abstratas em hipóteses estruturadas e projetos práticos.

---

## 🚀 Funcionalidades

- **Máquina de Faíscas:** Sorteador de combinações improváveis para gerar faíscas criativas a partir de temas reais (como ODS da ONU, Sustentabilidade e Inclusão).
- **Refinador Científico (Caderno de Hipóteses):** Interface para a criança estruturar sua hipótese e planejar testes e experimentos práticos.
- **Suporte a Internacionalização (i18n):** Alternância completa de idioma entre Português (`pt-BR`) e Inglês (`en`) utilizando Flask-Babel.
- **Identidade Visual Temática:** Interface com botões táteis em 3D, fontes personalizadas (*Nunito Sans* e *Russo One*) e design responsivo.

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** Python 3 & Flask
- **Internacionalização:** Flask-Babel
- **Frontend:** HTML5 semântico, CSS3 puro e JavaScript vanilla
- **Tipografia:** Google Fonts (*Nunito Sans*, *Russo One*)

---

## 📦 Como Executar o Projeto Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/pedrohzed/IZObret.git
cd IZObret
```

### 2. Criar e ativar o ambiente virtual
```bash
python3 -m venv venv
source venv/bin/activate  # Linux / macOS
# No Windows: venv\Scripts\activate
```

### 3. Instalar as dependências
```bash
pip install -r requirements.txt
```

### 4. Configurar as variáveis de ambiente
Crie um arquivo `.env` baseado no `.env.example`:
```bash
cp .env.example .env
```
Preencha sua chave de API e chave secreta no arquivo `.env`.

### 5. Compilar as traduções
```bash
pybabel compile -d translations
```

### 6. Executar o servidor
```bash
python app.py
```
Acesse a aplicação no navegador em: `http://localhost:5000`

---

## 📁 Estrutura de Diretórios

```text
IZObret/
├── static/
│   ├── images/          # Imagens e logotipos
│   ├── faiscas.js       # Lógica da Máquina de Faíscas
│   ├── refinador.js     # Lógica do Caderno de Hipóteses
│   └── style.css        # Folha de estilos global
├── templates/
│   ├── index.html       # Página inicial do laboratório
│   ├── faiscas.html     # Etapa 1: Máquina de Faíscas
│   ├── refinador.html   # Etapa 2: Refinador Científico
│   └── ods.html         # Página de apoio sobre as ODS
├── translations/        # Catálogo de idiomas (PO/MO)
├── app.py               # Servidor e rotas da aplicação
├── requirements.txt     # Dependências do projeto
└── README.md
```

---

## 📄 Licença

Este projeto é desenvolvido para fins educacionais e de incentivo à ciência para jovens criadores.

