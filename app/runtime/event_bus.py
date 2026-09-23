import hashlib, json
from typing import Callable, Dict, List

class EventBus:
    def __init__(self):
        self.events: List[dict] = []
        self.handlers: Dict[str, List[Callable]] = {}

    def subscribe(self, event_type, handler):
        self.handlers.setdefault(event_type, []).append(handler)

    def publish(self, event_type, payload):
        seq = len(self.events) + 1
        event = {"event_id": f"evt_{seq:08d}", "sequence": seq,
                 "event_type": event_type, "payload": payload}
        canonical = json.dumps(event, sort_keys=True, separators=(",",":"))
        event["provenance_hash"] = hashlib.sha256(canonical.encode()).hexdigest()
        self.events.append(event)
        for handler in self.handlers.get(event_type, []):
            handler(event)
        return event
