# Contributing to Links2Go

Thank you for your interest in contributing to Links2Go! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- [Nix](https://nixos.org/download.html) with flakes enabled (recommended)
- OR Node.js 22+ and Redis (manual setup)

### Development Environment Setup

#### Option 1: Nix (Recommended)

```bash
# Clone the repository
git clone https://github.com/malagant/links2go.git
cd links2go

# Enter development environment
nix develop

# Start development servers
start-dev
```

#### Option 2: Manual Setup

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Start Redis
redis-server

# Configure environment
cp backend/.env.example backend/.env

# Start servers
cd backend && npm run dev &
cd frontend && npm run dev &
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Follow the existing code style and patterns
- Write tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
run-tests  # (in Nix shell)
# or
npm run test:backend && npm run test:frontend

# Run linting and formatting
npm run lint
npm run format
```

### 4. Commit Your Changes

We use conventional commit messages:

```bash
git commit -m "feat: add QR code generation for shortened URLs"
git commit -m "fix: resolve Redis connection timeout issue"
git commit -m "docs: update API documentation"
```

### 5. Submit a Pull Request

- Push your branch to GitHub
- Create a pull request with a clear description
- Link any related issues

## Code Style Guidelines

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper TypeScript typing for props
- Follow the retro TV aesthetic guidelines

### Backend Code

- Use async/await over promises
- Implement proper error handling
- Add appropriate logging
- Follow REST API conventions

### CSS/Styling

- Use Tailwind CSS utility classes
- Maintain the retro TV monitor aesthetic
- Follow the established color scheme:
  - Phosphor green: `#00ff41`
  - CRT background: `#000000`
  - Retro text: `#00ff41`

## Project Structure

```
links2go/
├── backend/              # Node.js API server
│   ├── src/
│   │   ├── routes/       # Express routes
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Express middleware
│   │   ├── types/        # TypeScript definitions
│   │   ├── config/       # Configuration
│   │   └── utils/        # Utility functions
│   ├── tests/            # Backend tests
│   └── package.json
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API client
│   │   ├── types/        # TypeScript definitions
│   │   └── styles/       # CSS and styling
│   ├── tests/            # Frontend tests
│   └── package.json
├── flake.nix            # Nix development environment
├── package.json         # Root package configuration
└── docs/                # Additional documentation
```

## Testing Guidelines

### Backend Tests

- Write unit tests for services and utilities
- Write integration tests for API endpoints
- Test error conditions and edge cases
- Mock external dependencies (Redis, etc.)

### Frontend Tests

- Test component rendering and behavior
- Test user interactions
- Test API integration
- Use React Testing Library patterns

### Test Commands

```bash
# Run all tests
run-tests

# Run backend tests only
cd backend && npm test

# Run frontend tests only  
cd frontend && npm test

# Run tests with coverage
npm run test:coverage
```

## API Guidelines

### Endpoint Patterns

- Use RESTful conventions
- Include proper HTTP status codes
- Return consistent JSON responses
- Include error details in error responses

### Request/Response Format

Success response:
```json
{
  "success": true,
  "data": {
    // response data
  }
}
```

Error response:
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

### Authentication (Future)

When implementing authentication:
- Use JWT tokens
- Include rate limiting
- Implement proper CORS policies

## Performance Guidelines

### Backend Performance

- Keep response times under 100ms for redirects
- Use Redis efficiently (connection pooling)
- Implement proper caching strategies
- Monitor with Prometheus metrics

### Frontend Performance

- Optimize bundle size
- Use lazy loading for components
- Minimize re-renders
- Optimize images and assets

## Documentation

### Code Documentation

- Add JSDoc comments to public functions
- Document complex algorithms
- Include usage examples
- Keep comments up to date

### API Documentation

- Document all endpoints
- Include request/response examples
- Document error conditions
- Update OpenAPI spec when available

### Screenshots

When UI changes significantly, update screenshots:

```bash
# Start the application
nix develop
dev

# Use the screenshot helper
./scripts/take-screenshots.sh

# Take screenshots following the guide
# See docs/SCREENSHOTS.md for detailed instructions
```

Required screenshots:
- `main-interface.png` - Main URL shortener interface
- `analytics-dashboard.png` - Analytics dashboard  
- `qr-code-modal.png` - QR code generation modal
- `terminal-experience.png` - Retro CRT monitor experience

Screenshots should:
- Be high resolution (1920x1080+) PNG format
- Show the retro CRT aesthetic clearly
- Include no sensitive information
- Maintain consistent styling

## Deployment

### Building for Production

```bash
# Using Nix
nix run .#build

# Manual
npm run build
```

### Environment Variables

Document any new environment variables in:
- `backend/.env.example`  
- `CONTRIBUTING.md` (this file)
- `README.md`

## Troubleshooting

### Common Issues

1. **Redis Connection Failed**
   ```bash
   # Start Redis server
   redis-server
   # or in Nix shell, Redis starts automatically
   ```

2. **Port Already in Use**
   ```bash
   # Kill processes on ports 3000/3001
   lsof -ti:3000 | xargs kill -9
   lsof -ti:3001 | xargs kill -9
   ```

3. **Node Modules Issues**
   ```bash
   # Clean and reinstall
   clean-project  # (in Nix shell)
   # or manually
   rm -rf node_modules backend/node_modules frontend/node_modules
   npm install
   ```

### Getting Help

- Check existing [GitHub Issues](https://github.com/malagant/links2go/issues)
- Create a new issue with:
  - Clear problem description
  - Steps to reproduce
  - Environment details
  - Error messages

## Release Process

1. Update version numbers in `package.json` files
2. Update `CHANGELOG.md`
3. Create a git tag
4. Push tag to trigger release workflow

## Community Guidelines

- Be respectful and inclusive
- Help other contributors
- Report bugs and suggest improvements
- Follow the code of conduct

Thank you for contributing to Links2Go! 🖥️✨