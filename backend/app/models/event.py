from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import Boolean
from sqlalchemy import Float
from sqlalchemy import BigInteger
from sqlalchemy import JSON

from app.db.database import Base


class Event(Base):
    __tablename__ = "events"

    event_id = Column(String, primary_key=True)

    store_id = Column(String, nullable=False)

    camera_id = Column(String, nullable=False)

    visitor_id = Column(String, nullable=False)

    event_type = Column(String, nullable=False)

    timestamp = Column(String, nullable=False)

    zone_id = Column(String)

    dwell_ms = Column(BigInteger)

    is_staff = Column(Boolean)

    confidence = Column(Float)

    event_metadata = Column(JSON)