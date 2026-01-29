#!/bin/bash
# SignalOps Local Development - Frontend
# Starts the Next.js frontend with hot reload

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
FRONTEND_DIR="$PROJECT_ROOT/frontend"
ENV_FILE="$PROJECT_ROOT/.env.local"

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}SignalOps Local Frontend Development${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Check Node.js
echo -e "${BLUE}Step 1: Checking dependencies...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found!${NC}"
    echo -e "${YELLOW}Please install Node.js 18+: https://nodejs.org/${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✓ Node.js found: $NODE_VERSION${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found!${NC}"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo -e "${GREEN}✓ npm found: $NPM_VERSION${NC}"
echo ""

# Check frontend directory
echo -e "${BLUE}Step 2: Checking frontend directory...${NC}"
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}✗ Frontend directory not found: $FRONTEND_DIR${NC}"
    exit 1
fi

cd "$FRONTEND_DIR"
echo -e "${GREEN}✓ Frontend directory found${NC}"
echo ""

# Install dependencies if needed
echo -e "${BLUE}Step 3: Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${CYAN}Installing npm dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi
echo ""

# Load environment variables
echo -e "${BLUE}Step 4: Loading environment configuration...${NC}"
if [ -f "$ENV_FILE" ]; then
    set -a
    source "$ENV_FILE"
    set +a
    echo -e "${GREEN}✓ Environment loaded from .env.local${NC}"
else
    echo -e "${YELLOW}! .env.local not found, using defaults${NC}"
    export NEXT_PUBLIC_API_URL=http://localhost:8080
    export NEXT_PUBLIC_WS_URL=ws://localhost:8081
    export NEXT_PUBLIC_STRATEGY_URL=http://localhost:5000
fi
echo ""

# Check backend connectivity
echo -e "${BLUE}Step 5: Checking backend connectivity...${NC}"
if curl -s -f http://localhost:8080/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is reachable${NC}"
else
    echo -e "${YELLOW}! Backend not reachable at http://localhost:8080${NC}"
    echo -e "${YELLOW}! Make sure to start backend services first:${NC}"
    echo -e "${CYAN}  ./scripts/dev-local-backend.sh${NC}"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
echo ""

# Start development server
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}Starting Frontend Development Server${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

echo -e "${YELLOW}Frontend will be available at:${NC}"
echo -e "  ${CYAN}http://localhost:3000${NC}"
echo ""

echo -e "${YELLOW}Environment:${NC}"
echo -e "  ${CYAN}• API URL:      $NEXT_PUBLIC_API_URL${NC}"
echo -e "  ${CYAN}• WebSocket:    $NEXT_PUBLIC_WS_URL${NC}"
echo -e "  ${CYAN}• Strategy URL: $NEXT_PUBLIC_STRATEGY_URL${NC}"
echo ""

echo -e "${GREEN}Starting Next.js development server...${NC}"
echo ""

npm run dev
