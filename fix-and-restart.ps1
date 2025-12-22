# Script to fix database schema and restart containers
Write-Host "Fixing AgriAI Platform..." -ForegroundColor Green

# Stop containers
Write-Host "`nStopping containers..." -ForegroundColor Yellow
docker compose down

# Rebuild and start
Write-Host "`nRebuilding containers..." -ForegroundColor Yellow
docker compose up --build -d

# Wait for backend to be ready
Write-Host "`nWaiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Run migration
Write-Host "`nRunning database migration..." -ForegroundColor Yellow
docker compose exec backend alembic upgrade head

# Restart backend to apply changes
Write-Host "`nRestarting backend..." -ForegroundColor Yellow
docker compose restart backend

Write-Host "`nDone! Check status with: docker compose ps" -ForegroundColor Green
Write-Host "View logs with: docker compose logs -f backend" -ForegroundColor Cyan
