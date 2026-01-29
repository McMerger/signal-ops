#!/bin/bash
# SignalOps Local Development - Backend Services
# Starts all backend services natively (with PostgreSQL and Redis in Docker)
# Optimized for WSL/Ubuntu environment

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
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env.local"

# PID file for cleanup
PID_FILE="/tmp/signalops-backend.pids"

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}SignalOps Local Backend Development${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    
    if [ -f "$PID_FILE" ]; then
        while IFS= read -r pid; do
            if kill -0 "$pid" 2>/dev/null; then
                echo -e "${YELLOW}Stopping process $pid${NC}"
                kill "$pid" 2>/dev/null || true
            fi
        done < "$PID_FILE"
        rm -f "$PID_FILE"
    fi
    
    echo -e "${GREEN}✓ All services stopped${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Check dependencies
echo -e "${BLUE}Step 1: Checking dependencies...${NC}"

# Check Docker
HAS_DOCKER=false
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker found${NC}"
    HAS_DOCKER=true
else
    echo -e "${YELLOW}! Docker not found. Running in limited mode (no Database/Redis persistence).${NC}"
fi

# Check Go
if ! command -v go &> /dev/null; then
    echo -e "${RED}✗ Go not found!${NC}"
    echo -e "${YELLOW}Please install Go 1.21+: https://golang.org/dl/${NC}"
    exit 1
fi
GO_VERSION=$(go version | awk '{print $3}')
echo -e "${GREEN}✓ Go found: $GO_VERSION${NC}"

# Check Python
PYTHON_CMD=""
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
    PYTHON_VERSION=$(python3 --version)
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
    PYTHON_VERSION=$(python --version)
fi

if [ -z "$PYTHON_CMD" ]; then
    echo -e "${RED}✗ Python not found!${NC}"
    echo -e "${YELLOW}Please install Python 3.11+: https://www.python.org/downloads/${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python found: $PYTHON_VERSION${NC}"

# Check Java (optional for now)
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    echo -e "${GREEN}✓ Java found: $JAVA_VERSION${NC}"
else
    echo -e "${YELLOW}! Java not found (Java Risk Manager will be skipped)${NC}"
fi

echo ""

# Check environment file
echo -e "${BLUE}Step 2: Checking environment configuration...${NC}"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}! .env.local not found, creating from .env.example...${NC}"
    if [ -f "$PROJECT_ROOT/.env.example" ]; then
        cp "$PROJECT_ROOT/.env.example" "$ENV_FILE"
        # Update for local development
        sed -i 's|postgres:5432|localhost:5432|g' "$ENV_FILE"
        sed -i 's|redis:6379|localhost:6379|g' "$ENV_FILE"
        echo -e "${GREEN}✓ Created .env.local${NC}"
    else
        echo -e "${RED}✗ .env.example not found!${NC}"
        exit 1
    fi
fi

# Load environment variables
set -a
source "$ENV_FILE"
set +a

echo -e "${GREEN}✓ Environment loaded from .env.local${NC}"
echo ""

# Start PostgreSQL and Redis in Docker (if Docker is available)
if [ "$HAS_DOCKER" = true ]; then
    echo -e "${BLUE}Step 3: Starting PostgreSQL and Redis...${NC}"
    cd "$PROJECT_ROOT"

    # Check if containers are already running
    if docker ps --format '{{.Names}}' | grep -q "signalops-postgres"; then
        echo -e "${YELLOW}! PostgreSQL container already running${NC}"
    else
        echo -e "${CYAN}Starting PostgreSQL...${NC}"
        docker run -d \
            --name signalops-postgres \
            -e POSTGRES_DB=signalops \
            -e POSTGRES_USER=signalops \
            -e POSTGRES_PASSWORD=signalops_dev_password \
            -p 5432:5432 \
            -v signalops_postgres_data:/var/lib/postgresql/data \
            -v "$PROJECT_ROOT/db/init.sql:/docker-entrypoint-initdb.d/init.sql" \
            postgres:15-alpine
        
        echo -e "${CYAN}Waiting for PostgreSQL to be ready...${NC}"
        sleep 5
        until docker exec signalops-postgres pg_isready -U signalops &> /dev/null; do
            echo -e "${YELLOW}Waiting for PostgreSQL...${NC}"
            sleep 2
        done
        echo -e "${GREEN}✓ PostgreSQL ready${NC}"
    fi

    if docker ps --format '{{.Names}}' | grep -q "signalops-redis"; then
        echo -e "${YELLOW}! Redis container already running${NC}"
    else
        echo -e "${CYAN}Starting Redis...${NC}"
        docker run -d \
            --name signalops-redis \
            -p 6379:6379 \
            -v signalops_redis_data:/data \
            redis:7-alpine redis-server --appendonly yes
        
        sleep 2
        echo -e "${GREEN}✓ Redis ready${NC}"
    fi
else
    echo -e "${YELLOW}Step 3: Skipping PostgreSQL and Redis (Docker not found)${NC}"
fi

echo ""

# Start Go Execution Engine
echo -e "${BLUE}Step 4: Starting Go Execution Engine...${NC}"
cd "$PROJECT_ROOT/go-execution-core"

if [ ! -f "go.mod" ]; then
    echo -e "${RED}✗ go.mod not found in go-execution-core${NC}"
    exit 1
fi

echo -e "${CYAN}Installing Go dependencies...${NC}"
go mod download

echo -e "${CYAN}Starting Go service on port 8080...${NC}"
go run cmd/server/main.go > /tmp/signalops-go.log 2>&1 &
GO_PID=$!
echo $GO_PID >> "$PID_FILE"
echo -e "${GREEN}✓ Go Execution Engine started (PID: $GO_PID)${NC}"

