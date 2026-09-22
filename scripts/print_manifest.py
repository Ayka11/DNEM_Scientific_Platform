import json
from app.governance.manifest import build_manifest, manifest_hash
m = build_manifest()
m["manifest_hash"] = manifest_hash(m)
print(json.dumps(m, indent=2))
