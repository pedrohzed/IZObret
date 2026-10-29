# Devlog: Building IZObret

For the past couple of weeks, I've been building a project called IZObret. It is an idea incubator aimed at kids and teens between 8 and 14 years old, designed to help them turn scattered, random thoughts into structured inventions using basic scientific thinking.

A lot of young makers either don't know where to start or jump straight to trying to build something without thinking about the problem first. The idea here is to give them a guided path that still feels like playing a game.

---

### What I actually built

The application currently has two core modules running:

1. **The Spark Machine:** Instead of staring at a blank page, users select a broad theme (like UN Sustainable Development Goals, energy, or accessibility) and pull an animated lever. The system rolls three distinct elements: a physical object, an action, and a specific problem to solve. For example, pairing a drone with water purification to tackle river pollution.
2. **The Scientific Refiner:** Once an idea is generated, it gets carried over into a notebook interface. Here, the user writes down a hypothesis ("What do I expect to happen if this exists?") and designs a simple test to verify it. There is an integrated science mentor bot powered by the Gemini API that reviews what they wrote, points out missing details, and asks guiding questions rather than just handing them answers.
3. **Bilingual Support:** Everything runs in both Portuguese and English using Flask-Babel, including the language model prompts and interface strings.

---

### Tech stack decisions

I deliberately avoided heavy front-end frameworks like React or Tailwind for this project. My goal was to get a solid grasp of fundamentals, so the stack is intentionally minimal:

- **Backend:** Python with Flask
- **Frontend:** Plain HTML5, custom CSS, and vanilla JavaScript
- **AI Backend:** Google GenAI SDK (Gemini Flash) with structured JSON responses
- **Translations:** Flask-Babel (PO/MO catalog workflows)
- **Deployment:** Render with Gunicorn

Writing pure CSS for the entire UI took more time upfront, but it allowed me to build specific components from scratch, like the mechanical spring animation for the lever and tactile 3D button states, without dealing with complex build pipelines.

---

### Problems I ran into and how I fixed them

- **Passing translations to JavaScript:** I needed frontend scripts to display error states and loading text in the selected language. Placing Jinja tags directly inside JavaScript files breaks syntax highlighting and editor linters. I ended up injecting localized JSON dictionaries inside `<script type="application/json">` blocks in the HTML and reading them with `JSON.parse` in the client script.
- **Push protection headache:** During early testing, I hardcoded an API key directly in my route file. Even after replacing it with `os.getenv`, GitHub blocked my push because the raw string remained inside an older commit in the Git history. I had to soft-reset back before that commit, ensure `.gitignore` properly covered my `.env`, and rewrite the commit cleanly.
- **Maintaining page context across language switches:** Clicking the language toggle originally redirected users back to the homepage, which was frustrating if they had already generated an idea in the machine. I reworked the route to inspect `request.referrer` and update the session state while keeping the user on the same path.

---

### What comes next

The next step is building the third phase of the lab, which is a canvas/kanban board where users can break their invention into small, actionable tasks (materials needed, steps to build a prototype, and test logs).

The code is available here: https://github.com/pedrohzed/IZObret

