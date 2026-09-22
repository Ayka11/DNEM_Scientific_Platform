import hashlib, json
from datetime import datetime, timezone

class SensitivityRobustnessEngine:
    """
    Registers and compares sensitivity analyses against a declared primary
    analysis. It reports stability of estimates without defining universal
    robustness thresholds.
    """
    def __init__(self):
        self.analyses={}

    def _hash(self,d):
        return hashlib.sha256(json.dumps(d,sort_keys=True,separators=(",",":")).encode()).hexdigest()

    def compare(self, primary, sensitivity):
        pe=float(primary["estimate"])
        se=float(sensitivity["estimate"])
        delta=se-pe
        denom=abs(pe) if abs(pe)>1e-12 else 1.0
        relative_change=delta/denom
        return {
            "primary_estimate":pe,
            "sensitivity_estimate":se,
            "absolute_change":delta,
            "relative_change":relative_change,
            "same_direction":(pe==0 and se==0) or (pe*se>0),
        }

    def register(self, analysis_id, primary, sensitivity_runs):
        comparisons=[]
        for run in sensitivity_runs:
            c=self.compare(primary,run)
            comparisons.append({
                "run_id":run["run_id"],
                "method":run.get("method","unspecified"),
                "comparison":c
            })
        r={
            "analysis_id":analysis_id,
            "primary":primary,
            "sensitivity_runs":sensitivity_runs,
            "comparisons":comparisons,
            "created_at":datetime.now(timezone.utc).isoformat(),
            "robustness_status":"DESCRIPTIVE",
            "evidence_hash":""
        }
        r["evidence_hash"]=self._hash(r)
        self.analyses[analysis_id]=r
        return r

    def summarize(self, analysis_id):
        r=self.analyses[analysis_id]
        cs=r["comparisons"]
        return {
            "analysis_id":analysis_id,
            "n_sensitivity_runs":len(cs),
            "same_direction_count":sum(x["comparison"]["same_direction"] for x in cs),
            "relative_changes":[x["comparison"]["relative_change"] for x in cs],
            "robustness_status":"DESCRIPTIVE"
        }

    def verify(self, analysis_id):
        r=self.analyses[analysis_id]
        core=dict(r);core["evidence_hash"]=""
        return self._hash(core)==r["evidence_hash"]
