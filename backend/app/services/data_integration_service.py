import requests
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, Optional
from sqlalchemy.orm import Session
from app.core.db_session import get_db_session, get_db_session_no_commit
from app.models.price_data import PriceData
from app.core.logging_config import logger
import os
from dotenv import load_dotenv

load_dotenv()


class DataIntegrationService:
    """
    Production-grade data integration service with multiple fallbacks
    """
    
    def __init__(self):
        self.data_gov_api_key = os.getenv("DATA_GOV_IN_API_KEY")
        self.resource_id = "9ef84268-d588-465a-a308-a864a43d0070"
        self.base_url = "https://api.data.gov.in/resource"
        
    def fetch_real_api_data(self, commodity: str = None, limit: int = 1000, offset: int = 0) -> Optional[Dict]:
        """
        Attempt to fetch real data from data.gov.in API
        """
        try:
            logger.info(f"Attempting to fetch data from data.gov.in API (commodity={commodity}, limit={limit}, offset={offset})")
            
            url = f"{self.base_url}/{self.resource_id}"
            
            params = {
                "api-key": self.data_gov_api_key,
                "format": "json",
                "limit": limit,
                "offset": offset
            }
            
            # Add commodity filter if specified
            if commodity:
                params["filters[Commodity]"] = commodity
            
            response = requests.get(url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check if data exists
                if 'records' in data and len(data['records']) > 0:
                    logger.info(f"✅ Successfully fetched {data['count']} records from API (total available: {data.get('total', 'unknown')})")
                    return data
                else:
                    logger.warning("⚠️ API returned empty data")
                    return None
                    
            elif response.status_code == 502:
                logger.error("❌ API returned 502 Bad Gateway - Server issue")
                return None
            elif response.status_code == 429:
                logger.error("❌ API rate limit exceeded")
                return None
            else:
                logger.error(f"❌ API returned status code: {response.status_code}")
                logger.error(f"Response: {response.text[:200]}")
                return None
                
        except requests.exceptions.Timeout:
            logger.error("❌ API request timed out after 30 seconds")
            return None
        except requests.exceptions.ConnectionError:
            logger.error("❌ Could not connect to API server")
            return None
        except Exception as e:
            logger.error(f"❌ Unexpected error fetching API data: {str(e)}")
            return None
    
    def generate_synthetic_fallback_data(self, crop: str, days: int = 180) -> pd.DataFrame:
        """
        Generate realistic synthetic data as fallback
        """
        logger.info(f"📊 Generating synthetic data for {crop} ({days} days)")
        
        # Realistic price ranges per crop
        crop_config = {
            "wheat": {"base": 2100, "variance": 300, "seasonality": 1.2},
            "rice": {"base": 2800, "variance": 400, "seasonality": 1.15},
            "tomato": {"base": 2000, "variance": 1500, "seasonality": 2.0},
            "onion": {"base": 2500, "variance": 2000, "seasonality": 1.8},
            "potato": {"base": 1200, "variance": 600, "seasonality": 1.4},
            "cotton": {"base": 6500, "variance": 800, "seasonality": 1.1},
            "sugarcane": {"base": 3000, "variance": 300, "seasonality": 1.05},
            "soyabean": {"base": 3500, "variance": 500, "seasonality": 1.15}
        }
        
        config = crop_config.get(crop.lower(), crop_config["wheat"])
        
        dates = pd.date_range(end=datetime.now(), periods=days, freq='D')
        
        # Generate realistic price patterns
        prices = []
        for i, date in enumerate(dates):
            # Base price with trend
            base_price = config["base"] * (1 + i * 0.0001)
            
            # Seasonal variation
            day_of_year = date.timetuple().tm_yday
            seasonal = np.sin(2 * np.pi * day_of_year / 365) * config["variance"] * 0.3
            
            # Random daily variation
            random_var = np.random.uniform(-config["variance"]/2, config["variance"]/2)
            
            price = base_price + seasonal + random_var
            prices.append(max(price, config["base"] * 0.5))
        
        df = pd.DataFrame({
            'date': dates,
            'price': prices,
            'min_price': [p * 0.95 for p in prices],
            'max_price': [p * 1.05 for p in prices],
            'crop': crop.lower(),
            'mandi': 'Synthetic',
            'state': 'Multiple',
            'variety': 'Standard'
        })
        
        return df
    
    def get_price_data(self, crop: str, days: int = 180, force_synthetic: bool = False) -> pd.DataFrame:
        """
        Main method: Try real API, fallback to synthetic
        
        Args:
            crop: Crop name
            days: Number of days of data
            force_synthetic: Skip API and use synthetic (for testing)
        
        Returns:
            DataFrame with price data
        """
        # Check database cache first
        db_data = self._get_from_database(crop, days)
        if db_data is not None and not db_data.empty:
            data_age_days = (datetime.now().date() - db_data['date'].max().date()).days
            
            if data_age_days < 1:  # Data is fresh (less than 1 day old)
                logger.info(f"✅ Using cached data from database (age: {data_age_days} days)")
                return db_data
        
       # Try real API first (unless forced to use synthetic)
        if not force_synthetic:
            # Map common crop names to API commodity names
            commodity_mapping = {
                "wheat": "Wheat",
                "rice": "Rice",
                "tomato": "Tomato",
                "onion": "Onion",
                "potato": "Potato",
                "cotton": "Cotton",
                "sugarcane": "Sugarcane",
                "soyabean": "Soyabean"
            }
            
            api_commodity = commodity_mapping.get(crop.lower(), crop.title())
            
            api_data = self.fetch_real_api_data(commodity=api_commodity, limit=5000)
            
            if api_data is not None:
                # Process and store API data
                processed_data = self._process_api_data(api_data, crop)
            else:
                processed_data = None
            
            if processed_data is not None and not processed_data.empty:
                    self._store_in_database(processed_data)
                    logger.info("✅ Using REAL API data")
                    
                    # Sort by date (newest first)
                    processed_data = processed_data.sort_values('date', ascending=False)
                    
                    # Take most recent N records (even if dates are old)
                    # This handles historical data that might not be recent
                    if len(processed_data) > days:
                        processed_data = processed_data.head(days)
                    
                    logger.info(f"Returning {len(processed_data)} records from {processed_data['date'].min()} to {processed_data['date'].max()}")
                    
                    return processed_data
        
        # Fallback to synthetic data
        logger.warning("⚠️ Falling back to synthetic data")
        synthetic_data = self.generate_synthetic_fallback_data(crop, days)
        
        return synthetic_data
    
    def _get_from_database(self, crop: str, days: int) -> Optional[pd.DataFrame]:
        """Get cached data from database"""
        with get_db_session_no_commit() as db:
            end_date = datetime.now().date()
            start_date = end_date - timedelta(days=days)
            
            records = db.query(PriceData).filter(
                PriceData.crop == crop.lower(),
                PriceData.date >= start_date
            ).order_by(PriceData.date).all()
            
            if not records:
                return None
            
            df = pd.DataFrame([{
                'date': pd.to_datetime(r.date),
                'price': r.modal_price,
                'min_price': r.min_price,
                'max_price': r.max_price,
                'crop': r.crop,
                'mandi': r.mandi,
                'state': r.state,
                'variety': r.variety
            } for r in records])
            
            return df
    
    def _process_api_data(self, api_data: Dict, crop_filter: str = None) -> Optional[pd.DataFrame]:
        """Process raw API data into our format"""
        try:
            if 'records' not in api_data or len(api_data['records']) == 0:
                logger.warning("No records in API response")
                return None
            
            records = api_data['records']
            df = pd.DataFrame(records)
            
            logger.info(f"Processing {len(df)} raw records from API")
            
            # Filter by crop if specified
            if crop_filter and 'Commodity' in df.columns:
                original_count = len(df)
                df = df[df['Commodity'].str.lower().str.contains(crop_filter.lower(), na=False)]
                logger.info(f"Filtered from {original_count} to {len(df)} records for {crop_filter}")
            
            if df.empty:
                logger.warning(f"No records found for crop: {crop_filter}")
                return None
            
            # Convert date format (dd/MM/yyyy to datetime)
            df['date'] = pd.to_datetime(df['Arrival_Date'], format='%d/%m/%Y', errors='coerce')
            
            # Convert prices to float (handle empty strings and invalid values)
            df['modal_price'] = pd.to_numeric(df['Modal_Price'], errors='coerce')
            df['min_price'] = pd.to_numeric(df['Min_Price'], errors='coerce')
            df['max_price'] = pd.to_numeric(df['Max_Price'], errors='coerce')
            
            # Create clean dataframe
            processed = pd.DataFrame({
                'date': df['date'],
                'price': df['modal_price'],
                'min_price': df['min_price'],
                'max_price': df['max_price'],
                'crop': df['Commodity'].str.lower(),
                'mandi': df['Market'],
                'state': df['State'],
                'variety': df.get('Variety', 'Standard')
            })
            
            # Remove rows with invalid data
            processed = processed.dropna(subset=['date', 'price'])
            
            # Sort by date
            processed = processed.sort_values('date')
            
            logger.info(f"✅ Processed {len(processed)} valid records")
            return processed
            
        except Exception as e:
            logger.error(f"Error processing API data: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            return None
    
    def _store_in_database(self, df: pd.DataFrame):
        """Store processed data in database"""
        with get_db_session() as db:
            stored_count = 0
            skipped_count = 0
            
            for _, row in df.iterrows():
                # Check if record exists
                existing = db.query(PriceData).filter(
                    PriceData.crop == row['crop'],
                    PriceData.mandi == row['mandi'],
                    PriceData.date == row['date'].date()
                ).first()
                
                if not existing:
                    record = PriceData(
                        crop=row['crop'],
                        mandi=row['mandi'],
                        state=row['state'],
                        date=row['date'].date(),
                        modal_price=float(row['price']),
                        min_price=float(row['min_price']) if pd.notna(row['min_price']) else float(row['price']) * 0.95,
                        max_price=float(row['max_price']) if pd.notna(row['max_price']) else float(row['price']) * 1.05,
                        variety=row['variety']
                    )
                    db.add(record)
                    stored_count += 1
                else:
                    skipped_count += 1
            
            # Auto-commits when context exits
            logger.info(f"✅ Stored {stored_count} new records in database (skipped {skipped_count} duplicates)")


# Singleton instance
data_service = DataIntegrationService()