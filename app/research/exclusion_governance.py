from dataclasses import dataclass, asdict
from datetime import datetime, timezone
import hashlib, json

@dataclass
class ExclusionDecision:
    decision_id:str
    subject_id:str
    unit_type:str
    rule_id:str
    rule_source:str
    reason:str
    stage:str
    decision:str
    timestamp:str
    evidence_hash:str
    pre_registered:bool
    amendment_id:str=""

class ExclusionGovernanceEngine:
    """
    Controls participant/trial exclusions and missing-data decisions.
    Pre-registered rules are distinguished from post-hoc decisions.
    """
    def __init__(self):
        self.rules={}
        self.decisions={}

    def _hash(self,d):
        return hashlib.sha256(json.dumps(d,sort_keys=True,separators=(",",":")).encode()).hexdigest()

    def register_rule(self, rule_id, description, source="PREREGISTERED",
                      criteria=None, allowed=True):
        if rule_id in self.rules:
            raise ValueError("rule already exists")
        self.rules[rule_id]={
            "rule_id":rule_id,"description":description,"source":source,
            "criteria":criteria or {},"allowed":bool(allowed)
        }
        return dict(self.rules[rule_id])

    def decide(self, decision_id, subject_id, unit_type, rule_id, reason,
               stage="PRE_ANALYSIS", decision="EXCLUDE", amendment_id=""):
        if rule_id not in self.rules:
            raise ValueError("unknown exclusion rule")
        rule=self.rules[rule_id]
        source=rule["source"]
        pre_registered=source=="PREREGISTERED"
        if source=="AMENDED" and not amendment_id:
            raise ValueError("amended rule requires amendment_id")
        evidence={"rule":rule,"subject_id":subject_id,"reason":reason,
                  "stage":stage,"decision":decision}
        d=ExclusionDecision(
            decision_id,subject_id,unit_type,rule_id,source,reason,stage,decision,
            datetime.now(timezone.utc).isoformat(),self._hash(evidence),
            pre_registered,amendment_id
        )
        self.decisions[decision_id]=asdict(d)
        return dict(self.decisions[decision_id])

    def classify_missingness(self, observations):
        total=len(observations)
        missing=sum(1 for x in observations if x is None)
        rate=missing/total if total else 0.0
        return {
            "n":total,"missing_n":missing,"missing_rate":rate,
            "pattern":"NO_MISSING" if missing==0 else "MISSING_PRESENT"
        }

    def audit_summary(self):
        vals=list(self.decisions.values())
        return {
            "total_decisions":len(vals),
            "pre_registered":sum(x["pre_registered"] for x in vals),
            "post_hoc":sum(not x["pre_registered"] for x in vals),
            "excluded":sum(x["decision"]=="EXCLUDE" for x in vals)
        }
