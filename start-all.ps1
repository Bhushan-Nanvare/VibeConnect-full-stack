# Start-all PowerShell script for VibeConnect
# Opens new PowerShell windows and runs the configured commands.

$commands = @(
    @{Name="Inngest Dev Server"; Cmd="npx inngest-cli@latest dev"},
    @{Name="Backend Server"; Cmd="cd `"$PSScriptRoot\server`"; npm run server"},
    @{Name="React Frontend"; Cmd="cd `"$PSScriptRoot\client`"; npm run dev"}
)

Write-Host "Starting VibeConnect services..." -ForegroundColor Cyan
Write-Host "Opening ${($commands).Count} terminal windows..." -ForegroundColor Yellow
Write-Host ""

foreach ($item in $commands) {
    Write-Host "Starting: $($item.Name)" -ForegroundColor Green
    Start-Process -FilePath "powershell" -ArgumentList "-NoExit -Command cd `"$PSScriptRoot`"; Write-Host 'Starting $($item.Name)...' -ForegroundColor Cyan; $($item.Cmd)"
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "All services launched!" -ForegroundColor Green
Write-Host "Check the terminal windows for status:" -ForegroundColor Yellow
Write-Host "  - Inngest Dev Server: http://localhost:8288" -ForegroundColor White
Write-Host "  - Backend Server: http://localhost:4000" -ForegroundColor White
Write-Host "  - React Frontend: http://localhost:5173" -ForegroundColor White
