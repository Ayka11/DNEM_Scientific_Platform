class ResultsService:
    def demo_result(self, session_id, measurement_id, seed=20260922):
        import random
        rng = random.Random(seed)
        raw = [rng.randint(0,1) for _ in range(20)]
        score = sum(raw) / len(raw)
        return {
            "session_id": session_id,
            "measurement_id": measurement_id,
            "raw_measure": {"accuracy_trials": raw},
            "derived_measure": {"accuracy": score},
            "task_score": score,
            "construct_estimate": None,
            "scientific_status": "DEMO_ONLY"
        }
