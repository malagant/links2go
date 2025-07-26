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
          
          # Install dependencies if needed
          if [ ! -d "backend/node_modules" ]; then
            echo "📦 Installing backend dependencies..."
            cd backend && npm install && cd ..
          fi
          
          if [ ! -d "frontend/node_modules" ]; then
            echo "📦 Installing frontend dependencies..."
            cd frontend && npm install && cd ..
          fi
          
          # Set up environment
          if [ ! -f "backend/.env" ]; then
            echo "⚙️ Creating backend .env file..."
            cp backend/.env.example backend/.env
          fi
          
          echo "🎯 Starting development servers..."
          echo "   Backend:  http://localhost:3001"
          echo "   Frontend: http://localhost:3000"
          echo "   Metrics:  http://localhost:3001/metrics"
          echo ""
          echo "Press Ctrl+C to stop all services"
          
          # Start both services with proper cleanup
          trap 'echo "🛑 Shutting down..."; jobs -p | xargs -r kill; exit' INT TERM
          
          cd backend && npm run dev &
          cd frontend && npm run dev &
          
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
          cd backend && npm test
          
          echo "🔍 Running frontend tests..."
          cd frontend && npm test
          
          echo "✅ All tests completed!"
        '';

        # Build script
        buildScript = pkgs.writeScriptBin "build-project" ''
          #!/usr/bin/env bash
          set -e
          
          echo "🏗️ Building Links2Go..."
          
          echo "🔨 Building backend..."
          cd backend && npm run build && cd ..
          
          echo "🔨 Building frontend..."
          cd frontend && npm run build && cd ..
          
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
            echo "🎮 Welcome to Links2Go development environment!"
            echo ""
            echo "Available commands:"
            echo "  start-dev     - Start development servers"
            echo "  run-tests     - Run test suite"
            echo "  build-project - Build for production"
            echo "  clean-project - Clean all build artifacts"
            echo ""
            echo "Quick start:"
            echo "  start-dev"
            echo ""
            
            # Set up environment variables
            export NODE_ENV=development
            export REDIS_HOST=localhost
            export REDIS_PORT=6379
            export PORT=3001
            export FRONTEND_URL=http://localhost:3000
            export BASE_URL=http://localhost:3001
            
            # Add scripts to PATH
            export PATH="${startDevScript}/bin:${testScript}/bin:${buildScript}/bin:${cleanScript}/bin:$PATH"
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