echo ""

# Start Python Strategy Engine
echo -e "${BLUE}Step 5: Starting Python Strategy Engine...${NC}"
cd "$PROJECT_ROOT/python-strategy-engine"

if [ ! -f "requirements.txt" ]; then
    echo -e "${RED}✗ requirements.txt not found in python-strategy-engine${NC}"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "$PROJECT_ROOT/.venv" ]; then
    echo -e "${CYAN}Creating Python virtual environment...${NC}"
    $PYTHON_CMD -m venv "$PROJECT_ROOT/.venv"
fi

echo -e "${CYAN}Activating virtual environment...${NC}"
source "$PROJECT_ROOT/.venv/bin/activate"

echo -e "${CYAN}Installing Python dependencies...${NC}"
pip install -q -r requirements.txt

echo -e "${CYAN}Starting Python gRPC server on port 50051...${NC}"
python grpc_server.py > /tmp/signalops-python.log 2>&1 &
PYTHON_PID=$!
echo $PYTHON_PID >> "$PID_FILE"
echo -e "${GREEN}✓ Python Strategy Engine started (PID: $PYTHON_PID)${NC}"

echo ""

# Start Java Risk Manager (if available)
if command -v java &> /dev/null && command -v mvn &> /dev/null; then
    echo -e "${BLUE}Step 6: Starting Java Risk Manager...${NC}"
    cd "$PROJECT_ROOT/java-risk-manager"
    
    if [ -f "pom.xml" ]; then
        echo -e "${CYAN}Building Java project...${NC}"
        mvn clean package -DskipTests -q
        
        echo -e "${CYAN}Starting Java gRPC server on port 50052...${NC}"
        java -jar target/*.jar > /tmp/signalops-java.log 2>&1 &
        JAVA_PID=$!
        echo $JAVA_PID >> "$PID_FILE"
        echo -e "${GREEN}✓ Java Risk Manager started (PID: $JAVA_PID)${NC}"
    else
        echo -e "${YELLOW}! pom.xml not found, skipping Java service${NC}"
    fi
else
    echo -e "${YELLOW}! Java or Maven not found, skipping Java Risk Manager${NC}"
fi

echo ""

# Start C++ Signal Core (Wasm Worker)
echo -e "${BLUE}Step 7: Starting C++ Signal Core (Wasm)...${NC}"
cd "$PROJECT_ROOT/workers/signal-core-wasm"

if [ -f "wrangler.toml" ]; then
    echo -e "${CYAN}Starting Signal Core Worker on port 8789...${NC}"
    # Use npx wrangler directly
    npx wrangler dev --port 8789 > /tmp/signalops-wasm.log 2>&1 &
    WASM_PID=$!
    echo $WASM_PID >> "$PID_FILE"
    echo -e "${GREEN}✓ Signal Core (Wasm) started (PID: $WASM_PID)${NC}"
else
    echo -e "${YELLOW}! wrangler.toml not found, skipping Signal Core${NC}"
fi

echo ""

# Wait for services to be ready
echo -e "${BLUE}Step 7: Waiting for services to initialize...${NC}"
sleep 5

# Health checks
echo -e "${BLUE}Step 8: Running health checks...${NC}"

# Check Go service
if curl -s -f http://localhost:8080/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Go Execution Engine: Healthy${NC}"
else
    echo -e "${YELLOW}! Go Execution Engine: Starting...${NC}"
fi

# Check PostgreSQL
if [ "$HAS_DOCKER" = true ]; then
    if docker exec signalops-postgres pg_isready -U signalops &> /dev/null; then
        echo -e "${GREEN}✓ PostgreSQL: Healthy${NC}"
    else
        echo -e "${RED}✗ PostgreSQL: Unhealthy${NC}"
    fi

    # Check Redis
    if docker exec signalops-redis redis-cli ping &> /dev/null; then
        echo -e "${GREEN}✓ Redis: Healthy${NC}"
    else
        echo -e "${RED}✗ Redis: Unhealthy${NC}"
    fi
else
    echo -e "${YELLOW}! PostgreSQL: Skipped (No Docker)${NC}"
    echo -e "${YELLOW}! Redis: Skipped (No Docker)${NC}"
fi

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}Backend Services Running!${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

echo -e "${YELLOW}Service Endpoints:${NC}"
echo -e "  ${CYAN}• Go REST API:        http://localhost:8080${NC}"
echo -e "  ${CYAN}• Go Health Check:    http://localhost:8080/health${NC}"
echo -e "  ${CYAN}• Python gRPC:        localhost:50051${NC}"
echo -e "  ${CYAN}• Java gRPC:          localhost:50052${NC}"
echo -e "  ${CYAN}• PostgreSQL:         localhost:5432${NC}"
echo -e "  ${CYAN}• Redis:              localhost:6379${NC}"
echo ""

echo -e "${YELLOW}Logs:${NC}"
echo -e "  ${CYAN}• Go:     tail -f /tmp/signalops-go.log${NC}"
echo -e "  ${CYAN}• Python: tail -f /tmp/signalops-python.log${NC}"
echo -e "  ${CYAN}• Java:   tail -f /tmp/signalops-java.log${NC}"
echo ""

echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  ${CYAN}1. Start frontend: cd frontend && npm run dev${NC}"
echo -e "  ${CYAN}2. Or use script: ./scripts/dev-local-frontend.sh${NC}"
echo ""

echo -e "${GREEN}Press Ctrl+C to stop all services${NC}"
echo ""

# Keep script running
wait
