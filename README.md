# IZObret - Idea Incubator for Young Inventors

**IZObret** is a web-based learning platform and invention lab designed to encourage scientific thinking, creativity, and real-world problem-solving among kids and teens ages 8 to 14.

It guides young makers through an interactive multi-step journey, transforming abstract ideas into structured hypotheses and actionable experiments.

---

## Features

- **The Spark Machine (Stage 1):** An arcade-style random generator that combines unlikely physical objects, actions, and real-world challenges (such as UN SDGs, Sustainability, and Accessibility).
- **The Scientific Refiner (Stage 2):** An interactive hypothesis notebook where kids articulate what they expect to happen and design practical tests to verify their idea. Includes an integrated AI Science Mentor that asks open-ended questions to challenge their reasoning.
- **Bilingual Interface (i18n):** Native language toggling between Brazilian Portuguese (`pt-BR`) and English (`en`) using Flask-Babel.
- **Playful Design:** Built with tactile 3D buttons, interactive CSS spring animations for the slot machine lever, and custom typography (*Nunito Sans* and *Russo One*).

---

## How to Play / User Guide

Once the project is running, follow these steps to use the platform:

1. **Start at the Homepage:** Open `http://localhost:5000` in your web browser. You can click the **PT | EN** toggle in the top navigation bar at any time to switch languages.
2. **Go to the Spark Machine:** Click on **"Start the Spark Machine"** (or use the top navigation menu).
3. **Choose a Challenge Focus:** Use the dropdown menu to select an invention focus (e.g., *Social Problems / UN SDGs*, *Energy & Sustainability*, *Accessibility*, or *Games*).
4. **Pull the Lever:** Click on the mechanical red lever. Watch the slot machine spin and roll three elements: an **Object**, an **Action**, and a **Challenge**.
5. **Refine Your Idea:** When the combination appears, click **"Refine this idea ->"**.
6. **Write Your Hypothesis:** In the notebook, describe what you think will happen if someone builds this invention and propose a simple test or experiment.
7. **Ask the AI Professor:** Click **"Ask the AI Professor"** to get personalized encouragement and guiding questions designed to help you think like a detective.

---

## How to Run Locally

Follow these step-by-step instructions to get the project running on your local machine:

### 1. Prerequisites
Make sure you have installed on your computer:
- **Python 3.10+**
- **Git**

### 2. Clone the repository
```bash
git clone https://github.com/pedrohzed/IZObret.git
cd IZObret
```

### 3. Set up a virtual environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Linux / macOS
# On Windows: venv\Scripts\activate
```

### 4. Install dependencies
```bash
pip install -r requirements.txt
```

### 5. Configure environment variables
Create a `.env` file from the provided example:
```bash
cp .env.example .env
```
Open `.env` in your text editor and fill in your keys:
```env
SECRET_KEY=your_secret_flask_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```
*(You can obtain a free Gemini API key at [Google AI Studio](https://aistudio.google.com/)).*

### 6. Compile translations
Compile the multi-language PO catalogs into binary MO files:
```bash
pybabel compile -d translations
```

### 7. Run the application
```bash
python app.py
```
Open your browser and visit: **`http://localhost:5000`**

---

## Tech Stack

- **Backend:** Python 3, Flask, Gunicorn
- **Internationalization:** Flask-Babel
- **Frontend:** Semantic HTML5, CSS3 (Flexbox/Grid), Vanilla JavaScript
- **AI Integration:** Google GenAI SDK (Gemini Flash) with structured JSON output
- **Fonts:** Google Fonts (*Nunito Sans*, *Russo One*)

---

## Project Structure

```text
IZObret/
├── static/
│   ├── images/          # Platform logos and graphics
│   ├── faiscas.js       # Slot machine interaction and API calls
│   ├── refinador.js     # Notebook logic and AI mentor calls
│   └── style.css        # Global layout and responsive styling
├── templates/
│   ├── index.html       # Landing page and lab overview
│   ├── faiscas.html     # Stage 1: The Spark Machine
│   ├── refinador.html   # Stage 2: The Scientific Refiner
│   └── ods.html         # Supporting information on UN SDGs
├── translations/        # English and Portuguese language catalogs
├── app.py               # Flask application routes and API logic
├── requirements.txt     # Python dependencies
└── README.md
```

---

## License

This project is created for educational purposes and to inspire youth engagement in science and problem-solving.
