from app.validation.psychometrics_engine import PsychometricValidationEngine
from app.validation.replication_engine import ReplicationGeneralizationEngine
from app.validation.invariance_engine import InvarianceEngine
from app.validation.gate_engine import ValidationGateEngine

class ScientificValidationOrchestrator:
    """
    Coordinates statistical evidence production and gate evaluation.

    Status semantics:
      BLOCKED      = mandatory evidence is absent or gates fail
      CONDITIONAL  = evidence is partially present; no validated promotion
      VALIDATED    = all configured mandatory gates explicitly pass

    The orchestrator does not invent evidence and does not infer causality.
    """

    def __init__(self):
        self.psychometrics=PsychometricValidationEngine()
        self.replication=ReplicationGeneralizationEngine()
        self.invariance=InvarianceEngine()
        self.gates=ValidationGateEngine()

    def compute_evidence(self, dataset):
        evidence={}

        if any(k in dataset for k in ("items","time1","time2","measure","criterion",
                                      "group_a","group_b")):
            evidence.update(self.psychometrics.build_evidence(dataset))

        if any(k in dataset for k in ("original","replications","reference","validation")):
            evidence.update(self.replication.build_evidence(dataset))

        if "groups" in dataset:
            evidence["invariance"]=self.invariance.build_evidence(
                dataset["groups"]
            )

        return evidence

    def classify(self, gate_result, evidence):
        passed=sum(1 for g in gate_result["gates"] if g["passed"])
        total=len(gate_result["gates"])

        if passed == total and total > 0:
            status="VALIDATED"
        elif passed > 0:
            status="CONDITIONAL"
        else:
            status="BLOCKED"

        return {
            "status":status,
            "gates_passed":passed,
            "gates_total":total,
            "promotion_allowed":status=="VALIDATED",
            "scientific_claim_permission":
                "validated-claim" if status=="VALIDATED" else "no-validated-claim",
            "evidence":evidence,
            "gate_result":gate_result
        }

    def run(self, dataset=None, explicit_evidence=None):
        dataset=dataset or {}
        computed=self.compute_evidence(dataset)
        if explicit_evidence:
            computed.update(explicit_evidence)

        gate_result=self.gates.evaluate(computed)
        return self.classify(gate_result, computed)
