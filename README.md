# 🤖 Abhay AI — Voice Portfolio Interface

> An interactive, voice-based AI portfolio that simulates a real phone-call experience. Visitors can call "Abhay" and have a real-time conversation with an AI assistant that answers questions about his background, skills, projects, and more.

---

## 📸 Preview

The app is styled as a mobile phone UI (max-width: 448px), complete with a dark glassmorphic design, animated call interface, live speech recognition, and text-to-speech responses.

---

## 🚀 Features

- 📞 **Simulated Phone Call UI** — A realistic call screen with timer, animated waveforms, and a dialer-style layout
- 🎙️ **Speech-to-Text (STT)** — Uses the browser's native Web Speech API to capture voice input in real-time
- 🔊 **Text-to-Speech (TTS)** — AI responses are read aloud using the browser's SpeechSynthesis API
- 💬 **Chat Interface** — Fallback text-based chat mode for non-voice interactions
- 🧠 **AI-Powered Q&A** — Connects to a backend powered by Groq (LLaMA 3.1) that answers questions from a portfolio knowledge base
- 🪟 **Sidebar Navigation** — Slide-in sidebar with links to GitHub, LinkedIn, and project info
- 📄 **Resume Download** — One-click download of Abhay's resume (PDF)
- 📱 **Mobile-First Design** — Fully responsive, optimized for mobile screens
- 🎨 **Glassmorphism UI** — Dark theme with blur effects, gradients, and smooth animations

---

## 🛠️ Tech Stack

| Category       | Technology                          |
|----------------|-------------------------------------|
| Framework      | React 18 + Vite                     |
| Routing        | React Router DOM v7                 |
| State Management | Recoil                            |
| Animations     | Framer Motion, Lottie React         |
| HTTP Client    | Axios                               |
| Styling        | TailwindCSS v4                      |
| Icons          | React Icons                         |
| Speech API     | Web Speech API (browser native)     |
| Build Tool     | Vite v6                             |

---

## 📁 Project Structure

```
abhay-aicalling-frontend/
├── public/
│   └── abhay_ai.pdf          # Downloadable resume
├── src/
│   ├── assets/
│   │   └── abhay.jpeg        # Profile photo
│   ├── components/
│   │   ├── About.jsx         # "About This Project" page
│   │   ├── Call.jsx          # Landing / home screen (dial to start)
│   │   ├── Callinterface.jsx # Active call screen with voice I/O
│   │   ├── Chatinterface.jsx # Text-based chat mode
│   │   ├── Fallback.jsx      # 404 fallback component
│   │   ├── Formattime.jsx    # Call duration formatter utility
│   │   ├── Loader.jsx        # Loading animation screen
│   │   ├── Sidebar.jsx       # Slide-in navigation sidebar
│   │   ├── Thankyou.jsx      # End-of-call thank you screen
│   │   └── Timer.jsx         # Call timer display
│   ├── css/
│   │   └── index.css         # Global styles and TailwindCSS imports
│   ├── states/
│   │   └── atoms.js          # Recoil state atoms (sidebar toggle, etc.)
│   ├── utils/                # Utility functions
│   ├── App.jsx               # Root component with routing and layout
│   └── main.jsx              # ReactDOM entry point
├── .env                      # Environment variables
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── vercel.json               # Vercel deployment config
```

---

## 🔑 Environment Variables

Create a `.env` file in the root of the project:

```env
VITE_EC2_URL=http://localhost:2001
```

> **Note:** In production, replace `http://localhost:2001` with your deployed backend URL (e.g., AWS EC2, Railway, Render).

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+ installed
- npm v9+
- A running instance of the [backend server](https://github.com/kharetanishk/tanishk-aicalling-backend)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/apy2704/aicalling-frontend.git
cd aicalling-frontend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Edit .env and set VITE_EC2_URL to your backend URL

# 4. Start the development server
npm run dev
```

The app will start at `http://localhost:5173` by default.

---

## 📦 Available Scripts

| Script          | Description                              |
|-----------------|------------------------------------------|
| `npm run dev`   | Start the Vite development server        |
| `npm run build` | Build the production bundle to `/dist`   |
| `npm run preview` | Preview the production build locally  |
| `npm run lint`  | Run ESLint for code quality checks       |

---

## 🌐 Application Routes

| Route               | Component          | Description                                  |
|---------------------|--------------------|----------------------------------------------|
| `/`                 | `Call`             | Home screen — tap to initiate the AI call    |
| `/calling`          | `Loader`           | Loading/connecting animation screen          |
| `/callinginterface` | `Callinterface`    | Active voice call interface with STT/TTS     |
| `/chat`             | `Chatinterface`    | Text-based chat alternative                  |
| `/thankyou`         | `ThankYou`         | Post-call thank you and summary screen        |
| `/aboutproject`     | `Aboutproject`     | Information about how the project works      |
| `*`                 | `Fallback`         | 404 not found fallback                       |

---

## 🎙️ How the Voice Call Works

1. **User lands on home screen** → taps the call button
2. **Loading screen** plays while the app connects to the backend
3. **Call interface activates** → microphone starts listening via Web Speech API
4. **User speaks** → voice is transcribed to text in real-time
5. **Transcribed text is sent** to the backend `/chat` API via Axios
6. **Backend (Groq LLaMA)** processes the query against Abhay's portfolio knowledge base
7. **AI response is returned** and read aloud using the browser's SpeechSynthesis API
8. **Conversation continues** in a turn-based dialogue loop

---

## 🚢 Deployment

The frontend is configured for **Vercel** deployment out of the box.

```bash
# Build for production
npm run build
```

The `vercel.json` file handles SPA routing (redirects all routes to `index.html`).

For other platforms, serve the `/dist` folder with any static file host.

---

## 🔗 Related Repository

- **Backend:** [abhay-backend-aicalling](https://github.com/kharetanishk/tanishk-aicalling-backend) — Express + Groq API server

---

## 👤 Author

**Abhay Pratap Yadav**  
📧 abhyadav2704@gmail.com  
📍 Bhilai, Chhattisgarh, India  
🎓 BCA Student at Shri Shankaracharya Mahavidyalaya (2023–2026)

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).
