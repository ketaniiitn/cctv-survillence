from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.event import Event
from app.schemas.event import EventIn

router = APIRouter(
    prefix="/events",
    tags=["Events"]
)


@router.post("/ingest")
def ingest_event(
    event: EventIn,
    db: Session = Depends(get_db)
):

    existing = db.query(Event).filter(
        Event.event_id == event.event_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="event already exists"
        )

    db_event = Event(
        event_id=event.event_id,
        store_id=event.store_id,
        camera_id=event.camera_id,
        visitor_id=event.visitor_id,
        event_type=event.event_type,
        timestamp=event.timestamp,
        zone_id=event.zone_id,
        dwell_ms=event.dwell_ms,
        is_staff=event.is_staff,
        confidence=event.confidence,
        event_metadata=event.metadata
    )

    db.add(db_event)

    db.commit()

    return {
        "message": "event stored",
        "event_id": event.event_id
    }