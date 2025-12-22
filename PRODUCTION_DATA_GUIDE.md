# 🚀 Production Deployment Guide - Real Data Strategy

## Overview
This platform now uses **real government data** from data.gov.in API with a hybrid historical backfill approach.

## Data Strategy

### Current Implementation
- ✅ **Real API Data**: Fetches today's market prices from 1,500+ mandis across India
- ✅ **Hybrid Historical**: Generates historical backfill based on current real prices
- ✅ **Daily Collection**: Builds genuine historical data over time
- ✅ **Database Caching**: Stores data for fast access

### Data Flow
```
Day 1: Real today's data + synthetic historical (based on real prices)
Day 2: Real 2 days + synthetic historical (178 days)
Day 30: Real 30 days + synthetic historical (150 days)
Day 180+: Pure real historical data (no synthetic needed)
```

## Production Setup

### 1. Environment Variables
```bash
# Required in .env
DATA_GOV_IN_API_KEY=your_api_key_here
DATABASE_URL=postgresql://user:pass@host:5432/agri_ai_prod
REDIS_URL=redis://redis:6379/0
```

### 2. Daily Data Collection

#### Option A: Cron Job (Linux/Docker)
Add to crontab:
```bash
# Run daily at 6 PM IST (after markets close)
0 18 * * * cd /app && python -m app.data.collect_daily_prices >> logs/cron.log 2>&1
```

#### Option B: Kubernetes CronJob
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: daily-price-collection
spec:
  schedule: "0 18 * * *"  # 6 PM IST daily
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: collector
            image: agri-ai-backend:latest
            command: ["python", "-m", "app.data.collect_daily_prices"]
            env:
            - name: DATA_GOV_IN_API_KEY
              valueFrom:
                secretKeyRef:
                  name: api-keys
                  key: data-gov-in
          restartPolicy: OnFailure
```

#### Option C: Python Scheduler (FastAPI)
Already implemented in `scheduler_service.py`:
```python
# Runs automatically at 6 PM daily
scheduler.add_job(
    collect_market_prices,
    trigger=CronTrigger(hour=18, minute=0),
    id='daily_price_collection'
)
```

### 3. Database Optimization

**Indexes for Performance:**
```sql
-- Add in Alembic migration
CREATE INDEX idx_price_data_crop_date ON price_data(crop, date DESC);
CREATE INDEX idx_price_data_date ON price_data(date DESC);
CREATE INDEX idx_price_data_mandi ON price_data(mandi);
```

**Data Retention:**
```python
# Keep 1 year of data, archive older
# Add to monthly cleanup job
DELETE FROM price_data 
WHERE date < NOW() - INTERVAL '365 days';
```

### 4. Monitoring & Alerts

**Key Metrics to Monitor:**
- Daily collection success rate (target: >95%)
- API response time (target: <2s)
- Database size growth (expect ~2-5 MB/day)
- Cache hit rate (target: >80%)

**Alert Conditions:**
```python
# Set up alerts for:
- Daily collection fails 2 days in row → Page on-call
- API returns empty for all crops → Check API key/quota
- Database disk >80% full → Scale storage
- Redis cache eviction rate >10% → Increase memory
```

### 5. Data Quality Checks

**Daily Validation:**
```python
def validate_daily_collection():
    today = datetime.now().date()
    
    for crop in MAJOR_CROPS:
        count = db.query(PriceData).filter(
            PriceData.crop == crop,
            PriceData.date == today
        ).count()
        
        if count < 10:  # Should have at least 10 markets
            logger.warning(f"Low data quality: {crop} only {count} markets")
```

### 6. Backup Strategy

**Database Backups:**
```bash
# Daily backup at 2 AM
0 2 * * * pg_dump agri_ai_prod | gzip > /backups/agri_ai_$(date +\%Y\%m\%d).sql.gz

# Keep 30 days of backups
find /backups -name "agri_ai_*.sql.gz" -mtime +30 -delete
```

**S3/Cloud Storage:**
```python
# Weekly export to S3 for long-term storage
import boto3
import pandas as pd

def export_to_s3():
    # Export last 7 days of data
    data = get_all_price_data(days=7)
    
    # Save to S3
    s3 = boto3.client('s3')
    s3.upload_file(
        'weekly_export.csv',
        'agri-ai-data-backups',
        f'prices/week_{datetime.now().strftime("%Y_%m_%d")}.csv'
    )
