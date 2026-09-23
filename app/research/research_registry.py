from dataclasses import dataclass, asdict
from datetime import datetime, timezone
import hashlib, json, re

ID_RE=re.compile(r"^[A-Z]{2,8}-[0-9]{6}$")

@dataclass
class ResearchRecord:
    research_id:str
    object_type:str
    name:str
    version:int=1
    status:str="DRAFT"
    parent_id:str=""
    immutable_hash:str=""
    created_at:str=""

class ResearchRegistry:
    """
    Registry for experiments, protocols, datasets, analyses, evidence and claims.
    Version increments create new records rather than mutating historical versions.
    """
    TYPES={"EXPERIMENT","PROTOCOL","DATASET","ANALYSIS","EVIDENCE","CLAIM"}

    def __init__(self):
        self.records={}

    def _hash(self, d):
        core={k:v for k,v in d.items() if k!="immutable_hash"}
        return hashlib.sha256(json.dumps(core,sort_keys=True,separators=(",",":")).encode()).hexdigest()

    def register(self, research_id, object_type, name, status="DRAFT", parent_id=""):
        if object_type not in self.TYPES:
            raise ValueError("Unsupported research object type")
        if not ID_RE.match(research_id):
            raise ValueError("research_id must match TYPE-###### style")
        if research_id in self.records:
            raise ValueError("research_id already exists")
        r=ResearchRecord(
            research_id,research_id.split("-")[0] if False else object_type,
            name,1,status,parent_id, "", datetime.now(timezone.utc).isoformat()
        )
        d=asdict(r);d["immutable_hash"]=self._hash(d);r.immutable_hash=d["immutable_hash"]
        self.records[research_id]=d
        return d

    def version(self, research_id, name=None, status=None):
        if research_id not in self.records: raise KeyError(research_id)
        old=self.records[research_id]
        prefix=old["research_id"].split("-")[0]
        n=max([int(x["research_id"].split("-")[1]) for x in self.records.values()
               if x["research_id"].startswith(prefix+"-")]+[0])+1
        new_id=f"{prefix}-{n:06d}"
        d=self.register(new_id,old["object_type"],name or old["name"],
                        status or old["status"],parent_id=research_id)
        d["version"]=old["version"]+1
        d["immutable_hash"]=self._hash(d)
        self.records[new_id]=d
        return d

    def verify(self, research_id):
        r=self.records[research_id]
        return {
            "valid":self._hash(r)==r["immutable_hash"],
            "research_id":research_id,
            "immutable_hash":r["immutable_hash"]
        }

    def lineage(self,research_id):
        out=[]
        cur=research_id
        while cur:
            r=self.records.get(cur)
            if not r: break
            out.append(r)
            cur=r["parent_id"]
        return out
