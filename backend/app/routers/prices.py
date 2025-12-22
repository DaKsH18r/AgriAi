from fastapi import APIRouter, HTTPException, Query, Request
from app.services.price_service import PriceService
from app.services.data_integration_service import data_service
from typing import List
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.logging_config import logger

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.get("/predict")
@limiter.limit("200/hour")  # Increased limit for price predictions
async def predict_crop_prices(
    request: Request,
    crop: str = Query(..., description="Crop name (wheat, rice, tomato, onion, potato, cotton, sugarcane)"),
    days: int = Query(30, description="Number of days to predict", ge=7, le=90)
):
    """Predict future prices for a crop"""
    try:
        from app.services.price_service import PriceService
        
        prediction_data = PriceService.predict_prices(crop, days)
        
        if "error" in prediction_data:
            raise HTTPException(status_code=400, detail=prediction_data["error"])
        
        return prediction_data
    
    except HTTPException:
        raise
    except Exception as e:
        from app.core.logging_config import logger
        logger.error("Price prediction error", exc_info=e, endpoint="/api/prices/predict")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/historical")
@limiter.limit("200/hour")
async def get_historical_prices(
    request: Request,
    crop: str = Query(..., description="Crop name"),
    days: int = Query(90, description="Number of days of history", ge=30, le=365)
):
    """Get historical price data for a crop"""
    try:
        # Get historical data from database (real + synthetic)
        historical_df = data_service.get_price_data(crop, days=days)
        
        if historical_df.empty:
            raise HTTPException(status_code=404, detail=f"No price data found for {crop}")
        
        # Convert to list of dicts with proper date formatting
        prices_list = []
        for _, row in historical_df.iterrows():
            prices_list.append({
                'date': row['date'].isoformat() if hasattr(row['date'], 'isoformat') else str(row['date']),
                'price': float(row['price']),
                'commodity': row.get('commodity', crop)
            })
        
        return {
            "crop": crop.lower(),
            "prices": prices_list,
            "summary": {
                "average_price": round(historical_df['price'].mean(), 2),
                "min_price": round(historical_df['price'].min(), 2),
                "max_price": round(historical_df['price'].max(), 2),
                "current_price": round(historical_df['price'].iloc[-1], 2)
            }
        }
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

@router.get("/compare")
@limiter.limit("200/hour")
async def compare_markets(
    request: Request,
    crop: str = Query(..., description="Crop name")
):
    """Compare prices across different mandis"""
    try:
        comparison_data = PriceService.get_market_comparison(crop)
        
        if "error" in comparison_data:
            raise HTTPException(status_code=400, detail=comparison_data["error"])
        
        return comparison_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

@router.get("/crops")
@limiter.limit("200/hour")  # Higher limit for simple list
async def get_supported_crops(request: Request):
    """Get list of supported crops"""
    return {
        "crops": PriceService.CROPS,
        "total": len(PriceService.CROPS)
    }