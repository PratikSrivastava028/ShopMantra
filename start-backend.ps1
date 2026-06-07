# ShopMantra Backend Startup Script for Windows
Write-Host "Starting ShopMantra Backend Microservices..." -ForegroundColor Green

$services = @("auth", "product", "cart", "order", "payment", "ai-buddy", "notification", "seller-dashboard")

foreach ($service in $services) {
    Write-Host "Launching microservice: $service..." -ForegroundColor Cyan
    Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "$PSScriptRoot\$service" -WindowStyle Hidden
}

Write-Host "All 8 backend microservices successfully launched in the background!" -ForegroundColor Green
