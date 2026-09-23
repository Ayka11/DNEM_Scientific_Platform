from collections import defaultdict
from app.measurements.specification_registry import get_specification
from app.analysis.domain_results_engine import DomainResultsEngine

class ResultsPipeline:
    def __init__(self):
        self.domain_engine = DomainResultsEngine({})

    def aggregate_trials(self, trials):
        by_measurement = defaultdict(list)
        for t in trials:
            if t.get("valid"):
                by_measurement[t["measurement_id"]].append(t)
        results = []
        for mid, rows in by_measurement.items():
            spec = get_specification(mid)
            accuracy = sum(x["correct"] for x in rows) / len(rows)
            mean_rt = sum(x["response_time"] for x in rows) / len(rows)
            results.append({
                "measurement_id": mid,
                "domain_id": spec["domain"],
                "domain_code": spec["domain"],
                "level": spec["level"],
                "scientific_status": spec["scientific_status"],
                "n_valid_trials": len(rows),
                "raw_measure": {
                    "correct": [x["correct"] for x in rows],
                    "response_time_ms": [x["response_time"] for x in rows]
                },
                "derived_measure": {"accuracy": accuracy, "mean_rt_ms": mean_rt},
                "task_score": accuracy,
                "construct_estimate": None
            })
        return results

    def build_domain_profile(self, measurement_results):
        return self.domain_engine.build_profile(measurement_results, {})