```

## Production Checklist

### Pre-Deployment
- [ ] API key tested and working
- [ ] Database migrations applied
- [ ] Redis configured and accessible
- [ ] Environment variables set
- [ ] SSL certificates installed
- [ ] Logging configured (CloudWatch/ELK)

### Day 1 Tasks
- [ ] Run initial data collection manually
- [ ] Verify data stored in database
- [ ] Test all dashboard features
- [ ] Enable daily cron job
- [ ] Set up monitoring alerts

### Week 1 Monitoring
- [ ] Check daily collection logs
- [ ] Verify data accumulation (7 days real data)
- [ ] Monitor API quota usage
- [ ] Review error logs
- [ ] Performance testing

### Month 1 Goals
- [ ] 30 days of real historical data
- [ ] >95% daily collection success rate
- [ ] All features using primarily real data
- [ ] Predictive models validated against real trends

## Scaling Considerations

### High Traffic Handling
```python
# Current capacity: 1,000 req/min
# Scale: Add more backend instances behind load balancer

# Redis clustering for cache
REDIS_CLUSTER = [
    'redis-1:6379',
    'redis-2:6379',
    'redis-3:6379'
]
```

### Multi-Region Deployment
```
Region 1 (India): Primary data collection + serving
Region 2 (Backup): Read replicas for failover
Region 3 (Analytics): Historical analysis + ML training
```

## Cost Optimization

**Current Usage:**
- API Calls: ~8 crops × 1 call/day = 8 calls/day (FREE)
- Database: ~5 MB/day × 365 days = 1.8 GB/year
- Redis: 512 MB sufficient for caching
- Storage: 10 GB should last 5+ years

**Estimated Costs (AWS):**
```
RDS PostgreSQL (db.t3.micro): $15/month
ElastiCache Redis (cache.t3.micro): $12/month
EC2 Backend (t3.small × 2): $30/month
Total: ~$60/month for production
```

## Rollback Plan

If real API fails:
```python
# Emergency fallback to pure synthetic
service = DataIntegrationService()
data = service.get_price_data('wheat', days=180, force_synthetic=True)
```

Or restore from backup:
```bash
# Restore last good database
psql agri_ai_prod < /backups/agri_ai_20251211.sql.gz
```

## Data Verification

**Test in Production:**
```python
# Check data sources
for crop in ['wheat', 'tomato', 'rice']:
    data = get_price_data(crop, days=30)
    
    real_days = len(data[data['mandi'] != 'Synthetic'])
    synthetic_days = len(data[data['mandi'] == 'Synthetic'])
    
    print(f"{crop}: {real_days} real days, {synthetic_days} synthetic days")
    
    # Target: After 30 days should be 100% real
```

## Support & Maintenance

**Weekly Tasks:**
- Review collection logs
- Check data quality metrics
- Monitor API quota usage
- Validate predictions accuracy

**Monthly Tasks:**
- Database vacuum and analyze
- Review and optimize slow queries
- Update crop price configs if needed
- Test backup restoration

**Quarterly Tasks:**
- API integration health check
- Security audit
- Performance optimization
- Cost analysis

---

## Quick Start Commands

```bash
# 1. Deploy to production
docker compose -f docker-compose.prod.yml up -d

# 2. Run initial data collection
docker compose exec backend python -m app.data.collect_daily_prices

# 3. Verify data
docker compose exec backend python -c "
from app.services.data_integration_service import DataIntegrationService
s = DataIntegrationService()
data = s.get_price_data('tomato', days=30)
print(f'Total: {len(data)} records')
print(f'Real: {len(data[data[\"mandi\"] != \"Synthetic\"])} records')
"

# 4. Monitor logs
docker compose logs -f backend | grep -E "REAL|Synthetic|collection"

# 5. Check database size
docker compose exec postgres psql -U postgres -c "
SELECT pg_size_pretty(pg_database_size('agri_ai')) AS db_size;
SELECT COUNT(*) as total_records FROM price_data;
"
```

## Success Metrics

**Target Performance:**
- API availability: 99.5%
- Daily collection success: >95%
- Response time (p95): <500ms
- Cache hit rate: >80%
- Real data coverage: 100% after 180 days

---

**Questions?** Check logs at `/app/logs/` or contact DevOps team.
