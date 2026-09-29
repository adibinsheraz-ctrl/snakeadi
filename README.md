# Snake Arena

A premium 3D multiplayer snake game with AI-powered documentation, built with Next.js 14, React Three Fiber, and Supabase.

## 🎮 Features

- **Cinematic 3D Gameplay**: Live Three.js snake with smooth interpolation
- **Multiple Game Modes**: Classic, Endless, and Time Attack
- **Unlockable Content**: 6+ skins and themes based on score milestones
- **Power-ups**: Slow-mo, Double Points, and Ghost Mode
- **Real-time Leaderboard**: Server-validated scores with anti-cheat
- **AI Documentation Center**: Auto-generated docs with interactive diagrams
- **Mobile-First Design**: Touch controls, haptic feedback, safe area insets
- **Accessibility**: Keyboard navigation, reduced motion, colorblind mode

## 🚀 Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd snake-game

# Install dependencies
npm install

# Copy environment template and add your keys
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Anthropic API key (for AI docs feature)

## ⚙️ Environment Setup

Create a `.env.local` file with these variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic API (for AI docs)
ANTHROPIC_API_KEY=your_anthropic_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Snake Arena"
```

### Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your project URL and anon key
4. Run the database migrations (coming in Phase 2)

## 🎯 Project Structure

```
snake-game/
├── app/                 # Next.js App Router pages and API routes
├── components/          # React components (game, landing, docs, UI)
├── lib/
│   ├── game/           # Game engine, types, and config
│   ├── supabase/       # Database client and types
│   ├── hooks/          # Custom React hooks
│   └── utils/          # Utility functions
├── docs/               # MDX documentation files
├── public/             # Static assets (audio, images, icons)
└── scripts/            # Build and generation scripts
```

## 🛠️ Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run docs:generate    # Generate AI-powered documentation
npm run docs:validate    # Validate documentation completeness
```

## 🎮 Controls

### Keyboard
- **Arrow Keys** or **WASD**: Control snake direction
- **Space/Escape**: Pause/Resume game
- **P**: Pause
- **R**: Restart

### Touch
- **Swipe**: Control direction
- **On-screen D-pad**: Alternative touch controls
- **Tap**: Pause/Resume

### Gamepad
- **Left Stick/D-pad**: Control direction
- **A Button**: Pause/Resume
- **Start Button**: Start new game

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **3D Engine**: Three.js + React Three Fiber
- **Database**: Supabase (PostgreSQL)
- **State**: Zustand
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Validation**: Zod
- **AI**: Anthropic Claude API

## 🏗️ Development Phases

### ✅ Phase 1: Foundation (Complete)
- Project scaffolding and configuration
- Type system and game engine architecture
- Database schema and API structure
- Security headers and performance setup

### 🚧 Phase 2: Snake Engine (In Progress)
- 3D rendering with React Three Fiber
- Fixed timestep physics loop
- Input handling and collision detection
- Power-ups and skin/theme system

### 📅 Phase 3: AI Documentation
- MDX documentation rendering
- Live Mermaid diagrams
- AI-powered "Ask the Docs" assistant
- Auto-generation from codebase

### 📅 Phase 4: Backend & Leaderboard
- Score submission API with validation
- Anti-cheat move log verification
- Real-time leaderboard
- Admin dashboard

### 📅 Phase 5: Polish & Testing
- Audio system
- Animations and transitions
- Unit and E2E tests
- Lighthouse optimization

### 📅 Phase 6: Deployment
- Production build
- Vercel deployment
- Monitoring and analytics
- Client handover

## 🎨 Game Modes

### Classic
Walls kill on collision. Traditional snake gameplay with increasing difficulty.

### Endless
Snake wraps around edges. Focus on high scores without wall obstacles.

### Time Attack
90-second challenge. Race against the clock for maximum score.

## 🏆 Leaderboard

- **Daily**: Top scores from the last 24 hours
- **Weekly**: Top scores from the last 7 days
- **All-Time**: Hall of fame for highest scores ever

All scores are server-validated using move log verification to prevent cheating.

## 🎭 Customization

### Skins (6 unlockable)
- Classic Green (default)
- Neon Pulse (500 points)
- Inferno (1,500 points)
- Frostbite (3,000 points)
- Golden Legend (5,000 points)
- Prism (10,000 points)

### Themes (6 unlockable)
- Midnight (default)
- Synthwave (1,000 points)
- Matrix (25 games played)
- Deep Ocean (1 hour playtime)
- Void (7,500 points)
- Accessibility (default, colorblind-safe)

## ♿ Accessibility

- Full keyboard navigation
- ARIA labels and semantic HTML
- Reduced motion mode
- Colorblind-safe theme
- Screen reader support
- Configurable controls

## 🔒 Security

- Content Security Policy headers
- Input validation with Zod
- Rate limiting on API routes
- SQL injection prevention
- XSS protection
- Environment variable validation

## 📈 Performance

- Mobile-first responsive design (360px → scale)
- Instanced meshes for 3D rendering
- Object pooling to reduce GC
- Adaptive quality based on FPS
- Code splitting and tree shaking
- Image optimization (AVIF/WebP)

## 🧪 Testing

```bash
npm run test          # Run unit tests
npm run test:e2e      # Run E2E tests with Playwright
npm run test:watch    # Watch mode for development
```

## 📚 Documentation

Full documentation available at `/docs` route when running the app, or view the MDX files in the `docs/` directory.

Generate fresh documentation:
```bash
npm run docs:generate
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# Or use Vercel CLI
npm i -g vercel
vercel --prod
```

### Manual Deployment

```bash
npm run build
npm run start
```

## 🤝 Contributing

This is a client project. For issues or suggestions, contact the development team.

## 📄 License

Proprietary - All rights reserved.

## 👨‍💻 Built By

**Adi Binsheraz**  
Instagram: [@adibinsheraz](https://instagram.com/adibinsheraz)

---

For detailed documentation, architecture diagrams, and API reference, visit `/docs` when running the application.