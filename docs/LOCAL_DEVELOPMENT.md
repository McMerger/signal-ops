# Local Development Guide

This guide covers running SignalOps locally for development, with backend services running natively on your machine and databases in Docker.

## Prerequisites

### Required Software

- **Docker Desktop** (for PostgreSQL and Redis)
  - Download: https://www.docker.com/products/docker-desktop
  - For WSL users: Docker should be running in WSL/Ubuntu

- **Go 1.21+** (for Go Execution Engine)
  - Download: https://golang.org/dl/
  - Verify: `go version`

- **Python 3.11+** (for Python Strategy Engine)
  - Download: https://www.python.org/downloads/
  - Verify: `python3 --version`

- **Node.js 18+** (for Next.js Frontend)
  - Download: https://nodejs.org/
  - Verify: `node --version`

- **Java 17+** (optional, for Java Risk Manager)
  - Download: https://adoptium.net/
  - Verify: `java -version`

- **Maven** (optional, for Java Risk Manager)
  - Download: https://maven.apache.org/download.cgi
  - Verify: `mvn -version`

## Quick Start

### Option 1: Start Everything at Once

```bash
# From project root
./dev.sh local
```

This starts all backend services in the background and the frontend in the foreground.

### Option 2: Start Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
./dev.sh local backend
# or
./scripts/dev-local-backend.sh
```

**Terminal 2 - Frontend:**
```bash
./dev.sh local frontend
# or
./scripts/dev-local-frontend.sh
```

### Option 3: Using Makefile

```bash
# Start everything
make dev-local

# Start only backend
make dev-local-backend

# Start only frontend
make dev-local-frontend
```

## What Gets Started

### Backend Services

1. **PostgreSQL** (Docker container)
   - Port: 5432
   - Database: signalops
   - User: signalops
   - Password: signalops_dev_password

2. **Redis** (Docker container)
   - Port: 6379
   - Persistence: AOF enabled

3. **Go Execution Engine** (Native)
   - REST API: http://localhost:8080
   - WebSocket: ws://localhost:8081
   - gRPC: localhost:50050
   - Health check: http://localhost:8080/health

4. **Python Strategy Engine** (Native)
   - gRPC: localhost:50051
   - REST API: http://localhost:5000 (optional)
   - Runs in virtual environment (`.venv`)

5. **Java Risk Manager** (Native, if Java/Maven installed)
   - gRPC: localhost:50052

### Frontend

- **Next.js Development Server**
  - URL: http://localhost:3000
  - Hot reload enabled
  - API proxy to backend services

## Environment Configuration

The startup scripts automatically create `.env.local` from `.env.local.example` if it doesn't exist.

### Manual Configuration

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   BINANCE_API_KEY=your_binance_key
   BINANCE_SECRET_KEY=your_binance_secret
   ```

3. The file is gitignored, so your secrets are safe.

## Development Workflow

### Starting Development

1. Start backend services:
   ```bash
   ./scripts/dev-local-backend.sh
   ```

2. Wait for services to initialize (about 15 seconds)

3. In a new terminal, start the frontend:
   ```bash
   ./scripts/dev-local-frontend.sh
   ```

4. Open http://localhost:3000 in your browser

### Making Changes

- **Frontend (TypeScript/React)**: Changes auto-reload via Next.js hot reload
- **Python**: Restart the Python service (Ctrl+C and restart script)
- **Go**: Restart the Go service (Ctrl+C and restart script)
- **Java**: Rebuild and restart (`mvn clean package` then restart)

### Viewing Logs

Backend services log to `/tmp/signalops-*.log`:

```bash
# Go service
tail -f /tmp/signalops-go.log

# Python service
tail -f /tmp/signalops-python.log

# Java service
tail -f /tmp/signalops-java.log

# All at once
tail -f /tmp/signalops-*.log
```

Frontend logs appear in the terminal where you started it.

### Stopping Services

**Graceful shutdown:**
- Press `Ctrl+C` in the terminal running the services

**Force stop all:**
```bash
./dev.sh stop
```

**Clean up everything (including data):**
```bash
./dev.sh clean
```

## Database Management

### Access PostgreSQL

```bash
# Using Docker exec
docker exec -it signalops-postgres psql -U signalops -d signalops

# Using psql (if installed locally)
psql -h localhost -U signalops -d signalops
```

### Access Redis

```bash
docker exec -it signalops-redis redis-cli
```

### Reset Database

```bash
# Stop PostgreSQL container
docker stop signalops-postgres
docker rm signalops-postgres

# Remove volume
docker volume rm signalops_postgres_data

# Restart backend (will recreate database)
./scripts/dev-local-backend.sh
```

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Check what's using the port (example: 8080)
lsof -i :8080

# Kill the process
kill -9 <PID>
```

### Go Service Won't Start

```bash
# Check Go installation
go version

# Verify dependencies
cd go-execution-core
go mod download
go mod tidy

# Try running directly
go run cmd/server/main.go
```

### Python Service Won't Start

```bash
# Check Python installation
python3 --version

# Recreate virtual environment
rm -rf .venv
python3 -m venv .venv
source .venv/bin/activate
pip install -r python-strategy-engine/requirements.txt

# Try running directly
cd python-strategy-engine
python grpc_server.py
```

### Frontend Won't Start

```bash
# Check Node.js installation
node --version
npm --version

# Reinstall dependencies
cd frontend
rm -rf node_modules .next
npm install

# Try running directly
npm run dev
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check PostgreSQL logs
docker logs signalops-postgres

# Verify connection
docker exec signalops-postgres pg_isready -U signalops
```

### WSL-Specific Issues

If running Docker in WSL:

1. **File watching not working:**
   - The scripts already set `WATCHFILES_FORCE_POLLING=true`
   - For frontend, `WATCHPACK_POLLING=true` is set

2. **Path issues:**
   - Use WSL paths (`/mnt/d/signal-ops`) not Windows paths (`D:\signal-ops`)
   - Run scripts from WSL terminal, not PowerShell

3. **Performance:**
   - Keep project files in WSL filesystem (`~/projects/signal-ops`) for best performance
   - If on Windows filesystem, expect slower file operations

## Performance Tips

### Speed Up Startup

1. **Keep Docker containers running:**
   ```bash
   # Don't stop PostgreSQL and Redis between sessions
   # Only stop backend services
   ```

2. **Use Go build cache:**
   ```bash
   # Go automatically caches builds
   # First build is slow, subsequent builds are fast
   ```

3. **Keep Python venv:**
   ```bash
   # Don't delete .venv between sessions
   # Dependencies are already installed
   ```

### Optimize for WSL

1. **Move project to WSL filesystem:**
   ```bash
   # Better performance than /mnt/d/
   mv /mnt/d/signal-ops ~/projects/signal-ops
   ```

2. **Increase Docker resources:**
   - Docker Desktop → Settings → Resources
   - Allocate more CPU and RAM to WSL

## Next Steps

- Read [DOCKER_DEVELOPMENT.md](./DOCKER_DEVELOPMENT.md) for Docker-based development
- Check [API_REFERENCE.md](./API_REFERENCE.md) for API documentation
- See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines

## Common Commands Reference

```bash
# Start everything
./dev.sh local

# Start only backend
./dev.sh local backend

# Start only frontend
./dev.sh local frontend

# Stop all services
./dev.sh stop

# Clean up everything
./dev.sh clean

# View logs
tail -f /tmp/signalops-*.log

# Database shell
docker exec -it signalops-postgres psql -U signalops -d signalops

# Redis CLI
docker exec -it signalops-redis redis-cli

# Check service health
curl http://localhost:8080/health
```
