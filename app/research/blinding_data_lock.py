from dataclasses import dataclass, asdict
from datetime import datetime, timezone
import hashlib, json

@dataclass
class DatasetLock:
    dataset_id:str
    version:int
    status:str
    data_hash:str
    metadata_hash:str
    blinded:bool
    locked_at:str
    unlock_at:str=""
    unlock_reason:str=""
    unlock_authorized:bool=False
    manifest_hash:str=""

class BlindingDataLockEngine:
    """
    Dataset integrity and blinding governance.

    The engine records whether a dataset was blinded and prevents silent mutation
    after lock. It does not itself guarantee absence of information leakage.
    """
    def __init__(self):
        self.datasets={}

    def _hash(self,d):
        core={k:v for k,v in d.items() if k!="manifest_hash"}
        return hashlib.sha256(json.dumps(core,sort_keys=True,separators=(",",":")).encode()).hexdigest()

    def register(self,dataset_id,data,metadata=None,blinded=True):
        if dataset_id in self.datasets:
            raise ValueError("dataset already registered")
        raw=json.dumps(data,sort_keys=True,separators=(",",":"))
        meta=json.dumps(metadata or {},sort_keys=True,separators=(",",":"))
        r={
            "dataset_id":dataset_id,"version":1,"status":"REGISTERED",
            "data_hash":hashlib.sha256(raw.encode()).hexdigest(),
            "metadata_hash":hashlib.sha256(meta.encode()).hexdigest(),
            "blinded":bool(blinded),"locked_at":"",
            "unlock_at":"","unlock_reason":"","unlock_authorized":False,
            "manifest_hash":""
        }
        self.datasets[dataset_id]=r
        return dict(r)

    def lock(self,dataset_id):
        r=self.datasets[dataset_id]
        if r["status"]=="LOCKED": return dict(r)
        r["status"]="LOCKED"
        r["locked_at"]=datetime.now(timezone.utc).isoformat()
        r["manifest_hash"]=self._hash(r)
        return dict(r)

    def unlock(self,dataset_id,reason,authorized=True):
        r=self.datasets[dataset_id]
        if r["status"]!="LOCKED":
            raise ValueError("dataset must be locked before unlock")
        if not reason or not authorized:
            raise ValueError("authorized unlock requires a reason")
        r["status"]="UNLOCKED"
        r["unlock_at"]=datetime.now(timezone.utc).isoformat()
        r["unlock_reason"]=reason
        r["unlock_authorized"]=True
        return dict(r)

    def verify(self,dataset_id):
        r=self.datasets[dataset_id]
        return {"valid":self._hash(r)==r["manifest_hash"],
                "dataset_id":dataset_id,
                "status":r["status"],
                "blinded":r["blinded"]}

    def register_unblinding(self,dataset_id,reason):
        r=self.datasets[dataset_id]
        if r["status"]!="UNLOCKED":
            raise ValueError("dataset must be explicitly unlocked")
        r["status"]="UNBLINDED"
        r["unlock_reason"]=reason
        return dict(r)
