import hashlib, json, platform
from datetime import datetime, timezone

def build_manifest():
    return {
        "project": "DNEM",
        "version": "v7.7",
        "artifact": "EXECUTABLE_APPLICATION_SKELETON",
        "generated_utc": datetime.now(timezone.utc).isoformat(),
        "python": platform.python_version(),
        "scientific_validation": False,
        "status": "IMPLEMENTATION_BASELINE"
    }

def manifest_hash(manifest):
    return hashlib.sha256(
        json.dumps(manifest, sort_keys=True, separators=(",",":")).encode()
    ).hexdigest()
