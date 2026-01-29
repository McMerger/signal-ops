# Docker Development Guide

This guide covers running SignalOps in Docker for development, with all services containerized and optimized for hot reload.

## Prerequisites

### Required Software

- **Docker Desktop** (or Docker Engine + Docker Compose)
  - Download: https://www.docker.com/products/docker-desktop
  - Verify: `docker --version` and `docker-compose --version`

### For WSL Users

If you're running Docker in WSL/Ubuntu:

1. Docker should be installed and running in WSL
2. Use WSL terminal for all commands
3. Project should be accessible from WSL filesystem
4. File watching is optimized with polling for WSL

## Quick Start

### Start All Services

```bash
# From project root
./dev.sh docker

# Or using docker-compose directly
docker-compose -f docker-compose.local.yml up

# Or using Makefile
make dev-docker
```

This starts all services in Docker with hot reload enabled.

### Start Minimal Setup

For faster startup, run only essential services:

```bash
./dev.sh docker minimal

# This starts:
# - PostgreSQL
# - Redis
# - Go Execution Engine
# - Frontend
```

### Background Mode

```bash
# Start in background
docker-compose -f docker-compose.local.yml up -d

# View logs
docker-compose -f docker-compose.local.yml logs -f

# Stop services
docker-compose -f docker-compose.local.yml down
```

## What Gets Started

All services run in Docker containers:

### Infrastructure

1. **PostgreSQL** (postgres:15-alpine)
   - Port: 5432
   - Volume: `postgres_data`
   - Health checks enabled

2. **Redis** (redis:7-alpine)
   - Port: 6379
   - Volume: `redis_data`
   - AOF persistence enabled

### Backend Services

3. **Go Execution Engine**
   - Ports: 8080 (REST), 8081 (WebSocket), 50050 (gRPC)
   - Volume mount: `./go-execution-core` (for hot reload in dev)
   - Health endpoint: http://localhost:8080/health

4. **Python Strategy Engine**
   - Ports: 50051 (gRPC), 5000 (REST)
   - Volume mount: `./python-strategy-engine` (hot reload)
   - File watching: Enabled with polling

5. **Java Risk Manager**
   - Port: 50052 (gRPC)
   - Compiled JAR in container

6. **C++ Signal Core**
   - No exposed ports (communicates via Redis)
   - SIMD-optimized indicators

### Frontend

7. **Next.js Frontend**
   - Port: 3000
   - Volume mounts: `./frontend` (hot reload)
   - Node modules: Cached in volume
   - File watching: Enabled with polling

## Docker Compose Files

### docker-compose.local.yml (Development)

Optimized for local development:
- Volume mounts for hot reload
- Development environment variables
- File watching with polling (WSL-compatible)
- Faster health check intervals
- Interactive terminals (stdin_open, tty)

### docker-compose.yml (Production)

Optimized for production:
- No volume mounts (compiled code in images)
- Production environment variables
- Resource limits
- Restart policies
- Multi-stage builds

## Development Workflow

### Starting Development

1. **First time setup:**
   ```bash
   # Copy environment file
   cp .env.docker .env
   
   # Build images
   docker-compose -f docker-compose.local.yml build
   
   # Start services
   docker-compose -f docker-compose.local.yml up
   ```

2. **Subsequent starts:**
   ```bash
   # Just start (uses cached images)
   docker-compose -f docker-compose.local.yml up
   ```

### Making Changes

Changes are automatically detected and reloaded:

- **Frontend (TypeScript/React)**: Next.js hot reload (instant)
- **Python**: File watching enabled, auto-restart
- **Go**: Requires rebuild (see below)
- **Java**: Requires rebuild (see below)

### Rebuilding Services

When you change dependencies or Dockerfiles:

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

### Viewing Logs

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

### Accessing Containers

```bash
# Execute command in container
docker-compose -f docker-compose.local.yml exec frontend sh
docker-compose -f docker-compose.local.yml exec go-execution sh
docker-compose -f docker-compose.local.yml exec python-strategy bash

# Run one-off command
docker-compose -f docker-compose.local.yml run --rm frontend npm install
```

### Stopping Services

```bash
# Stop all services (keeps containers)
docker-compose -f docker-compose.local.yml stop

# Stop and remove containers
docker-compose -f docker-compose.local.yml down

# Stop, remove containers and volumes
docker-compose -f docker-compose.local.yml down -v

# Using dev script
./dev.sh stop
./dev.sh clean  # removes volumes too
```

## Database Management

### Access PostgreSQL

```bash
# Using docker-compose exec
docker-compose -f docker-compose.local.yml exec postgres psql -U signalops -d signalops

# Using docker exec
docker exec -it signalops-postgres psql -U signalops -d signalops

# Using Makefile
make db-shell
```

### Access Redis

```bash
# Using docker-compose exec
docker-compose -f docker-compose.local.yml exec redis redis-cli

# Using docker exec
docker exec -it signalops-redis redis-cli

# Using Makefile
make redis-cli
```

### Run Migrations

```bash
# Migrations run automatically on startup
# To run manually:
docker-compose -f docker-compose.local.yml exec postgres psql -U signalops -d signalops -f /docker-entrypoint-initdb.d/init.sql
```

### Reset Database

```bash
# Stop and remove database volume
docker-compose -f docker-compose.local.yml down -v

# Restart (will recreate database)
docker-compose -f docker-compose.local.yml up postgres
```

## Networking

All services are on the `signalops-network` bridge network.

### Service Discovery

Services can reach each other using container names:

