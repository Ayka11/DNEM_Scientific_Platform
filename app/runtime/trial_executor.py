import random, time

class TrialExecutor:
    """Deterministic synthetic executor. Real stimulus adapters remain separate."""
    def __init__(self, seed=20260922):
        self.rng = random.Random(seed)

    def execute(self, measurement_id, trial_index, difficulty=1):
        correct = int(self.rng.random() >= 0.30)
        rt_ms = round(450 + self.rng.random() * 900 / max(difficulty, 1), 2)
        return {
            "trial_id": f"{measurement_id}_T{trial_index:04d}",
            "measurement_id": measurement_id,
            "stimulus_id": f"synthetic_{trial_index:04d}",
            "stimulus_parameters": {"difficulty": difficulty},
            "stimulus_onset": time.time(),
            "stimulus_offset": time.time(),
            "response": "synthetic_response",
            "response_time": rt_ms,
            "correct": correct,
            "valid": True,
            "exclusion_reason": None
        }
