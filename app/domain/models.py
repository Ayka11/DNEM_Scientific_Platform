from dataclasses import dataclass, field, asdict
from typing import Any, Dict, List, Optional
import time, uuid

@dataclass
class Study:
    study_id: str
    title: str
    version: str = "v7.7"
    status: str = "DRAFT"
    measurement_ids: List[str] = field(default_factory=list)
    seed: int = 20260922
    created_at: float = field(default_factory=time.time)

@dataclass
class Session:
    session_id: str
    study_id: str
    participant_id: str
    state: str = "LOAD_STUDY"
    sequence: int = 0
    events: List[Dict[str, Any]] = field(default_factory=list)

def new_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:12]}"

def to_dict(obj):
    return asdict(obj)
