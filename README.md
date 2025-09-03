# EXPence 💰✨ 
<img src="expence_app/public/just_briefcase.png" alt="briefcase" width="100"/>

EXPence is an innovative financial literacy web application targeting Generation Z (born 1997-2012) that combines gamification, AI technology, and personalized learning. It addresses the critical issue of low financial literacy among young adults by transforming financial education into an engaging RPG-style experience.

## 📝 Overview

Users can:
- Complete AI-generated quests tailored to their financial goals
- Earn rewards and advance through skill levels
- Learn essential money management concepts in an engaging way
- Connect with friends and compete on leaderboards
- Get personalized financial advice from an AI assistant

Unlike existing financial apps that focus solely on tracking or advice, EXPence uniquely integrates AI-driven quest generation, personalized financial tips, and community features with RPG gaming elements to create an immersive learning environment.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Prostpera/expence.git
cd expence/expence_app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🏗️ Project Structure

```
expence/
├── node_modules/
├── expence_app/
│   ├── public/
│   │   └── assets/      # Images and static assets
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/
│   │   │   │   ├── leaderboard/  # Leaderboard feature
│   │   │   │   ├── quests/       # Quests feature
│   │   │   │   ├── social/       # Social features
│   │   │   │   └── page.tsx      # Dashboard main page
│   │   │   └── page.tsx          # Login screen
│   │   ├── components/
│   │   │   ├── ChatbotModal.tsx  # AI advisor chatbot
│   │   │   ├── Header.tsx        # Navigation header
│   │   │   ├── QuestCard.tsx     # Quest display component
│   │   │   └── QuestModal.tsx    # Quest details modal
│   │   └── styles/               # Global styles
│   ├── package.json
│   └── package-lock.json
├── README.md
└── package.json
```

## 🖥️ Main Features

### Dashboard

The central hub of the application where users can see their progress, level, and quick access to all features. The dashboard provides an overview of:

- Current level and EXP
- Active quests
- Recent achievements
- Friend activity

### Quests

The financial literacy tasks that users complete to earn experience points and progress through the game:

- AI-generated quests based on personal financial goals
- Different difficulty levels with corresponding rewards
- Quest categories (saving, investing, debt management, etc.)
- Progress tracking and completion rewards

### Social Features

Connect with friends and engage in friendly competition:

- Add and manage friends
- View friends' progress and achievements
- Leaderboards showing top performers
- Collaborative challenges

### AI Advisor

Get personalized financial guidance:

- Chat-based interface for asking financial questions
- Personalized advice based on user goals and progress
- Financial concept explanations in simple terms

## 🛠️ Technologies Used

- **Frontend**: Next.js, React, TailwindCSS
- **State Management**: React Context API
- **AI Integration**: LangChain framework
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **Authentication**: [TBD]
- **Database**: [TBD]

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- Joann Sum
- John-Leon Rivera
- Nicholas Wilcoxen
- Oyinkansola Olayinka

---

EXPence - Leveling up your financial literacy, one quest at a time! 🚀
