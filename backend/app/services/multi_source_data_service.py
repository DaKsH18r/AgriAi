import requests
import pandas as pd
from datetime import datetime, timedelta
from typing import Optional, Dict, List
import logging
import os

logger = logging.getLogger(__name__)

class MultiSourceDataService:
    
    def __init__(self):
        self.api_key = os.getenv("DATA_GOV_IN_API_KEY")
        
        # Data source configurations
        self.sources = {
            # Current AGMARKNET data (via data.gov.in)
            "agmarknet_current": {
                "url": "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
                "type": "current_prices",
                "fields": ["commodity", "state", "district", "market", "arrival_date", "min_price", "max_price", "modal_price"]
            },
            
            # Alternative price datasets on data.gov.in
            "agmarknet_historical": {
                "url": "https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24",  # Different dataset ID
                "type": "historical_prices",
                "fields": ["commodity", "arrival_date", "min_price", "max_price", "modal_price"]
            },
            
            # Crop production data
            "crop_production": {
                "url": "https://api.data.gov.in/resource/8030a395-5d2f-4311-afb3-83f52c7c9bb1",
                "type": "production",
                "fields": ["crop", "season", "area", "production", "yield"]
            },
            
            # MSP (Minimum Support Price) data
            "msp_data": {
                "url": "https://api.data.gov.in/resource/c1e9f7c5-2a5e-4f7c-b5d8-3e4f5a6b7c8d",
                "type": "msp",
                "fields": ["crop", "season", "msp"]
            }
        }
        
        # Crop mapping
        self.crop_mapping = {
            "wheat": "Wheat",
            "rice": "Rice", 
            "tomato": "Tomato",
            "potato": "Potato",
            "onion": "Onion",
            "maize": "Maize",
            "cotton": "Cotton",
            "sugarcane": "Sugarcane",
            "soyabean": "Soyabean"
        }
    
    def fetch_from_source(self, source_key: str, filters: Dict = None, limit: int = 1000) -> Optional[Dict]:
        if source_key not in self.sources:
            logger.error(f"Unknown source: {source_key}")
            return None
        
        source = self.sources[source_key]
        
        try:
            params = {
                "api-key": self.api_key,
                "format": "json",
                "limit": limit
            }
            
            # Add filters
            if filters:
                for key, value in filters.items():
                    params[f"filters[{key}]"] = value
            
            logger.info(f"Fetching from {source_key}: {source['url']}")
            response = requests.get(source['url'], params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                record_count = len(data.get('records', []))
                logger.info(f"[OK] {source_key}: {record_count} records")
                return data
            else:
                logger.warning(f"[WARNING] {source_key} returned {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"[ERROR] {source_key} error: {str(e)}")
            return None
    
    def get_comprehensive_price_data(self, crop: str, days: int = 180) -> pd.DataFrame:
        all_data = []
        
        commodity = self.crop_mapping.get(crop.lower(), crop.title())
        
        # 1. Try current AGMARKNET data (what we're currently using)
        current_data = self.fetch_from_source(
            "agmarknet_current",
            filters={"commodity": commodity},
            limit=5000
        )
        
        if current_data and current_data.get('records'):
            df = pd.DataFrame(current_data['records'])
            df['source'] = 'agmarknet_current'
            df['date'] = pd.to_datetime(df['arrival_date'], format='%d/%m/%Y', errors='coerce')
            all_data.append(df)
            logger.info(f"[OK] Got {len(df)} records from current AGMARKNET")
        
        # 2. Try historical dataset (if exists)
        try:
            historical_data = self.fetch_from_source(
                "agmarknet_historical",
                filters={"commodity": commodity},
                limit=5000
            )
            
            if historical_data and historical_data.get('records'):
                df_hist = pd.DataFrame(historical_data['records'])
                df_hist['source'] = 'agmarknet_historical'
                df_hist['date'] = pd.to_datetime(df_hist['arrival_date'], format='%d/%m/%Y', errors='coerce')
                all_data.append(df_hist)
                logger.info(f"[OK] Got {len(df_hist)} historical records")
        except Exception as e:
            logger.info(f"No historical data available: {str(e)}")
        
        # 3. Combine all sources
        if all_data:
            combined_df = pd.concat(all_data, ignore_index=True)
            
            # Remove duplicates (prefer current over historical)
            combined_df = combined_df.sort_values(['date', 'source']).drop_duplicates(
                subset=['date', 'market'] if 'market' in combined_df.columns else ['date'],
                keep='first'
            )
            
            # Get only required date range
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)
            combined_df = combined_df[combined_df['date'] >= start_date]
            
            logger.info(f"[DATA] Combined data: {len(combined_df)} unique records from {combined_df['date'].min()} to {combined_df['date'].max()}")
            
            return combined_df
        
        return pd.DataFrame()
    
    def get_msp_data(self, crop: str) -> Optional[float]:
        try:
            commodity = self.crop_mapping.get(crop.lower(), crop.title())
            msp_data = self.fetch_from_source(
                "msp_data",
                filters={"crop": commodity}
            )
            
            if msp_data and msp_data.get('records'):
                # Get latest MSP
                latest = msp_data['records'][0]
                return float(latest.get('msp', 0))
        except Exception as e:
            logger.error(f"MSP fetch error: {str(e)}")
        
        return None
    
    def check_all_sources_status(self) -> Dict:
        status = {}
        
        for source_key, source_config in self.sources.items():
            try:
                test_data = self.fetch_from_source(source_key, limit=1)
                status[source_key] = {
                    "status": "available" if test_data else "unavailable",
                    "url": source_config['url']
                }
            except Exception as e:
                status[source_key] = {
                    "status": "error",
                    "error": str(e)
                }
        
        return status


# Global instance
multi_source_service = MultiSourceDataService()
