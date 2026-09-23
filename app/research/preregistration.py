from dataclasses import dataclass, asdict
from datetime import datetime, timezone
import hashlib, json

@dataclass
class ProtocolRecord:
    protocol_id:str
    version:int
    status:str
    hypotheses:list
    primary_outcomes:list
    secondary_outcomes:list
    exclusion_rules:list
    analysis_plan:dict
    locked_hash:str
    created_at:str
    parent_id:str=""
    amendment_reason:str=""

class PreregistrationEngine:
    """
    Pre-registration and protocol-lock layer.
    A locked protocol is immutable; amendments create a new version.
    """
    def __init__(self):
        self.records={}

    def _hash(self, d):
        core={k:v for k,v in d.items() if k!="locked_hash"}
        return hashlib.sha256(json.dumps(core,sort_keys=True,separators=(",",":")).encode()).hexdigest()

    def register(self, protocol_id, hypotheses, primary_outcomes,
                 secondary_outcomes=None, exclusion_rules=None, analysis_plan=None):
        if protocol_id in self.records:
            raise ValueError("Protocol already exists")
        d={
            "protocol_id":protocol_id,"version":1,"status":"DRAFT",
            "hypotheses":hypotheses,"primary_outcomes":primary_outcomes,
            "secondary_outcomes":secondary_outcomes or [],
            "exclusion_rules":exclusion_rules or [],
            "analysis_plan":analysis_plan or {},
            "created_at":datetime.now(timezone.utc).isoformat(),
            "parent_id":"","amendment_reason":"","locked_hash":""
        }
        self.records[protocol_id]=d
        return d

    def lock(self, protocol_id):
        r=self.records[protocol_id]
        if r["status"]=="LOCKED":
            return r
        r["status"]="LOCKED"
        r["locked_hash"]=self._hash(r)
        return dict(r)

    def amend(self, protocol_id, amendment_reason, changes):
        old=self.records[protocol_id]
        if old["status"]!="LOCKED":
            raise ValueError("Only locked protocols can be amended")
        new=dict(old)
        new["protocol_id"]=f"{protocol_id}.v{old['version']+1}"
        new["version"]=old["version"]+1
        new["status"]="DRAFT"
        new["parent_id"]=protocol_id
        new["amendment_reason"]=amendment_reason
        for k,v in changes.items():
            if k in {"hypotheses","primary_outcomes","secondary_outcomes",
                     "exclusion_rules","analysis_plan"}:
                new[k]=v
        new["locked_hash"]=""
        self.records[new["protocol_id"]]=new
        return new

    def verify(self, protocol_id):
        r=self.records[protocol_id]
        if r["status"]!="LOCKED":
            return {"valid":False,"reason":"protocol is not locked"}
        return {"valid":self._hash(r)==r["locked_hash"],
                "protocol_id":protocol_id,"locked_hash":r["locked_hash"]}
