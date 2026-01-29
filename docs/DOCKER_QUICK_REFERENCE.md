# Docker Quick Reference

## Start Development Environment

```bash
# Option 1: Using .env.docker
export $(cat .env.docker | xargs)
docker-compose up --build

# Option 2: Explicit compose files
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Option 3: Set in environment permanently
echo 'export COMPOSE_FILE=docker-compose.yml:docker-compose.dev.yml' >> ~/.bashrc
echo 'export DOCKER_BUILDKIT=1' >> ~/.bashrc
source ~/.bashrc
docker-compose up --build
```

## Common Commands

```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up frontend

# Rebuild and start
docker-compose up --build

# Rebuild specific service
docker-compose build frontend

# View logs
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Build Performance

```bash
# Check cache usage
docker buildx du

# Clean cache (free up space)
docker buildx prune

# Aggressive clean (removes all cache)
docker buildx prune -a

# Build with verbose output
docker-compose build --progress=plain frontend
```

## Hot Reload Services

- ✅ **Frontend**: Auto-reload (no rebuild)
- ✅ **Python**: Auto-restart (no rebuild)
- ✅ **Streamlit**: Auto-reload (no rebuild)
- ⚠️ **Go**: Requires rebuild (fast with cache)
- ⚠️ **Java**: Requires rebuild (fast with cache)
- ⚠️ **C++**: Requires rebuild (fast with ccache)

## Troubleshooting

```bash
# Check BuildKit is enabled
docker buildx version

# View detailed build logs
docker-compose build --progress=plain --no-cache frontend

# Fix WSL permissions
sudo chown -R $USER:$USER .

# Restart Docker daemon (if needed)
sudo systemctl restart docker
```

## Expected Build Times

| Service | First Build | Incremental | Code Change Only |
|---------|-------------|-------------|------------------|
| Frontend | ~2-3 min | ~10-20 sec | ~5-10 sec |
| Python | ~1-2 min | ~15-30 sec | ~5-10 sec |
| Go | ~2-3 min | ~20-40 sec | ~20-40 sec |
| Java | ~1-2 min | ~15-30 sec | ~15-30 sec |
| C++ | ~1-2 min | ~20-40 sec | ~20-40 sec |
