param (
    [string]$command
)

# Convert Windows path E:\signal-ops to WSL path /mnt/e/signal-ops
$wslPath = "/mnt/e/signal-ops"

if ($command) {
    Write-Host "Running in WSL: ./dev.sh $command" -ForegroundColor Cyan
    wsl bash -c "cd $wslPath && ./dev.sh $command"
}
else {
    Write-Host "Usage: .\dev.ps1 [command]"
    Write-Host "  docker           - Start all services (Frontend + Execution + Strategy)"
    Write-Host "  strategy-engine  - Run Python Strategy Engine specific setup"
    Write-Host "  stop             - Stop all services"
    Write-Host "  clean            - Clean Docker containers"
}
