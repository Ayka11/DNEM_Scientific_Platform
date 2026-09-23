STATES = [
    "LOAD_STUDY","VALIDATE_CONFIGURATION","READY","BASELINE","INSTRUCTION",
    "PRACTICE","TASK","BREAK","RECOVERY","SESSION_QC","COMPLETE","LOCK","ABORTED"
]
TRANSITIONS = {
    "LOAD_STUDY":"VALIDATE_CONFIGURATION",
    "VALIDATE_CONFIGURATION":"READY",
    "READY":"BASELINE",
    "BASELINE":"INSTRUCTION",
    "INSTRUCTION":"PRACTICE",
    "PRACTICE":"TASK",
    "TASK":"BREAK",
    "BREAK":"RECOVERY",
    "RECOVERY":"SESSION_QC",
    "SESSION_QC":"COMPLETE",
    "COMPLETE":"LOCK"
}

class RuntimeStateMachine:
    def __init__(self):
        self.state = "LOAD_STUDY"

    def advance(self):
        if self.state == "ABORTED":
            raise RuntimeError("Session is aborted")
        if self.state == "LOCK":
            return self.state
        self.state = TRANSITIONS[self.state]
        return self.state

    def abort(self, reason="unspecified"):
        self.state = "ABORTED"
        return {"state": self.state, "reason": reason}
