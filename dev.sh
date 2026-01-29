#!/bin/bash
# SignalOps Development Script (Cloudflare Native)

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Show usage
show_usage() {
    echo "SignalOps Development Environment"
    echo "Usage:"
    echo "  ./dev.sh docker        - Start all services in Docker (Execution + Strategy + Frontend)"
    echo "  ./dev.sh stop          - Stop all services"
    echo "  ./dev.sh clean         - Clean up containers"
}

MODE=$1

case $MODE in
    docker)
        echo "Starting Cloudflare Workers + Frontend in Docker..."
        docker compose up
        ;;
        
    stop)
        echo "Stopping services..."
        docker compose down
        ;;
        
    clean)
        echo "Cleaning up..."
        docker compose down -v
        ;;
        
    *)
        show_usage
        exit 1
        ;;
esac
