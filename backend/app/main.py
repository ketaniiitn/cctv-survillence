from fastapi import FastAPI

from app.db.database import Base, engine
from app.models.event import Event
from app.api.events import router as event_router
from app.api.analytics import router as analytics_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Store Intelligence API",
    version="1.0.0"
)

app.include_router(event_router)
app.include_router(analytics_router)

@app.get("/")
def root():
    return {"message": "Store Intelligence API Running"}

@app.get("/health")
def health():
    return {"status": "healthy"}
