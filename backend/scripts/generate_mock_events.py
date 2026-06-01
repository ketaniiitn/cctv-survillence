import uuid
import random
import requests

from datetime import datetime, timedelta

API_URL = "http://127.0.0.1:8000/events/ingest"

STORE_ID = "store_1"
CAMERA_ID = "cam_1"

ZONES = [
    "SKINCARE",
    "MAKEUP",
    "FRAGRANCE",
    "HAIRCARE",
    "BILLING"
]


def create_event(
    visitor_id,
    event_type,
    zone_id=None,
    dwell_ms=0
):
    return {
        "event_id": str(uuid.uuid4()),
        "store_id": STORE_ID,
        "camera_id": CAMERA_ID,
        "visitor_id": visitor_id,
        "event_type": event_type,
        "timestamp": datetime.utcnow().isoformat(),
        "zone_id": zone_id,
        "dwell_ms": dwell_ms,
        "is_staff": False,
        "confidence": round(random.uniform(0.85, 0.99), 2),
        "metadata": {}
    }


def send_event(event):
    response = requests.post(
        API_URL,
        json=event
    )

    if response.status_code not in [200, 201]:
        print(
            f"Failed: {response.status_code}",
            response.text
        )


def main():

    total_events = 0

    for i in range(100):

        visitor_id = f"visitor_{i}"

        events = []

        # ENTRY
        events.append(
            create_event(
                visitor_id,
                "ENTRY",
                "ENTRANCE"
            )
        )

        # Zone activity
        zone = random.choice(ZONES[:-1])

        events.append(
            create_event(
                visitor_id,
                "ZONE_ENTER",
                zone
            )
        )

        dwell = random.randint(
            10000,
            120000
        )

        events.append(
            create_event(
                visitor_id,
                "ZONE_DWELL",
                zone,
                dwell
            )
        )

        # 60% reach billing
        if random.random() < 0.6:

            events.append(
                create_event(
                    visitor_id,
                    "BILLING_QUEUE_JOIN",
                    "BILLING"
                )
            )

            # 50% purchase
            if random.random() < 0.5:

                events.append(
                    create_event(
                        visitor_id,
                        "PURCHASE",
                        "BILLING"
                    )
                )

            else:

                events.append(
                    create_event(
                        visitor_id,
                        "BILLING_QUEUE_ABANDON",
                        "BILLING"
                    )
                )

        # EXIT
        events.append(
            create_event(
                visitor_id,
                "EXIT",
                "ENTRANCE"
            )
        )

        for event in events:
            send_event(event)
            total_events += 1

    print(
        f"Generated and inserted {total_events} events"
    )


if __name__ == "__main__":
    main()