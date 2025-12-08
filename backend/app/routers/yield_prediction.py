from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import BaseModel, Field
from app.services.yield_service import YieldService
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.logging_config import logger

router = APIRouter()
yield_service = YieldService()
limiter = Limiter(key_func=get_remote_address)

class YieldPredictionRequest(BaseModel):
    crop: str = Field(..., description="Crop name")
    area: float = Field(..., description="Area in hectares", gt=0)
    rainfall: float = Field(..., description="Expected rainfall in mm", ge=0)
    temperature: float = Field(..., description="Average temperature in Celsius", ge=0, le=50)
    soil_ph: float = Field(..., description="Soil pH level", ge=0, le=14)
    nitrogen: float = Field(..., description="Nitrogen in kg/hectare", ge=0)
    phosphorus: float = Field(..., description="Phosphorus in kg/hectare", ge=0)
    potassium: float = Field(..., description="Potassium in kg/hectare", ge=0)

@router.post("/predict")
@limiter.limit("50/hour")  # Allow multiple predictions for different scenarios
async def predict_yield(request: Request, yield_request: YieldPredictionRequest):
    """Predict crop yield based on input parameters"""
    try:
        prediction = yield_service.predict_yield(
            crop=yield_request.crop,
            area=yield_request.area,
            rainfall=yield_request.rainfall,
            temperature=yield_request.temperature,
            soil_ph=yield_request.soil_ph,
            nitrogen=yield_request.nitrogen,
            phosphorus=yield_request.phosphorus,
            potassium=yield_request.potassium
        )
        
        if "error" in prediction:
            raise HTTPException(status_code=400, detail=prediction["error"])
        
        return prediction
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@router.get("/crops")
@limiter.limit("200/hour")
async def get_supported_crops(request: Request):
    """Get list of crops supported for yield prediction"""
    return {
        "crops": YieldService.get_supported_crops(),
        "total": len(YieldService.get_supported_crops())
    }

@router.get("/crop-info/{crop}")
@limiter.limit("100/hour")
async def get_crop_info(request: Request, crop: str):
    """Get optimal conditions for a specific crop"""
    crop_lower = crop.lower()
    
    if crop_lower not in YieldService.CROP_DATA:
        raise HTTPException(
            status_code=404, 
            detail=f"Crop '{crop}' not found. Supported: {', '.join(YieldService.get_supported_crops())}"
        )
    
    crop_data = YieldService.CROP_DATA[crop_lower]
    
    return {
        "crop": crop_lower,
        "optimal_temperature": crop_data["optimal_temp"],
        "optimal_rainfall": crop_data["optimal_rainfall"],
        "expected_yield_range": {
            "min_per_hectare": crop_data["min_yield"],
            "max_per_hectare": crop_data["max_yield"],
            "unit": "quintals"
        },
        "recommended_soil_ph": "6.5-7.5",
        "recommended_nutrients": {
            "nitrogen": "40-80 kg/ha",
            "phosphorus": "30-60 kg/ha",
            "potassium": "30-60 kg/ha"
        }
    }