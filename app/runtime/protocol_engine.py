from app.runtime.trial_executor import TrialExecutor
from app.measurements.specification_registry import get_specification

class ProtocolEngine:
    def __init__(self, seed=20260922):
        self.seed = seed

    def compile(self, measurement_ids, trials_per_measurement=10):
        tasks = []
        for mid in measurement_ids:
            spec = get_specification(mid)
            if not spec:
                raise ValueError(f"Unknown measurement specification: {mid}")
            if trials_per_measurement < spec["qc"]["minimum_trials"]:
                raise ValueError(
                    f"{mid}: trials_per_measurement must be >= "
                    f'{spec["qc"]["minimum_trials"]}'
                )
            tasks.append({
                "measurement_id": mid,
                "task_name": spec["task_name"],
                "configuration": spec["study_builder_schema"],
                "qc": spec["qc"],
                "scoring": spec["scoring"],
                "trials": trials_per_measurement
            })
        return {
            "version": "runtime-v1.0",
            "measurements": tasks,
            "deterministic": True,
            "seed": self.seed
        }

    def execute(self, protocol):
        executor = TrialExecutor(protocol["seed"])
        rows = []
        for m in protocol["measurements"]:
            for i in range(1, m["trials"] + 1):
                rows.append(
                    executor.execute(
                        m["measurement_id"], i,
                        difficulty=m["configuration"].get("difficulty", 1)
                    )
                )
        return rows
