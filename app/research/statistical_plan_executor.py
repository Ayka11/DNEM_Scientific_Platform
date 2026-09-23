from datetime import datetime, timezone
import hashlib, json

class StatisticalPlanExecutor:
    """
    Compares declared/pre-registered analysis plan with executed analysis metadata.
    It records deviations rather than silently treating them as planned analyses.
    """
    def __init__(self):
        self.executions={}

    def _hash(self,d):
        return hashlib.sha256(json.dumps(d,sort_keys=True,separators=(",",":")).encode()).hexdigest()

    def compare(self, plan, execution):
        deviations=[]
        keys=["primary_test","secondary_tests","alpha","effect_measure",
              "missing_data_method","exclusion_rule_ids"]
        for k in keys:
            planned=plan.get(k)
            actual=execution.get(k)
            if planned is not None and planned!=actual:
                deviations.append({
                    "field":k,"planned":planned,"executed":actual,
                    "type":"PLAN_DEVIATION"
                })
        status="CONFORMANT" if not deviations else "DEVIATION"
        return {"status":status,"deviations":deviations}

    def execute(self, analysis_id, plan, execution):
        comparison=self.compare(plan,execution)
        record={
            "analysis_id":analysis_id,
            "status":comparison["status"],
            "plan":plan,
            "execution":execution,
            "deviations":comparison["deviations"],
            "executed_at":datetime.now(timezone.utc).isoformat(),
            "execution_hash":""
        }
        record["execution_hash"]=self._hash(record)
        self.executions[analysis_id]=record
        return record

    def verify(self, analysis_id):
        r=self.executions[analysis_id]
        core=dict(r);core["execution_hash"]=""
        expected=self._hash(core)
        return {"valid":expected==r["execution_hash"],
                "analysis_id":analysis_id,
                "status":r["status"]}

    def classify_deviation(self, deviation, amendment_id=""):
        if deviation.get("type")!="PLAN_DEVIATION":
            return "UNCLASSIFIED"
        return "PRE_APPROVED_AMENDMENT" if amendment_id else "UNREGISTERED_DEVIATION"
