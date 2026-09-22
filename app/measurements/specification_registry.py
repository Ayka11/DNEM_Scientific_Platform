import json
from pathlib import Path

SPEC_PATH = Path(__file__).with_name("operational_specifications_170.json")
SPECIFICATIONS = json.loads(SPEC_PATH.read_text(encoding="utf-8"))

ALIASES = {}
_pairs = {
    "FI":"C01","WM":"C02","PS":"C03","AT":"C04","IC":"C05","CF":"C06",
    "VR":"C07","QR":"C08","VS":"C09","LM":"C10","MC":"C11",
    "SR":"R01","CL":"R02","RC":"R03","SF":"R04","CA":"R05","AD":"R06",
    "TR":"R07","DQ":"R08","PF":"R09","PE":"R10","AC":"R11","ES":"R12",
    "SC":"H01","AG":"H02","ID":"H03","ME":"H04","VG":"H05","DD":"H06",
    "EC":"H07","MS":"H08","CC":"H09","NP":"H10","BE":"H11"
}
for short, canonical in _pairs.items():
    for i in range(1,6):
        ALIASES[f"{short}-{i:02d}"] = f"{canonical}-{i:02d}"

def get_specification(measurement_id):
    return SPECIFICATIONS.get(measurement_id)

def list_specifications():
    # Canonical 170 only.
    return [v for k,v in SPECIFICATIONS.items()
            if k not in ALIASES]

def validate_specification(measurement_id):
    spec = get_specification(measurement_id)
    if not spec:
        return False, ["unknown_measurement"]
    required = [
        "measurement_id","level","domain","construct","paradigm",
        "task_family","scientific_status","raw_measures","derived_measures",
        "scoring","qc","trial_schema","result_schema"
    ]
    errors=[k for k in required if k not in spec]
    return len(errors)==0, errors
