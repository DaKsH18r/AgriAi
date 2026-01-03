Write-Host "Fixing database and restarting..." -ForegroundColor Yellow

docker compose down
docker compose up --build -d

Start-Sleep -Seconds 8

docker compose exec backend alembic upgrade head
docker compose restart backend

Write-Host "`nDone. Run 'docker compose ps' to check status" -ForegroundColor Green
