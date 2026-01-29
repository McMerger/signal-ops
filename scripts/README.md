# Scripts Directory

This directory contains automation scripts for development, testing, and deployment.

## 🚀 Quick Start Scripts

### `quick-start.sh` / `quick-start.ps1`
**Purpose**: One-command setup and startup
**Usage**:
```bash
# Linux/Mac
./scripts/quick-start.sh

# Windows
.\scripts\quick-start.ps1
```
**What it does**:
- Checks prerequisites (Docker, Docker Compose)
- Builds all services
- Starts the full stack
- Displays service URLs

---

## 🧪 Testing Scripts

### `test-integration.sh` / `test-integration.ps1`
**Purpose**: Run integration tests across all services
**Usage**:
```bash
# Linux/Mac
./scripts/test-integration.sh

# Windows
.\scripts\test-integration.ps1
```
**Tests**:
- Service connectivity
- gRPC communication
- Database operations
- Redis pub/sub

### `test-e2e.sh`
**Purpose**: End-to-end testing
**Usage**:
```bash
./scripts/test-e2e.sh
```
**Tests**:
- Complete order flow
- Strategy evaluation → Risk check → Execution
- Frontend → Backend → Services

### `test_e2e.py`
**Purpose**: Python-based E2E tests
**Usage**:
```bash
cd scripts
python test_e2e.py
```
**Requirements**: See `requirements.txt`

---

## 🗄️ Database Scripts

### `verify-database.sh` / `verify-database.ps1`
**Purpose**: Verify database schema and connectivity
**Usage**:
```bash
# Linux/Mac
./scripts/verify-database.sh

# Windows
.\scripts\verify-database.ps1
```
**Checks**:
- PostgreSQL connectivity
- Table existence
- Migration status
- Data integrity

---

## 📦 Dependencies

### `requirements.txt`
Python dependencies for test scripts:
```bash
pip install -r scripts/requirements.txt
```

---

## 🔧 Script Conventions

- **Cross-platform**: Provide both `.sh` (Linux/Mac) and `.ps1` (Windows) versions
- **Error handling**: All scripts exit with non-zero on failure
- **Logging**: Clear output with timestamps
- **Idempotent**: Safe to run multiple times

---

## 📝 Adding New Scripts

When adding new scripts:

1. **Name**: Use `kebab-case` (e.g., `deploy-staging.sh`)
2. **Shebang**: Include `#!/bin/bash` or `#!/usr/bin/env bash`
3. **Documentation**: Add entry to this README
4. **Permissions**: Make executable (`chmod +x script.sh`)
5. **Cross-platform**: Provide Windows version if needed

---

## 🐛 Troubleshooting

### Scripts not executable
```bash
chmod +x scripts/*.sh
```

### Windows execution policy
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Docker not running
```bash
# Check Docker status
docker info

# Start Docker
# Linux: sudo systemctl start docker
# Mac: Open Docker Desktop
# Windows: Start Docker Desktop
```

---

**Last Updated**: 2025-11-28
