{
  description = "Links2Go - Fast URL shortener with analog TV monitor UI";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        
        # Node.js version - pinned to 22
        nodejs = pkgs.nodejs_22;
        
        # Common dependencies for development
        buildInputs = with pkgs; [
          nodejs
          redis
          git
          curl
          jq
          procps
          zsh
          starship
        ];

        # Development shell script
        startDevScript = pkgs.writeScriptBin "start-dev" ''
          #!/usr/bin/env bash
          set -e
          
          echo "🚀 Starting Links2Go development environment..."
          
          # Start Redis in background if not running
          if ! pgrep -x "redis-server" > /dev/null; then
            echo "📦 Starting Redis server..."
            redis-server --daemonize yes --port 6379 --dir /tmp
            sleep 2
          else
            echo "📦 Redis server already running"
          fi
          
          # Check if we're in the project root
          if [ ! -f "flake.nix" ]; then
            echo "❌ Error: Please run this command from the project root directory"
            exit 1
          fi
          
          # Install dependencies if needed
          if [ ! -d "backend/node_modules" ]; then
            echo "📦 Installing backend dependencies..."
            (cd backend && npm install)
          fi
          
          if [ ! -d "frontend/node_modules" ]; then
            echo "📦 Installing frontend dependencies..."
            (cd frontend && npm install)
          fi
          
          # Set up environment
          if [ ! -f "backend/.env" ]; then
            echo "⚙️ Creating backend .env file..."
            cp backend/.env.example backend/.env
          fi
          
          echo "🎯 Starting development servers..."
          echo "   Backend:  http://localhost:3001"
          echo "   Frontend: http://localhost:5173"
          echo "   Metrics:  http://localhost:3001/metrics"
          echo ""
          echo "Press Ctrl+C to stop all services"
          
          # Start both services with proper cleanup
          trap 'echo "🛑 Shutting down..."; jobs -p | xargs -r kill; exit' INT TERM
          
          (cd backend && npm run dev) &
          (cd frontend && npm run dev) &
          
          wait
        '';

        # Test script
        testScript = pkgs.writeScriptBin "run-tests" ''
          #!/usr/bin/env bash
          set -e
          
          echo "🧪 Running Links2Go test suite..."
          
          # Start Redis for tests
          if ! pgrep -x "redis-server" > /dev/null; then
            echo "📦 Starting Redis for tests..."
            redis-server --daemonize yes --port 6379 --dir /tmp
          fi
          
          echo "🔍 Running backend tests..."
          (cd backend && npm test)
          
          echo "🔍 Running frontend tests..."
          (cd frontend && npm test)
          
          echo "✅ All tests completed!"
        '';

        # Build script
        buildScript = pkgs.writeScriptBin "build-project" ''
          #!/usr/bin/env bash
          set -e
          
          echo "🏗️ Building Links2Go..."
          
          echo "🔨 Building backend..."
          (cd backend && npm run build)
          
          echo "🔨 Building frontend..."
          (cd frontend && npm run build)
          
          echo "✅ Build completed!"
          echo "   Backend build: backend/dist/"
          echo "   Frontend build: frontend/dist/"
        '';

        # Clean script
        cleanScript = pkgs.writeScriptBin "clean-project" ''
          #!/usr/bin/env bash
          set -e
          
          echo "🧹 Cleaning Links2Go..."
          
          # Stop Redis if running
          pkill redis-server || true
          
          # Clean build artifacts
          rm -rf backend/dist backend/node_modules
          rm -rf frontend/dist frontend/node_modules
          rm -rf node_modules
          
          # Clean temp files
          rm -f backend/.env
          rm -rf /tmp/redis.log /tmp/dump.rdb
          
          echo "✅ Project cleaned!"
        '';

      in
      {
        # Development shell
        devShells.default = pkgs.mkShell {
          inherit buildInputs;
          
          shellHook = ''
            # Set up environment variables
            export NODE_ENV=development
            export REDIS_HOST=localhost
            export REDIS_PORT=6379
            export PORT=3001
            export FRONTEND_URL=http://localhost:5173
            export BASE_URL=http://localhost:3001
            
            # Add scripts to PATH
            export PATH="${startDevScript}/bin:${testScript}/bin:${buildScript}/bin:${cleanScript}/bin:$PATH"
            
            # Configure Starship prompt
            export STARSHIP_CONFIG="$(pwd)/starship.toml"
            
            # Set up zsh as the shell with Starship
            export SHELL="${pkgs.zsh}/bin/zsh"
            
            # Create temporary zsh config for this session
            export ZDOTDIR="$PWD/.nix-shell"
            mkdir -p "$ZDOTDIR"
            
            cat > "$ZDOTDIR/.zshrc" << 'EOF'
            # Starship prompt
            eval "$(starship init zsh)"
            
            # Enable auto-completion
            autoload -U compinit && compinit
            
            # History settings
            HISTSIZE=10000
            SAVEHIST=10000
            HISTFILE="$ZDOTDIR/.zsh_history"
            setopt share_history
            setopt hist_ignore_all_dups
            setopt hist_ignore_space
            
            # Key bindings
            bindkey -e  # Emacs key bindings
            
            # Aliases for Links2Go
            alias dev="start-dev"
            alias test="run-tests" 
            alias build="build-project"
            alias clean="clean-project"
            alias ll="ls -la"
            alias la="ls -la"
            alias ..="cd .."
            alias ...="cd ../.."
            
            # Redis helpers
            alias redis-status="redis-cli ping 2>/dev/null && echo 'Redis: CONNECTED ✅' || echo 'Redis: DISCONNECTED ❌'"
            alias redis-start="redis-server --daemonize yes --port 6379 --dir /tmp"
            alias redis-stop="redis-cli shutdown"
            
            # Links2Go project helpers
            alias backend="cd backend"
            alias frontend="cd frontend"
            alias root="cd \$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
            
            # Development shortcuts
            alias logs-backend="cd backend && npm run dev"
            alias logs-frontend="cd frontend && npm run dev"
            alias lint="npm run lint"
            alias format="npm run format"
            
            # Git aliases
            alias gs="git status"
            alias ga="git add"
            alias gc="git commit"
            alias gp="git push"
            alias gl="git log --oneline -10"
            EOF
            
            echo "🖥️  Welcome to Links2Go Development Environment!"
            echo ""
            echo "🎨 Retro Terminal Theme Active"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo ""
            echo "📋 Available Commands:"
            echo "  🚀 dev (start-dev)     - Start development servers"  
            echo "  🧪 test (run-tests)    - Run comprehensive test suite"
            echo "  🏗️  build              - Build for production"
            echo "  🧹 clean              - Clean all build artifacts"
            echo ""
            echo "🔧 Redis Commands:"
            echo "  redis-status          - Check Redis connection"
            echo "  redis-start           - Start Redis server"
            echo "  redis-stop            - Stop Redis server"
            echo ""
            echo "📂 Navigation:"
            echo "  backend               - Go to backend directory"
            echo "  frontend              - Go to frontend directory" 
            echo "  root                  - Go to project root"
            echo ""
            echo "🎯 Quick Start:"
            echo "  dev                   - Start both servers and Redis"
            echo ""
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo ""
            
            # Start zsh with our configuration
            exec "$SHELL"
          '';
        };

        # Packages
        packages = {
          # Backend package
          backend = pkgs.stdenv.mkDerivation {
            pname = "links2go-backend";
            version = "1.0.0";
            
            src = ./backend;
            
            buildInputs = [ nodejs ];
            
            buildPhase = ''
              npm ci --production
              npm run build
            '';
            
            installPhase = ''
              mkdir -p $out/bin $out/lib/links2go-backend
              cp -r dist node_modules package.json $out/lib/links2go-backend/
              
              cat > $out/bin/links2go-backend << EOF
              #!/usr/bin/env bash
              cd $out/lib/links2go-backend
              exec ${nodejs}/bin/node dist/index.js
              EOF
              chmod +x $out/bin/links2go-backend
            '';
          };

          # Frontend package
          frontend = pkgs.stdenv.mkDerivation {
            pname = "links2go-frontend";
            version = "1.0.0";
            
            src = ./frontend;
            
            buildInputs = [ nodejs ];
            
            buildPhase = ''
              npm ci
              npm run build
            '';
            
            installPhase = ''
              mkdir -p $out
              cp -r dist/* $out/
            '';
          };

          # Combined package
          default = pkgs.symlinkJoin {
            name = "links2go";
            paths = [ self.packages.${system}.backend ];
            buildInputs = [ pkgs.makeWrapper ];
            postBuild = ''
              wrapProgram $out/bin/links2go-backend \
                --set NODE_ENV production
            '';
          };
        };

        # Apps
        apps = {
          # Development app
          dev = {
            type = "app";
            program = "${startDevScript}/bin/start-dev";
          };

          # Test app
          test = {
            type = "app";
            program = "${testScript}/bin/run-tests";
          };

          # Build app
          build = {
            type = "app";
            program = "${buildScript}/bin/build-project";
          };

          # Clean app
          clean = {
            type = "app";
            program = "${cleanScript}/bin/clean-project";
          };

          # Default app
          default = self.apps.${system}.dev;
        };
      });
}