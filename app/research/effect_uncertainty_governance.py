import hashlib, json
from datetime import datetime, timezone
from statistics import mean, stdev

class EffectUncertaintyEngine:
    """
    Effect-size and uncertainty layer. It reports magnitude and intervals but
    does not decide scientific importance or causal validity.
    """
    def _hash(self,d):
        return hashlib.sha256(json.dumps(d,sort_keys=True,separators=(",",":")).encode()).hexdigest()

    def mean_difference(self, a, b):
        if not a or not b: raise ValueError("groups must be non-empty")
        ma,mb=mean(a),mean(b)
        effect=ma-mb
        # Simple large-sample normal approximation for demonstration/runtime.
        se=((stdev(a)**2/len(a) if len(a)>1 else 0)+
            (stdev(b)**2/len(b) if len(b)>1 else 0))**0.5
        margin=1.96*se
        return {
            "effect":effect,
            "standard_error":se,
            "ci_95":[effect-margin,effect+margin],
            "effect_type":"raw_mean_difference",
            "uncertainty_method":"normal_approximation_95CI"
        }

    def standardized_mean_difference(self,a,b):
        if len(a)<2 or len(b)<2: raise ValueError("at least 2 observations/group")
        ma,mb=mean(a),mean(b)
        pooled=((len(a)-1)*stdev(a)**2+(len(b)-1)*stdev(b)**2) / (len(a)+len(b)-2)
        sp=pooled**0.5
        if sp==0: raise ValueError("pooled SD is zero")
        d=(ma-mb)/sp
        return {"effect":d,"effect_type":"cohens_d","pooled_sd":sp}

    def record(self, analysis_id, estimate, interpretation_status="DESCRIPTIVE"):
        r={
            "analysis_id":analysis_id,
            "estimate":estimate,
            "interpretation_status":interpretation_status,
            "created_at":datetime.now(timezone.utc).isoformat(),
            "effect_evidence_hash":""
        }
        r["effect_evidence_hash"]=self._hash(r)
        return r

    def verify(self, record):
        core=dict(record);core["effect_evidence_hash"]=""
        return self._hash(core)==record["effect_evidence_hash"]
