Mosseb AI
Mosseb AI is a 3D and AI-powered student social media platform designed to connect students with companies, peers, and collaborative opportunities. This platform enables intelligent interaction, multilingual communication, and advanced AI-driven analytics to enhance the student experience.
🌟 Features
Student Networking: Connect students to companies, projects, or other students for collaboration.
AI-Powered Chatbots: Multiple chatbots capable of communicating in English, Amharic, Arabic, Russian, and French.
Content Analysis: All posts are analyzed and understood by AI for trends, insights, and moderation.
University Integration: Universities can create accounts to monitor, manage, and remove fraudulent or illegal content.
3D Interactive Design: Attractive 3D interface for engaging user experience.
Real-Time Interaction: Fast and responsive platform for seamless communication.
🛠 Tech Stack
Frontend: React.js, Tailwind CSS, 3D visualization libraries
Backend: Node.js, Express.js
AI & APIs: TypeScript, Gemini API, Large Language Models (LLMs)
Database: mongodb 
Other Tools: WebSocket or real-time communication tools (if any)
⚡ Installation
Clone the repository
git clone https://github.com//mosseb-ai.gbiruk123it
cd mosseb-ai
Install backend dependencies
Bash
cd backend
npm install
Install frontend dependencies
Bash
cd ../frontend
npm install
Set up environment variables
Create a .env file in both backend and frontend folders and add your API keys and database credentials:
Env
Copy code
# Backend example
PORT=5000
DB_URI=your_database_uri
GEMINI_API_KEY=notpulic_gemini_api_key
LLM_API_KEY=your_llm_api_key

# Frontend example
REACT_APP_API_URL=http://localhost:5000
Run the project
Bash
# Start backend
cd backend
npm run dev

# Start frontend
cd frontend
npm start
Open your browser at http://localhost:3000 to explore Mosseb AI.
🎯 Usage
Sign up as a student or university.
Explore the 3D social media environment.
Chat with AI-powered chatbots in multiple languages.
Post, analyze, and share content intelligently.
Universities can moderate content and manage student activity.
1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
