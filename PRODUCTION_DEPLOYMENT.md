# Production Deployment Guide - Real Data Strategy

## Current Data Situation

**data.gov.in API Status:**
- ✅ **Working** - Fetching real government market prices
- ⚠️ **Limitation** - Only provides TODAY's data (no historical data)
- 📊 **Coverage** - 1,516 records across 5 major crops (Wheat, Rice, Tomato, Potato, Onion)
- 🌍 **Markets** - 886 mandis across India

## Production Strategy: Build Real Historical Data

Since the API only provides current day data, we need to **collect data daily** to build historical database.

### 1. Daily Data Collection Setup

**Automated Collection Script:**
```bash
# Run daily at 6 PM (after market closing)
python backend/scripts/collect_daily_prices.py
```

**What it does:**
- Fetches today's prices for all crops (Wheat, Rice, Tomato, Potato, Onion, etc.)
- Stores in PostgreSQL database
- Over time, builds up 180+ days of real historical data
- Required for ML predictions and trend analysis

### 2. Production Timeline

| Day | Real Data Available | Prediction Quality |
|-----|---------------------|-------------------|
| **Day 1 (Today)** | 1 day | Limited (uses synthetic for history) |
| **Day 7** | 7 days | Better (1 week trend) |
| **Day 30** | 30 days | Good (monthly patterns) |
| **Day 180** | 180 days | Excellent (full seasonal analysis) |

### 3. Deployment Steps

#### Step 1: Set Up Daily Cron Job

**Linux/Ubuntu (Production Server):**
```bash
# Edit crontab
crontab -e

# Add daily collection at 6 PM
0 18 * * * cd /path/to/agri-ai-platform && docker compose exec -T backend python scripts/collect_daily_prices.py >> /var/log/agri-daily-collection.log 2>&1
```

**Windows (Task Scheduler):**
```powershell
# Create scheduled task
$action = New-ScheduledTaskAction -Execute "docker" -Argument "compose exec -T backend python scripts/collect_daily_prices.py"
$trigger = New-ScheduledTaskTrigger -Daily -At 6PM
Register-ScheduledTask -TaskName "AgriDailyDataCollection" -Action $action -Trigger $trigger
```

**Docker-based (scheduler container):**
```yaml
# Add to docker-compose.prod.yml
scheduler:
  build: ./backend
  command: python -m app.services.scheduler_service
  environment:
    - RUN_DAILY_COLLECTION=true
  depends_on:
    - db
    - redis
```

#### Step 2: Initial Data Collection

Run the first collection immediately:
```bash
docker compose exec backend python scripts/collect_daily_prices.py
```

Expected output:
```
✅ WHEAT: Collected 157 records
✅ RICE: Collected 66 records  
✅ TOMATO: Collected 329 records
✅ POTATO: Collected 415 records
✅ ONION: Collected 549 records
📈 Total Records Collected: 1,516
```

#### Step 3: Monitor Daily Collection

**Check logs:**
```bash
# View collection history
docker compose logs backend | grep "DAILY PRICE COLLECTION"

# Check database growth
docker compose exec db psql -U postgres -d agri_ai -c "SELECT crop, COUNT(*), MIN(date), MAX(date) FROM price_data GROUP BY crop;"
```

#### Step 4: Backup Strategy

**Daily Database Backup:**
```bash
# Automated backup script
docker compose exec db pg_dump -U postgres agri_ai > backups/agri_ai_$(date +%Y%m%d).sql

# Keep last 30 days
find backups/ -name "agri_ai_*.sql" -mtime +30 -delete
```

### 4. Current vs Future State

**TODAY (Day 1):**
- ✅ Real data for current prices
- ⚠️ Synthetic historical data (seeded from real prices)
- ✅ All features working
- ⚠️ Limited trend analysis

**AFTER 30 DAYS:**
- ✅ 30 days real historical data
- ✅ Accurate 7-day predictions
- ✅ Real trend analysis
- ✅ Improved AI Agent insights

**AFTER 180 DAYS:**
- ✅ Full 6-month historical data
- ✅ Seasonal pattern analysis
- ✅ Highly accurate predictions
- ✅ Complete market intelligence

### 5. Monitoring & Alerts

**Set up alerts for:**
- ❌ Failed daily collection
- ⚠️ API errors or rate limits
- 📉 Sudden data volume drops
- 🔒 Database storage reaching limits

**Health Check Endpoint:**
```bash
curl http://localhost:8000/api/prices/data-health
# Returns: { "real_data_days": 30, "crops": [...], "last_collection": "2025-12-12" }
```

### 6. Alternative: Pre-populate Historical Data

If you need predictions immediately, options:

**Option A: Use Synthetic Historical (Current Approach)**
- ✅ Works today
- ✅ Seeded from real current prices
- ⚠️ Not actual historical data

**Option B: Find Alternative API with Historical Data**
- AGMARKNET Portal (web scraping required)
- State Agricultural Marketing Board APIs
- Third-party agricultural data providers

**Option C: Manual Data Import**
- Download CSV from AGMARKNET website
- Import historical data: `python scripts/import_historical.py data.csv`

### 7. Production Checklist

- [ ] Set up daily data collection cron job
- [ ] Run initial collection (Day 1)
- [ ] Configure database backups
- [ ] Set up monitoring/alerts
- [ ] Test API rate limits (429 errors)
- [ ] Document data collection schedule
- [ ] Plan for 30-day milestone review
- [ ] Create dashboard for data health monitoring

### 8. Cost & Performance

**API Limits:**
- data.gov.in: Free, no strict rate limits
- Daily collection: ~1,500 records/day
- Database growth: ~50 MB/month (estimated)

**Server Requirements:**
- PostgreSQL: 10GB storage (2+ years of data)
- Redis: 512MB RAM (caching)
- Backend: 1GB RAM, 2 vCPU

### 9. Support & Troubleshooting

**If daily collection fails:**
```bash
# Check API connectivity
docker compose exec backend python -c "import requests; print(requests.get('https://api.data.gov.in').status_code)"

# Check API key
docker compose exec backend python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('API Key:', 'SET' if os.getenv('DATA_GOV_IN_API_KEY') else 'MISSING')"

# Manual collection retry
docker compose exec backend python scripts/collect_daily_prices.py
```

**If predictions fail:**
```bash
# Check data availability
docker compose exec backend python -c "from app.services.data_integration_service import DataIntegrationService; s = DataIntegrationService(); print(s.get_price_data('tomato', 30))"
```

---

## Summary

**For Production with ALL REAL DATA:**

1. ✅ **Deploy today** - System uses real current prices + synthetic history
2. 🔄 **Run daily collection** - Builds real historical database automatically
3. ⏳ **Wait 30-180 days** - Accumulate sufficient historical data
4. 🎯 **Optimize** - Switch from synthetic to 100% real data after Day 30+

**This approach ensures:**
- ✅ No downtime - Works from Day 1
- ✅ Continuous improvement - Data quality increases daily
- ✅ Cost-effective - Free government API
- ✅ Scalable - Handles all crops and markets
