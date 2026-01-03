Write-Host "Starting AgriAI Platform..." -ForegroundColor Green

try {
    docker --version | Out-Null
} catch {
    Write-Host "Docker not found. Install it first." -ForegroundColor Red
    exit 1
}

try {
    docker ps | Out-Null
} catch {
    Write-Host "Docker isn't running. Start Docker Desktop." -ForegroundColor Red
    exit 1
}

if (-Not (Test-Path ".env")) {
    Write-Host ".env file missing" -ForegroundColor Yellow
    if (Test-Path ".env.docker") {
        Copy-Item ".env.docker" ".env"
        Write-Host "Created .env from template. Update it with your API keys before running again." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host "`nSelect environment:" -ForegroundColor Cyan
Write-Host "1. Development"
Write-Host "2. Production"
$choice = Read-Host "Choice (1 or 2)"

if ($choice -eq "2") {
    docker-compose -f docker-compose.prod.yml up --build -d
    Write-Host "`nProduction build started. Check http://localhost" -ForegroundColor Green
} else {
    docker-compose up --build
}
