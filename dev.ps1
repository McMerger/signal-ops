# SignalOps Development Script - Windows/WSL Wrapper
# This script runs dev.sh inside WSL where Docker is installed

param(
    [Parameter(Position = 0)]
    [string]$Mode = "",
    
    [Parameter(Position = 1)]
    [string]$SubCommand = ""
)

# Get the WSL path for the current directory (Dynamic or E drive)
$wslPath = "/mnt/e/signal-ops"

# Build the command
if ($SubCommand -ne "") {
    $command = "cd $wslPath && ./dev.sh $Mode $SubCommand"
}
elseif ($Mode -ne "") {
    $command = "cd $wslPath && ./dev.sh $Mode"
}
else {
    $command = "cd $wslPath && ./dev.sh"
}

# Run in WSL
Write-Host "Running in WSL: $command" -ForegroundColor Cyan
wsl bash -c $command
