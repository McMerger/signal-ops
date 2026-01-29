# Makefile for SignalOps Development

.PHONY: help start stop restart logs clean db-reset test dev-local dev-local-backend dev-local-frontend dev-docker dev-docker-minimal

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# ============================================
# Local Development
# ============================================

dev-local: ## Start local development (all services)
	@./dev.sh local

dev-local-backend: ## Start only backend services locally
	@./dev.sh local backend

dev-local-frontend: ## Start only frontend locally
	@./dev.sh local frontend

# ============================================
# Docker Development
# ============================================

dev-docker: ## Start Docker development (all services)
	@./dev.sh docker

dev-docker-minimal: ## Start minimal Docker setup (postgres, redis, go, frontend)
	@./dev.sh docker minimal

dev-docker-local: ## Start Docker with local development optimizations
	docker-compose -f docker-compose.local.yml up

start: ## Start all services
	docker-compose up -d

stop: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

logs: ## View logs from all services
	docker-compose logs -f

logs-execution: ## View Execution Core logs
	docker-compose logs -f execution-core

logs-python: ## View Python strategy engine logs
	docker-compose logs -f python-strategy

logs-frontend: ## View frontend logs
	docker-compose logs -f frontend

clean: ## Stop and remove all containers, volumes
	docker-compose down -v
	rm -rf postgres_data redis_data strategy_logs

db-reset: ## Reset database (WARNING: destroys all data)
	docker-compose down postgres
	docker volume rm signalops_postgres_data || true
	docker-compose up -d postgres

db-shell: ## Open PostgreSQL shell
	docker exec -it signalops-postgres psql -U signalops -d signalops

redis-cli: ## Open Redis CLI
	docker exec -it signalops-redis redis-cli

build: ## Build all Docker images
	docker-compose build

rebuild: ## Rebuild all Docker images without cache
	docker-compose build --no-cache

ps: ## Show running containers
	docker-compose ps

health: ## Check health of all services
	@echo "Checking service health..."
	@curl -s http://localhost:8080/health | jq . || echo "Go backend not responding"
	@curl -s http://localhost:3000 > /dev/null && echo "Frontend: OK" || echo "Frontend: DOWN"
	@docker exec signalops-postgres pg_isready -U signalops && echo "PostgreSQL: OK" || echo "PostgreSQL: DOWN"
	@docker exec signalops-redis redis-cli ping && echo "Redis: OK" || echo "Redis: DOWN"

dev: ## Start development environment (frontend + backend only)
	docker-compose up -d postgres redis go-execution frontend

prod: ## Start production environment (all services)
	docker-compose up -d

test-integration: ## Run integration tests
	./test-integration.sh

test-e2e: ## Run end-to-end tests
	./test-e2e.sh
