# Links2Go 🖥️

A fast URL shortener with a nostalgic analog TV monitor interface, built with modern technologies.

## Features ✨

- **Fast URL Shortening**: Redis-powered backend with sub-100ms response times
- **Retro TV Interface**: Authentic CRT monitor experience with scanlines and phosphor glow
- **Real-time Analytics**: Click tracking with Prometheus metrics
- **QR Code Generation**: Visual QR codes for easy mobile sharing
- **Custom Short Codes**: Personalized URLs with validation
- **Expiring URLs**: Time-limited links with automatic cleanup

## Tech Stack 🛠️

- **Backend**: Node.js 22, TypeScript, Express, Redis
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Monitoring**: Prometheus metrics with custom dashboards
- **Development**: Biome (linting/formatting), Vitest (testing)

## Quick Start with Nix ❄️

The easiest way to get started is using Nix flakes:

```bash
# Clone the repository
git clone https://github.com/malagant/links2go.git
cd links2go

# Enter development environment (installs all dependencies)
nix develop

# Start development servers
start-dev
```

The development environment includes:
- Node.js 22
- Redis server (auto-started)
- All project dependencies
- Development scripts
- **Zsh with Starship prompt** - Beautiful retro-themed terminal
- **Smart aliases** - Shortcuts for common development tasks
- **Auto-completion** - Enhanced command completion

### Available Commands

Once in the Nix shell (with beautiful Starship prompt):

```bash
# Main development commands
dev           # Start both frontend and backend in development mode
test          # Run comprehensive test suite  
build         # Build production-ready packages
clean         # Clean all build artifacts and reset environment

# Redis management
redis-status  # Check Redis connection
redis-start   # Start Redis server
redis-stop    # Stop Redis server

# Navigation shortcuts
backend       # Go to backend directory
frontend      # Go to frontend directory
root          # Go to project root

# Git shortcuts
gs            # git status
ga            # git add
gc            # git commit
gp            # git push
gl            # git log --oneline -10
```

### Using Nix Apps

You can also run commands directly without entering the shell:

```bash
nix run .#dev    # Start development servers
nix run .#test   # Run tests
nix run .#build  # Build for production
nix run .#clean  # Clean project
```

## Manual Setup (without Nix) 🔧

### Prerequisites

- Node.js 22+
- Redis server
- Git

### Installation

1. **Clone and install dependencies:**
```bash
git clone https://github.com/malagant/links2go.git
cd links2go

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies  
cd frontend && npm install && cd ..
```

2. **Start Redis:**
```bash
redis-server
```

3. **Configure environment:**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your settings
```

4. **Start development servers:**
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

## Development Workflow 👩‍💻

### Project Structure
```
links2go/
├── backend/          # Node.js API server
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── services/ # Business logic
│   │   ├── middleware/ # Express middleware
│   │   └── types/    # TypeScript definitions
│   └── package.json
├── frontend/         # React application
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── pages/    # Page components
│   │   └── styles/   # CSS and styling
│   └── package.json
├── flake.nix        # Nix development environment
└── README.md
```

### API Endpoints

- `POST /api/shorten` - Create short URL
- `GET /:shortCode` - Redirect to original URL  
- `GET /api/analytics/:shortCode` - Get click analytics
- `GET /api/qr/:shortCode` - Generate QR code
- `GET /metrics` - Prometheus metrics
- `GET /health` - Health check

### Environment Variables

Backend configuration (`.env`):
```bash
PORT=3001
BASE_URL=http://localhost:3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

## Testing 🧪

```bash
# Run all tests
run-tests  # (in Nix shell)
# or
npm test   # (manual setup)

# Run with coverage
npm run test:coverage
```

## Production Deployment 🚀

### Build for Production

```bash
# Using Nix
nix run .#build

# Manual
npm run build
```

### Docker Deployment

```bash
# Build images
docker build -t links2go-backend ./backend
docker build -t links2go-frontend ./frontend

# Run with docker-compose
docker-compose up -d
```

## Monitoring 📊

The application includes comprehensive Prometheus metrics:

- Request duration and count
- URL creation and redirect metrics  
- Redis operation metrics
- System health indicators

Access metrics at `http://localhost:3001/metrics`

## Contributing 🤝

1. **Set up development environment:**
   ```bash
   nix develop  # Preferred
   # or follow manual setup above
   ```

2. **Make your changes**

3. **Run tests and linting:**
   ```bash
   run-tests
   npm run lint
   npm run format
   ```

4. **Submit a pull request**

### Code Style

We use Biome for consistent code formatting and linting:
```bash
npm run format  # Format code
npm run lint    # Check for issues
npm run check   # Run both format and lint
```

## License 📄

MIT License - see [LICENSE](LICENSE) file for details.

---

**Enjoy the retro computing experience! 🖥️✨**
