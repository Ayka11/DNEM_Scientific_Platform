from dataclasses import dataclass, asdict

@dataclass
class ValidationGate:
    gate_id: str
    name: str
    required: bool
    passed: bool
    status: str
    evidence_refs: list
    reason: str

class ValidationGateEngine:
    REQUIRED_GATES = (
        ("G01","reliability"),("G02","construct_validity"),
        ("G03","stability"),("G04","invariance"),
        ("G05","replication"),("G06","generalization")
    )

    def evaluate(self, evidence=None):
        evidence = evidence or {}
        gates=[]
        for gate_id,name in self.REQUIRED_GATES:
            item=evidence.get(name,{})
            passed=bool(item.get("passed",False))
            gates.append(ValidationGate(
                gate_id,name,True,passed,"PASS" if passed else "BLOCKED",
                list(item.get("evidence_refs",[])),
                item.get("reason","No qualifying evidence supplied.")
            ))
        return {
            "status":"VALIDATED" if all(g.passed for g in gates) else "BLOCKED",
            "promotion_allowed":all(g.passed for g in gates),
            "gates":[asdict(g) for g in gates],
            "blocking_gates":[g.name for g in gates if not g.passed]
        }

    def promotion_decision(self, validation_result):
        if validation_result.get("promotion_allowed"):
            return {
                "construct_estimate_status":"ESTIMATED",
                "domain_result_status":"VALIDATED_DOMAIN_RESULT"
            }
        return {
            "construct_estimate_status":"NULL",
            "domain_result_status":"TASK_LEVEL_AGGREGATE_ONLY"
        }
