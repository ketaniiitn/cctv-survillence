from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.event import Event


class AnalyticsService:

    @staticmethod
    def get_store_metrics(
        db: Session,
        store_id: str
    ):
        unique_visitors = (
            db.query(Event.visitor_id)
            .filter(
                Event.store_id == store_id,
                Event.is_staff.is_(False)
            )
            .distinct()
            .count()
        )

        entries = (
            db.query(Event)
            .filter(
                Event.store_id == store_id,
                Event.event_type == "ENTRY"
            )
            .count()
        )

        exits = (
            db.query(Event)
            .filter(
                Event.store_id == store_id,
                Event.event_type == "EXIT"
            )
            .count()
        )

        avg_dwell = (
            db.query(func.avg(Event.dwell_ms))
            .filter(
                Event.store_id == store_id,
                Event.dwell_ms > 0
            )
            .scalar()
        )

        avg_dwell = avg_dwell or 0

        queue_joins = (
            db.query(Event)
            .filter(
                Event.store_id == store_id,
                Event.event_type == "BILLING_QUEUE_JOIN"
            )
            .count()
        )

        queue_abandons = (
            db.query(Event)
            .filter(
                Event.store_id == store_id,
                Event.event_type == "BILLING_QUEUE_ABANDON"
            )
            .count()
        )

        queue_depth = max(
            queue_joins - queue_abandons,
            0
        )

        abandonment_rate = (
            (queue_abandons / queue_joins) * 100
            if queue_joins > 0
            else 0
        )

        return {
            "unique_visitors": unique_visitors,
            "avg_dwell_time": round(avg_dwell, 2),
            "entries": entries,
            "exits": exits,
            "conversion_rate": 0,
            "queue_depth": queue_depth,
            "abandonment_rate": round(abandonment_rate, 2)
        }

    @staticmethod
    def get_funnel(
        db: Session,
        store_id: str
    ):
        entry = (
            db.query(Event.visitor_id)
            .filter(
                Event.store_id == store_id,
                Event.event_type == "ENTRY",
                Event.is_staff.is_(False)
            )
            .distinct()
            .count()
        )

        zone_visit = (
            db.query(Event.visitor_id)
            .filter(
                Event.store_id == store_id,
                Event.event_type == "ZONE_ENTER",
                Event.is_staff.is_(False)
            )
            .distinct()
            .count()
        )

        billing = (
            db.query(Event.visitor_id)
            .filter(
                Event.store_id == store_id,
                Event.event_type == "BILLING_QUEUE_JOIN",
                Event.is_staff.is_(False)
            )
            .distinct()
            .count()
        )

        purchase = (
            db.query(Event.visitor_id)
            .filter(
                Event.store_id == store_id,
                Event.event_type == "PURCHASE",
                Event.is_staff.is_(False)
            )
            .distinct()
            .count()
        )

        return {
            "entry": entry,
            "zone_visit": zone_visit,
            "billing_queue": billing,
            "purchase": purchase
        }

    @staticmethod
    def get_heatmap(
        db: Session,
        store_id: str
    ):
        rows = (
            db.query(
                Event.zone_id,
                func.count(Event.event_id),
                func.avg(Event.dwell_ms)
            )
            .filter(
                Event.store_id == store_id,
                Event.zone_id.isnot(None)
            )
            .group_by(Event.zone_id)
            .all()
        )

        result = []

        for zone, count, avg_dwell in rows:
            result.append({
                "zone_id": zone,
                "visit_count": count,
                "avg_dwell_time": round(avg_dwell or 0, 2)
            })

        return result

    @staticmethod
    def get_anomalies(
        db: Session,
        store_id: str
    ):
        anomalies = []

        high_dwell = (
            db.query(Event)
            .filter(
                Event.store_id == store_id,
                Event.dwell_ms > 120000
            )
            .all()
        )

        for event in high_dwell:
            anomalies.append({
                "type": "HIGH_DWELL_TIME",
                "severity": "WARN",
                "visitor_id": event.visitor_id,
                "dwell_ms": event.dwell_ms,
                "suggested_action": "Check customer assistance needs"
            })

        return anomalies