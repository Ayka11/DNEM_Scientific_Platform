import random
from app.domain.models import Session, new_id
from app.runtime.state_machine import RuntimeStateMachine
from app.runtime.event_bus import EventBus

class RuntimeService:
    def __init__(self):
        self.sessions = {}

    def start(self, study_id, participant_id, seed=20260922):
        s = Session(new_id("session"), study_id, participant_id)
        s.runtime = RuntimeStateMachine()
        s.bus = EventBus()
        self.sessions[s.session_id] = s
        random.seed(seed)
        s.bus.publish("SESSION_STARTED", {"session_id": s.session_id})
        return s

    def run_demo(self, session_id):
        s = self.sessions[session_id]
        while s.runtime.state != "LOCK":
            state = s.runtime.advance()
            s.bus.publish(f"STATE_{state}", {"state": state})
        s.bus.publish("SESSION_COMPLETED", {"session_id": session_id})
        return s


    def generate_demo_trials(self, session_id, measurement_id="C01-01", n=20, seed=20260922):
        """Generate deterministic runtime-shaped trials for pipeline integration tests only."""
        import random
        rng=random.Random(seed)
        return [{
            "study_id":self.sessions[session_id].study_id,
            "participant_id":self.sessions[session_id].participant_id,
            "session_id":session_id,
            "task_id":measurement_id,
            "measurement_id":measurement_id,
            "configuration_id":"DEMO",
            "block_id":"B1",
            "trial_id":f"T{i+1}",
            "stimulus_id":f"S{i+1}",
            "stimulus_parameters":{},
            "difficulty":1,
            "rule_family":"DEMO",
            "stimulus_onset":float(i*1000),
            "stimulus_offset":float(i*1000+500),
            "response":"A" if rng.random()>.5 else "B",
            "response_time":float(450+rng.randint(0,300)),
            "correct":int(rng.random()>.3),
            "valid":True,
            "exclusion_reason":None
        } for i in range(n)]
