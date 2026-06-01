from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.analytics_service import AnalyticsService

router = APIRouter(
    prefix="/stores",
    tags=["Analytics"]
)


@router.get("/{store_id}/metrics")
def get_metrics(
    store_id: str,
    db: Session = Depends(get_db)
):
    return AnalyticsService.get_store_metrics(
        db,
        store_id
    )
    
@router.get("/{store_id}/funnel")
def get_funnel(
    store_id: str,
    db: Session = Depends(get_db)
):
    return AnalyticsService.get_funnel(
        db,
        store_id
    )
    
@router.get("/{store_id}/heatmap")
def get_heatmap(
    store_id: str,
    db: Session = Depends(get_db)
):
    return AnalyticsService.get_heatmap(
        db,
        store_id
    )
    
@router.get("/{store_id}/anomalies")
def get_anomalies(
    store_id: str,
    db: Session = Depends(get_db)
):
    return AnalyticsService.get_anomalies(
        db,
        store_id
    )   