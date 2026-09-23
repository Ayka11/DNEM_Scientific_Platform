from collections import defaultdict
from app.validation.gate_engine import ValidationGateEngine

class DomainResultsEngine:
    def __init__(self, specifications):
        self.specifications=specifications
        self.validation=ValidationGateEngine()

    def aggregate_domain(self, measurement_results, domain_id, validation_evidence=None):
        rows=[r for r in measurement_results if r.get("domain_id")==domain_id]
        if not rows:
            return {"domain_id":domain_id,"status":"NO_DATA","gates":[]}
        scores=[r["task_score"] for r in rows if r.get("task_score") is not None]
        val=self.validation.evaluate(validation_evidence)
        decision=self.validation.promotion_decision(val)
        coverage={"name":"minimum_paradigm_coverage","passed":len(rows)>=1,
                  "status":"PASS" if rows else "BLOCKED",
                  "reason":f"{len(rows)} paradigm result(s) available"}
        return {
            "domain_id":domain_id,
            "status":decision["domain_result_status"],
            "task_summary":{
                "n_paradigms":len(rows),
                "mean_task_score":sum(scores)/len(scores) if scores else None,
                "task_scores":scores},
            "construct_estimate":(
                sum(scores)/len(scores)
                if decision["construct_estimate_status"]=="ESTIMATED" else None),
            "construct_estimate_status":decision["construct_estimate_status"],
            "validation":val,
            "gates":[coverage]+val["gates"]
        }

    def build_profile(self, measurement_results, domain_map=None, validation_by_domain=None):
        grouped=defaultdict(list)
        for r in measurement_results:
            if r.get("domain_id"): grouped[r["domain_id"]].append(r)
        validation_by_domain=validation_by_domain or {}
        domains=[
            self.aggregate_domain(rows,d,validation_by_domain.get(d))
            for d,rows in sorted(grouped.items())
        ]
        return {
            "profile_type":"DNEM_INTEGRATED_PROFILE",
            "status":"VALIDATED_PROFILE" if domains and all(
                d["status"]=="VALIDATED_DOMAIN_RESULT" for d in domains)
                else "TASK_LEVEL_PROFILE",
            "domains":domains,
            "integrated_construct_score":None,
            "scientific_interpretation":"deferred_until_profile_validation"
        }
