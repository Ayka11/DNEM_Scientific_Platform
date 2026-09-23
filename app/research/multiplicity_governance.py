from dataclasses import dataclass, asdict
from datetime import datetime, timezone
import hashlib, json

@dataclass
class HypothesisTest:
    test_id:str
    hypothesis_id:str
    family_id:str
    role:str
    p_value:float
    alpha:float
    adjusted_alpha:float
    correction:str
    decision:str
    registered:bool
    timestamp:str
    evidence_hash:str

class MultiplicityGovernanceEngine:
    """
    Distinguishes confirmatory, secondary and exploratory tests and records
    multiplicity handling. This is a governance calculator, not a claim validator.
    """
    ROLES={"PRIMARY","SECONDARY","EXPLORATORY"}
    CORRECTIONS={"NONE","BONFERRONI","HOLM","BENJAMINI_HOCHBERG"}

    def __init__(self):
        self.tests={}

    def _hash(self,d):
        return hashlib.sha256(json.dumps(d,sort_keys=True,separators=(",",":")).encode()).hexdigest()

    def family_thresholds(self, p_values, alpha, correction):
        n=max(1,len(p_values))
        if correction=="BONFERRONI":
            return [alpha/n]*n
        if correction=="HOLM":
            ordered=sorted(enumerate(p_values),key=lambda x:x[1])
            thresholds=[None]*n
            for rank,(idx,_) in enumerate(ordered):
                thresholds[idx]=alpha/(n-rank)
            return thresholds
        if correction=="BENJAMINI_HOCHBERG":
            ordered=sorted(enumerate(p_values),key=lambda x:x[1])
            thresholds=[None]*n
            for rank,(idx,_) in enumerate(ordered,1):
                thresholds[idx]=alpha*rank/n
            return thresholds
        return [alpha]*n

    def register_family(self,family_id,tests,alpha=0.05,correction="NONE",
                        registered=True):
        if correction not in self.CORRECTIONS:
            raise ValueError("unsupported correction")
        if not tests:
            raise ValueError("family requires tests")
        pvals=[float(t["p_value"]) for t in tests]
        thresholds=self.family_thresholds(pvals,alpha,correction)
        out=[]
        for t,thr in zip(tests,thresholds):
            role=t["role"]
            if role not in self.ROLES: raise ValueError("unsupported role")
            x=HypothesisTest(
                t["test_id"],t["hypothesis_id"],family_id,role,pvals[len(out)],
                alpha,thr,correction,
                "REJECT" if pvals[len(out)]<=thr else "DO_NOT_REJECT",
                bool(registered),datetime.now(timezone.utc).isoformat(),""
            )
            d=asdict(x);d["evidence_hash"]=self._hash(d)
            self.tests[x.test_id]=d
            out.append(d)
        return out

    def summary(self,family_id):
        xs=[x for x in self.tests.values() if x["family_id"]==family_id]
        return {
            "family_id":family_id,"n_tests":len(xs),
            "roles":{r:sum(x["role"]==r for x in xs) for r in self.ROLES},
            "correction":xs[0]["correction"] if xs else None,
            "registered":all(x["registered"] for x in xs),
            "reject_count":sum(x["decision"]=="REJECT" for x in xs)
        }
