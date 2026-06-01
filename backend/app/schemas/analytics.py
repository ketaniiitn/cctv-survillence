from pydantic import BaseModel


class StoreMetrics(BaseModel):
    unique_visitors: int
    avg_dwell_time: float
    entries: int
    exits: int
    conversion_rate: float
    queue_depth: int
    abandonment_rate: float