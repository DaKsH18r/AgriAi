now# 🐳 Docker Quick Start Script

Write-Host "🌾 AgriAI Platform - Docker Setup" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Check if Docker is installed
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
Write-Host "Checking if Docker is running..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop" -ForegroundColor Yellow
    exit 1
}

# Check if .env file exists
Write-Host "Checking environment configuration..." -ForegroundColor Yellow
if (-Not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
    Copy-Item ".env.docker" ".env"
    Write-Host "✅ Created .env file" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Please edit .env and add your API keys!" -ForegroundColor Red
    Write-Host "Required: GEMINI_API_KEY, OPENWEATHER_API_KEY" -ForegroundColor Yellow
    Write-Host ""
    $response = Read-Host "Have you added your API keys? (y/n)"
    if ($response -ne "y") {
        Write-Host "Please edit .env file and run this script again" -ForegroundColor Yellow
        notepad .env
        exit 0
    }
} else {
    Write-Host "✅ .env file found" -ForegroundColor Green
}

# Ask user which environment
Write-Host ""
Write-Host "Which environment do you want to run?" -ForegroundColor Cyan
Write-Host "1. Development (with hot reload)" -ForegroundColor White
Write-Host "2. Production (optimized)" -ForegroundColor White
$choice = Read-Host "Enter choice (1 or 2)"

if ($choice -eq "2") {
    $composeFile = "docker-compose.prod.yml"
    $envType = "Production"
} else {
    $composeFile = "docker-compose.yml"
    $envType = "Development"
}

Write-Host ""
Write-Host "🚀 Starting $envType environment..." -ForegroundColor Green
Write-Host ""

# Build and start containers
try {
    if ($choice -eq "2") {
        docker-compose -f $composeFile up --build -d
    } else {
        docker-compose -f $composeFile up --build
    }
    
    Write-Host ""
    Write-Host "✅ Docker containers started successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Access your application:" -ForegroundColor Cyan
    Write-Host "   Frontend:  http://localhost" -ForegroundColor White
    Write-Host "   Backend:   http://localhost:8000" -ForegroundColor White
    Write-Host "   API Docs:  http://localhost:8000/docs" -ForegroundColor White
    Write-Host "   Health:    http://localhost:8000/health" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 View logs:" -ForegroundColor Cyan
    Write-Host "   docker-compose logs -f" -ForegroundColor White
    Write-Host ""
    Write-Host "🛑 Stop containers:" -ForegroundColor Cyan
    Write-Host "   docker-compose down" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "❌ Failed to start Docker containers!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "1. Ports 80, 8000, or 5432 already in use" -ForegroundColor White
    Write-Host "2. Docker daemon not running" -ForegroundColor White
    Write-Host "3. Insufficient memory (need 4GB+)" -ForegroundColor White
    Write-Host ""
    Write-Host "Check logs with: docker-compose logs" -ForegroundColor White
    Write-Host ""
    exit 1
}
