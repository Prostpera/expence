# EXPence
<img src="expence_app/public/just_briefcase.png" alt="briefcase" width="100"/>

EXPence is an innovative financial literacy web application targeting Generation Z (born 1997-2012) that combines gamification, AI technology, and personalized learning. It addresses the critical issue of low financial literacy among young adults by transforming financial education into an engaging RPG-style experience.

## Overview

Users can:
- Complete AI-generated quests tailored to their financial goals
- Earn rewards and advance through skill levels
- Learn essential money management concepts in an engaging way
- Connect with friends and compete on leaderboards
- Get personalized financial advice from an AI assistant

Unlike existing financial apps that focus solely on tracking or advice, EXPence uniquely integrates AI-driven quest generation, personalized financial tips, and community features with RPG gaming elements to create an immersive learning environment.

## Getting Started

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

## Project Structure

```
expence/
├── expence_app/
│   ├── public/                   # Static assets and images
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/              # API routes
│   │   │   │   ├── quests/       # Quest API endpoints
│   │   │   │   ├── user/         # User management
│   │   │   │   ├── chat/         # AI chatbot API
│   │   │   │   ├── notifications/ # Notification system
│   │   │   │   └── csuf-auth/    # CSUF authentication
│   │   │   ├── auth/             # Authentication pages
│   │   │   ├── dashboard/
│   │   │   │   ├── leaderboard/  # Leaderboard feature
│   │   │   │   ├── quests/       # Quest management
│   │   │   │   ├── social/       # Social features
│   │   │   │   ├── learning-quest/ # Educational quests
│   │   │   │   └── story-quest/  # Story-based quests
│   │   │   └── layout.tsx        # App layout
│   │   ├── components/
│   │   │   ├── auth/             # Authentication components
│   │   │   ├── ChatbotModal.tsx  # AI advisor chatbot
│   │   │   ├── Header.tsx        # Navigation header
│   │   │   ├── QuestCard.tsx     # Quest display component
│   │   │   └── QuestModal.tsx    # Quest details modal
│   │   ├── contexts/             # React contexts
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utility libraries
│   │   ├── services/             # Business logic services
│   │   └── types/                # TypeScript type definitions
│   ├── __tests__/                # Test files
│   ├── sql/                      # Database schema and migrations
│   ├── scripts/                  # Build and utility scripts
│   ├── coverage/                 # Test coverage reports
│   └── package.json
└── README.md
```

## Main Features

### Dashboard

The central hub of the application where users can see their progress, level, and quick access to all features. The dashboard provides an overview of:

- Current level and EXP
- Active quests
- Recent achievements
- Friend activity

### Quests

The financial literacy tasks that users complete to earn experience points and progress through the game:

- AI-generated quests based on personal financial goals
- Learning quests for educational content
- Story-based quests for immersive scenarios
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
- Integration with Anthropic Claude for advanced conversations

### Notifications

Stay engaged with real-time updates:

- Quest completion notifications
- Achievement unlocks
- Friend activity updates
- Daily login streaks

## Technologies Used

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Language**: TypeScript
- **State Management**: React Context API, React Hook Form
- **AI Integration**: LangChain, Anthropic Claude, OpenAI
- **Authentication**: Supabase Auth, AWS Cognito
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **Testing**: Jest, React Testing Library
- **Validation**: Zod
- **Deployment**: Vercel

## Development & Testing

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run test:watch` - Run tests in watch mode

### Testing

The project includes comprehensive test coverage for:
- AI quest generation
- Authentication flows
- Chatbot functionality
- Component integration

Run `npm run test:coverage` to view detailed coverage reports.

## Operations Plan

### Current Status
- **Development Phase**: Beta/Pre-production
- **Infrastructure**: Deployed on Vercel with Supabase backend
- **Database**: PostgreSQL with real-time capabilities
- **Authentication**: Multi-provider support (Supabase, AWS Cognito)

### Deployment Strategy

#### Production Environment
- **Platform**: Vercel (primary), with fallback deployment options
- **Database**: Supabase PostgreSQL with automated backups
- **CDN**: Integrated with Vercel Edge Network
- **Monitoring**: Built-in error tracking and performance monitoring

#### CI/CD Pipeline
- **Source Control**: GitHub with feature branch workflow
- **Automated Testing**: Jest test suite runs on every PR
- **Build Process**: Automated via Vercel on push to main branch
- **Quality Gates**: ESLint, TypeScript checks, test coverage requirements

### Scaling Considerations

#### Performance Optimization
- **Caching Strategy**: Static asset caching via Vercel CDN
- **Database Optimization**: Indexed queries, connection pooling
- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js Image component with WebP support

#### Capacity Planning
- **User Growth**: Current architecture supports 10K+ concurrent users
- **Database Scaling**: Supabase auto-scaling for growing datasets
- **API Rate Limiting**: Implemented to prevent abuse
- **Cost Management**: Usage-based pricing with monitoring alerts

### Security & Compliance

#### Data Protection
- **Authentication**: Multi-factor authentication support
- **Data Encryption**: At rest and in transit
- **Privacy**: GDPR-compliant data handling
- **Session Management**: Secure token-based authentication

#### Monitoring & Alerting
- **Application Health**: Real-time error tracking
- **Performance Metrics**: Core Web Vitals monitoring
- **Database Health**: Query performance and connection monitoring
- **Security Alerts**: Automated threat detection

### Maintenance & Support

#### Regular Tasks
- **Security Updates**: Monthly dependency updates
- **Database Maintenance**: Weekly backup verification
- **Performance Reviews**: Quarterly optimization assessments
- **User Feedback Integration**: Continuous feature iteration

#### Emergency Procedures
- **Incident Response**: 24-hour response time for critical issues
- **Data Recovery**: Point-in-time recovery capabilities
- **Rollback Strategy**: Blue-green deployment for safe rollbacks
- **Communication Plan**: User notification system for outages

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

EXPence - Leveling up your financial literacy, one quest at a time!
