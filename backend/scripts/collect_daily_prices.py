"""
Daily Price Data Collection Script
Collects real market prices from data.gov.in every day to build historical database
Run this daily via cron/scheduler to accumulate real historical data
"""
import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from app.services.data_integration_service import DataIntegrationService
from datetime import datetime
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def collect_daily_prices():
    service = DataIntegrationService()
    
    crops = [
        'wheat', 'rice', 'tomato', 'potato', 'onion',
        'maize', 'cotton', 'sugarcane', 'soyabean'
    ]
    
    logger.info("=" * 70)
    logger.info(f"DAILY PRICE COLLECTION - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info("=" * 70)
    
    total_collected = 0
    successful = []
    failed = []
    
    for crop in crops:
        try:
            logger.info(f"\n📊 Collecting {crop.upper()}...")
            
            # Fetch real API data (limit to today's data)
            api_data = service.fetch_real_api_data(
                commodity=service.crop_to_commodity.get(crop.lower(), crop.title()),
                limit=1000
            )
            
            if api_data and 'records' in api_data:
                # Process and store
                processed = service._process_api_data(api_data, crop)
                
                if processed is not None and not processed.empty:
                    service._store_in_database(processed)
                    count = len(processed)
                    total_collected += count
                    successful.append(crop)
                    logger.info(f"✅ {crop.upper()}: Collected {count} records")
                else:
                    failed.append(crop)
                    logger.warning(f"⚠️ {crop.upper()}: No valid data to process")
            else:
                failed.append(crop)
                logger.warning(f"⚠️ {crop.upper()}: API returned no data")
                
        except Exception as e:
            failed.append(crop)
            logger.error(f"❌ {crop.upper()}: Error - {str(e)}")
    
    logger.info("\n" + "=" * 70)
    logger.info("COLLECTION SUMMARY")
    logger.info("=" * 70)
    logger.info(f"✅ Successful: {len(successful)} crops - {', '.join(successful)}")
    logger.info(f"❌ Failed: {len(failed)} crops - {', '.join(failed)}")
    logger.info(f"📈 Total Records Collected: {total_collected}")
    logger.info("=" * 70)
    
    return total_collected

if __name__ == "__main__":
    try:
        total = collect_daily_prices()
        logger.info(f"\n✅ Daily collection completed successfully! ({total} records)")
        sys.exit(0)
    except Exception as e:
        logger.error(f"\n❌ Daily collection failed: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        sys.exit(1)
