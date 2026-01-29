#!/bin/bash
# SignalOps Master Development Script
# Unified script for starting development environment (local or Docker)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR" && pwd)"

# Show usage
show_usage() {
    echo -e "${CYAN}SignalOps Development Environment${NC}"
    echo ""
    echo -e "${YELLOW}Usage:${NC}"
    echo -e "  ${GREEN}./dev.sh local${NC}           - Start local development (all services)"
    echo -e "  ${GREEN}./dev.sh local backend${NC}   - Start only backend services locally"
    echo -e "  ${GREEN}./dev.sh local frontend${NC}  - Start only frontend locally"
    echo -e "  ${GREEN}./dev.sh docker${NC}          - Start Docker development (all services)"
    echo -e "  ${GREEN}./dev.sh docker minimal${NC}  - Start minimal Docker setup (postgres, redis, go, frontend)"
    echo -e "  ${GREEN}./dev.sh stop${NC}            - Stop all services"
    echo -e "  ${GREEN}./dev.sh clean${NC}           - Stop and remove all containers and volumes"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo -e "  ${CYAN}# Start everything locally${NC}"
    echo -e "  ./dev.sh local"
    echo ""
    echo -e "  ${CYAN}# Start only backend, then frontend in another terminal${NC}"
    echo -e "  ./dev.sh local backend"
    echo -e "  ./dev.sh local frontend  # in another terminal"
    echo ""
    echo -e "  ${CYAN}# Start everything in Docker${NC}"
    echo -e "  ./dev.sh docker"
    echo ""
}

# Check if no arguments
if [ $# -eq 0 ]; then
    show_usage
    exit 0
fi

MODE=$1
SUBCOMMAND=${2:-all}

case $MODE in
    local)
        case $SUBCOMMAND in
            backend)
                echo -e "${CYAN}Starting local backend services...${NC}"
                exec "$PROJECT_ROOT/scripts/dev-local-backend.sh"
                ;;
            frontend)
                echo -e "${CYAN}Starting local frontend...${NC}"
                exec "$PROJECT_ROOT/scripts/dev-local-frontend.sh"
                ;;
            all|*)
                echo -e "${CYAN}Starting all local services...${NC}"
                echo -e "${YELLOW}This will start backend services in the background and frontend in the foreground${NC}"
                echo ""
                
                # Start backend in background
                "$PROJECT_ROOT/scripts/dev-local-backend.sh" &
                BACKEND_PID=$!
                
                # Wait for backend to initialize
                echo -e "${YELLOW}Waiting for backend to initialize (15 seconds)...${NC}"
                sleep 15
                
                # Start frontend in foreground
                "$PROJECT_ROOT/scripts/dev-local-frontend.sh"
                
                # Cleanup backend when frontend exits
                kill $BACKEND_PID 2>/dev/null || true
                ;;
        esac
        ;;
        
    docker)
        case $SUBCOMMAND in
            minimal)
                echo -e "${CYAN}Starting minimal Docker environment...${NC}"
                docker compose -f docker-compose.local.yml up postgres redis go-execution frontend
                ;;
            all|*)
                echo -e "${CYAN}Starting full Docker environment...${NC}"
                docker compose -f docker-compose.local.yml up
                ;;
        esac
        ;;
        
    stop)
        echo -e "${YELLOW}Stopping all services...${NC}"
        
        # Stop Docker containers
        if docker ps -q --filter "name=signalops-" | grep -q .; then
            echo -e "${CYAN}Stopping Docker containers...${NC}"
            docker compose -f docker-compose.local.yml down
            docker compose down
        fi
        
        # Stop local processes
        if [ -f "/tmp/signalops-backend.pids" ]; then
            echo -e "${CYAN}Stopping local backend services...${NC}"
            while IFS= read -r pid; do
                if kill -0 "$pid" 2>/dev/null; then
                    kill "$pid" 2>/dev/null || true
                fi
            done < "/tmp/signalops-backend.pids"
            rm -f "/tmp/signalops-backend.pids"
        fi
        
        echo -e "${GREEN}✓ All services stopped${NC}"
        ;;
        
    clean)
        echo -e "${YELLOW}Cleaning up all services and data...${NC}"
        echo -e "${RED}WARNING: This will remove all containers, volumes, and data!${NC}"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker compose -f docker-compose.local.yml down -v
            docker compose down -v
            
            # Remove standalone containers
            docker rm -f signalops-postgres signalops-redis 2>/dev/null || true
            
            # Remove volumes
            docker volume rm signalops_postgres_data signalops_redis_data signalops_strategy_logs 2>/dev/null || true
            
            echo -e "${GREEN}✓ Cleanup complete${NC}"
        else
            echo -e "${YELLOW}Cleanup cancelled${NC}"
        fi
        ;;
        
    help|--help|-h)
        show_usage
        ;;
        
    *)
        echo -e "${RED}Unknown command: $MODE${NC}"
        echo ""
        show_usage
        exit 1
        ;;
esac
