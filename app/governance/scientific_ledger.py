import hashlib, json, time

class ScientificLedger:
    def __init__(self):
        self.entries=[]

    def record(self, study_id, validation_result):
        canonical=json.dumps(validation_result,sort_keys=True,separators=(",",":"))
        entry={
            "entry_id":f"ledger_{len(self.entries)+1:06d}",
            "study_id":study_id,
            "timestamp":time.time(),
            "status":validation_result["status"],
            "promotion_allowed":validation_result["promotion_allowed"],
            "evidence_hash":hashlib.sha256(canonical.encode()).hexdigest()
        }
        self.entries.append(entry)
        return entry
