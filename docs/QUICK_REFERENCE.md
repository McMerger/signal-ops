# SignalOps Quick Reference

Quick commands for common development tasks.

## Starting Development

### Local Development (Native Services)

```bash
# Start everything (backend + frontend)
./dev.sh local

# Start only backend
./dev.sh local backend

# Start only frontend
./dev.sh local frontend

# Using Makefile
make dev-local
make dev-local-backend
make dev-local-frontend
```

### Docker Development (All in Containers)

```bash
# Start all services
./dev.sh docker

# Start minimal setup (faster)
./dev.sh docker minimal

# Using docker-compose directly
docker-compose -f docker-compose.local.yml up

# Start in background
docker-compose -f docker-compose.local.yml up -d

# Using Makefile
make dev-docker
make dev-docker-minimal
```

## Stopping Services

```bash
# Stop all services
./dev.sh stop

# Clean up everything (removes data!)
./dev.sh clean

# Docker only - stop and remove containers
docker-compose -f docker-compose.local.yml down

# Docker only - stop, remove containers and volumes
docker-compose -f docker-compose.local.yml down -v
```

## Viewing Logs

### Local Development

```bash
# Backend services
tail -f /tmp/signalops-go.log
tail -f /tmp/signalops-python.log
tail -f /tmp/signalops-java.log

# All at once
tail -f /tmp/signalops-*.log

# Frontend logs are in the terminal
```

### Docker Development

```bash
# All services
docker-compose -f docker-compose.local.yml logs -f

# Specific service
docker-compose -f docker-compose.local.yml logs -f frontend
docker-compose -f docker-compose.local.yml logs -f go-execution
docker-compose -f docker-compose.local.yml logs -f python-strategy

# Last 100 lines
docker-compose -f docker-compose.local.yml logs --tail=100 -f
```

## Database Access

### PostgreSQL

```bash
# Local development
docker exec -it signalops-postgres psql -U signalops -d signalops

# Docker development
docker-compose -f docker-compose.local.yml exec postgres psql -U signalops -d signalops

# Using Makefile
make db-shell
```

### Redis

```bash
# Local development
docker exec -it signalops-redis redis-cli

# Docker development
docker-compose -f docker-compose.local.yml exec redis redis-cli

# Using Makefile
make redis-cli
```

## Health Checks

```bash
# Go Execution Engine
curl http://localhost:8080/health

# Check all Docker services
docker-compose -f docker-compose.local.yml ps

# Using Makefile
make health
```

## Rebuilding Services

### Local Development

```bash
# Go - just restart the script
# Python - just restart the script
# Frontend - just restart the script

# Rebuild Go binary
cd go-execution-core
go build -o bin/server cmd/server/main.go

# Reinstall Python dependencies
source .venv/bin/activate
pip install -r python-strategy-engine/requirements.txt

# Reinstall frontend dependencies
cd frontend
npm install
```

### Docker Development

```bash
# Rebuild specific service
docker-compose -f docker-compose.local.yml build frontend

# Rebuild all services
docker-compose -f docker-compose.local.yml build

# Rebuild without cache
docker-compose -f docker-compose.local.yml build --no-cache

# Rebuild and restart
docker-compose -f docker-compose.local.yml up --build
```

## Environment Configuration

```bash
# Local development
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Docker development
cp .env.docker .env
# Edit .env with your API keys
```

## Common Issues

### Port Already in Use

```bash
# Find what's using the port
lsof -i :8080

# Kill the process
kill -9 <PID>
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Restart PostgreSQL
docker restart signalops-postgres

# Reset database (WARNING: deletes data)
docker stop signalops-postgres
docker rm signalops-postgres
docker volume rm signalops_postgres_data
```

### Frontend Won't Start

```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules .next
npm install
npm run dev
```

### Docker Build Failed

```bash
# Clean build cache
docker builder prune

# Rebuild without cache
docker-compose -f docker-compose.local.yml build --no-cache
```

## Service Endpoints

### Local Development

- Frontend: http://localhost:3000
- Go REST API: http://localhost:8080
- Go WebSocket: ws://localhost:8081
- Go gRPC: localhost:50050
- Python gRPC: localhost:50051
- Python REST: http://localhost:5000
- Java gRPC: localhost:50052
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Docker Development

Same ports as local development (mapped from containers)

## File Locations

- **Scripts**: `./scripts/`
- **Frontend**: `./frontend/`
- **Go Backend**: `./go-execution-core/`
- **Python Backend**: `./python-strategy-engine/`
- **Java Backend**: `./java-risk-manager/`
- **C++ Backend**: `./cpp-signal-core/`
- **Database Init**: `./db/init.sql`
- **Documentation**: `./docs/`

## Useful Makefile Targets

```bash
make help                  # Show all available targets
make dev-local             # Start local development
make dev-docker            # Start Docker development
make start                 # Start production Docker
make stop                  # Stop all services
make logs                  # View all logs
make logs-go               # View Go logs
make logs-python           # View Python logs
make logs-frontend         # View frontend logs
make db-shell              # Open PostgreSQL shell
make redis-cli             # Open Redis CLI
make health                # Check service health
make clean                 # Remove all containers and volumes
```

## For WSL Users

```bash
# Run from WSL terminal, not PowerShell
cd /mnt/d/signal-ops

# Or move to WSL filesystem for better performance
mv /mnt/d/signal-ops ~/projects/signal-ops
cd ~/projects/signal-ops
```

## Getting Help

- **Local Development**: See [docs/LOCAL_DEVELOPMENT.md](docs/LOCAL_DEVELOPMENT.md)
- **Docker Development**: See [docs/DOCKER_DEVELOPMENT.md](docs/DOCKER_DEVELOPMENT.md)
- **Issues**: Open an issue on GitHub
- **Discussions**: GitHub Discussions

## Next Steps

1. Start development environment
2. Open http://localhost:3000 in browser
3. Check http://localhost:8080/health for backend status
4. Start building your trading strategies!
