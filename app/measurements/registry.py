from typing import Dict, List

LEVELS = {
    "I": {
        "name": "Core Cognitive Assessment",
        "domains": {
            "C01":"Fluid Intelligence / Reasoning","C02":"Working Memory",
            "C03":"Processing Speed","C04":"Attention","C05":"Inhibitory Control",
            "C06":"Cognitive Flexibility","C07":"Verbal Reasoning",
            "C08":"Quantitative Reasoning","C09":"Visuospatial Intelligence",
            "C10":"Learning & Memory","C11":"Metacognition"
        }
    },
    "II": {
        "name": "Cognitive–Regulatory Assessment",
        "domains": {
            "R01":"State Regulation","R02":"Cognitive Load","R03":"Recovery / Resilience",
            "R04":"Strategy Flexibility","R05":"Calibration","R06":"Adaptation",
            "R07":"Transfer","R08":"Decision Quality","R09":"Prospective / Future Model",
            "R10":"Prediction Error / Model Updating","R11":"Accessible Capacity",
            "R12":"External Support / Scaffolding"
        }
    },
    "III": {
        "name": "Higher-Order DNEM Assessment",
        "domains": {
            "H01":"Social Cognition / Social Calibration","H02":"Agency",
            "H03":"Identity / Self-Model","H04":"Meaning / Meaning Coherence",
            "H05":"Values–Goals Alignment","H06":"Developmental Dynamics",
            "H07":"Environment / Context","H08":"Multimodal State",
            "H09":"Cross-Modal Concordance","H10":"Neural / Neurophysiological",
            "H11":"Biological / Endocrine"
        }
    }
}

def _family_ids(prefix: str) -> List[str]:
    return [f"{prefix}-{i:02d}" for i in range(1,6)]

def build_registry() -> Dict[str, dict]:
    reg = {}
    for level, spec in LEVELS.items():
        for domain_id, domain_name in spec["domains"].items():
            for mid in _family_ids(domain_id):
                reg[mid] = {
                    "measurement_id": mid,
                    "level": level,
                    "domain_id": domain_id,
                    "domain": domain_name,
                    "scientific_status": "E1" if level == "I" else ("E2" if level == "II" else "E3"),
                    "implementation_maturity": "SPECIFIED",
                    "task_family": mid,
                    "primary_outcome": "task_score",
                    "required_modalities": ["behavioral"],
                    "optional_modalities": []
                }
    return reg

REGISTRY = build_registry()

def list_measurements():
    return list(REGISTRY.values())

def get_measurement(measurement_id: str):
    return REGISTRY.get(measurement_id)