- `postgres:5432` - PostgreSQL
- `redis:6379` - Redis
- `go-execution:8080` - Go REST API
- `python-strategy:50051` - Python gRPC
- `java-risk:50052` - Java gRPC
- `frontend:3000` - Next.js

### Port Mapping

From host machine (localhost):

- `localhost:3000` → Frontend
- `localhost:8080` → Go REST API
- `localhost:8081` → Go WebSocket
- `localhost:5000` → Python REST API
- `localhost:5432` → PostgreSQL
- `localhost:6379` → Redis
- `localhost:50050` → Go gRPC
- `localhost:50051` → Python gRPC
- `localhost:50052` → Java gRPC

## Volume Management

### Named Volumes

```bash
# List volumes
docker volume ls | grep signalops

# Inspect volume
docker volume inspect signalops_postgres_data

# Remove volume
docker volume rm signalops_postgres_data

# Remove all unused volumes
docker volume prune
```

### Bind Mounts

Development uses bind mounts for hot reload:

- `./frontend` → `/app` (frontend container)
- `./python-strategy-engine` → `/app` (python container)
- `./go-execution-core` → `/app` (go container, dev only)

## Troubleshooting

### Container Won't Start

```bash
# Check container status
docker-compose -f docker-compose.local.yml ps

# Check logs
docker-compose -f docker-compose.local.yml logs <service-name>

# Check health
docker-compose -f docker-compose.local.yml ps
# Look for "healthy" status
```

### Port Already in Use

```bash
# Find what's using the port
lsof -i :3000

# Stop conflicting service
docker stop <container-name>

# Or change port in docker-compose.local.yml
```

### Build Failures

```bash
# Clean build cache
docker builder prune

# Rebuild without cache
docker-compose -f docker-compose.local.yml build --no-cache

# Check Dockerfile syntax
docker-compose -f docker-compose.local.yml config
```

### Volume Permission Issues

```bash
# Fix permissions (Linux/WSL)
sudo chown -R $USER:$USER ./frontend/node_modules

# Or remove and recreate volume
docker-compose -f docker-compose.local.yml down -v
docker-compose -f docker-compose.local.yml up
```

### Hot Reload Not Working

For WSL users, file watching is enabled with polling:

```yaml
environment:
  - WATCHPACK_POLLING=true  # Frontend
  - WATCHFILES_FORCE_POLLING=true  # Python
```

If still not working:

1. Ensure project is in WSL filesystem (not `/mnt/d/`)
2. Increase polling interval in docker-compose.local.yml
3. Restart Docker Desktop

### Network Issues

```bash
# Inspect network
docker network inspect signalops-network

# Recreate network
docker-compose -f docker-compose.local.yml down
docker network rm signalops-network
docker-compose -f docker-compose.local.yml up
```

### Out of Disk Space

```bash
# Clean up unused resources
docker system prune -a

# Remove unused volumes
docker volume prune

# Check disk usage
docker system df
```

## Performance Optimization

### For WSL Users

1. **Keep project in WSL filesystem:**
   ```bash
   # Better performance
   ~/projects/signal-ops

   # Slower performance
   /mnt/d/signal-ops
   ```

2. **Increase Docker resources:**
   - Docker Desktop → Settings → Resources → WSL Integration
   - Allocate more CPU and RAM

3. **Enable BuildKit:**
   ```bash
   export DOCKER_BUILDKIT=1
   export COMPOSE_DOCKER_CLI_BUILD=1
   ```

### Build Optimization

1. **Use build cache:**
   ```bash
   # BuildKit cache
   docker-compose -f docker-compose.local.yml build --build-arg BUILDKIT_INLINE_CACHE=1
   ```

2. **Multi-stage builds:**
   - Already implemented in Dockerfiles
   - Separates build and runtime dependencies

3. **Layer caching:**
   - Dependencies installed before code copy
   - Changes to code don't invalidate dependency layers

### Runtime Optimization

1. **Limit resources:**
   ```yaml
   # In docker-compose.local.yml
   deploy:
     resources:
       limits:
         cpus: '0.5'
         memory: 512M
   ```

2. **Use Alpine images:**
   - Already using Alpine for smaller images
   - Faster pulls and less disk space

## Health Checks

All services have health checks:

```bash
# Check health status
docker-compose -f docker-compose.local.yml ps

# Wait for healthy
docker-compose -f docker-compose.local.yml up --wait

# Check specific service
docker inspect --format='{{.State.Health.Status}}' signalops-postgres
```

## Environment Variables

### Development (.env.docker)

```env
# Container-to-container communication
DATABASE_URL=postgresql://signalops:signalops_dev_password@postgres:5432/signalops
REDIS_URL=redis://redis:6379
GO_EXECUTION_URL=http://go-execution:8080

# Browser-to-container (via localhost)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Override for Local Testing

```bash
# Set environment variable for single run
GEMINI_API_KEY=your_key docker-compose -f docker-compose.local.yml up

# Or create .env file (gitignored)
cp .env.docker .env
# Edit .env with your values
```

## Common Commands Reference

```bash
# Start all services
docker-compose -f docker-compose.local.yml up

# Start in background
docker-compose -f docker-compose.local.yml up -d

# Stop services
docker-compose -f docker-compose.local.yml down

# Rebuild and start
docker-compose -f docker-compose.local.yml up --build

# View logs
docker-compose -f docker-compose.local.yml logs -f

# Access container shell
docker-compose -f docker-compose.local.yml exec <service> sh

# Run command in container
docker-compose -f docker-compose.local.yml exec <service> <command>

# Check status
docker-compose -f docker-compose.local.yml ps

# Remove everything
docker-compose -f docker-compose.local.yml down -v
```

## Next Steps

- Read [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) for native development
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines
