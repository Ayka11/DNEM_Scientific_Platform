"""
DNEM Scientific Decision Ledger v1.0
Append-only, hash-linked governance records for scientific decisions.
"""
from __future__ import annotations
import json, sqlite3
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from hashlib import sha256
from pathlib import Path
from typing import Any, Dict, List, Optional


@dataclass
class DecisionRecord:
    decision_id: str
    analysis_id: str
    claim_id: str
    decision: str
    readiness: str
    evidence_state: str
    claim_state: str
    blockers: List[str]
    warnings: List[str]
    previous_hash: str
    record_hash: str
    timestamp: str
    version: str = "1.0"


class ScientificDecisionLedger:
    VERSION="1.0"
    def __init__(self, db_path: str="dnem_scientific_ledger.sqlite"):
        self.db_path=Path(db_path)
        self._init()

    def _conn(self):
        return sqlite3.connect(str(self.db_path))

    def _init(self):
        with self._conn() as c:
            c.execute("""CREATE TABLE IF NOT EXISTS decision_ledger(
              seq INTEGER PRIMARY KEY AUTOINCREMENT,
              decision_id TEXT UNIQUE NOT NULL,
              analysis_id TEXT NOT NULL,
              claim_id TEXT NOT NULL,
              decision TEXT NOT NULL,
              readiness TEXT NOT NULL,
              evidence_state TEXT NOT NULL,
              claim_state TEXT NOT NULL,
              blockers_json TEXT NOT NULL,
              warnings_json TEXT NOT NULL,
              previous_hash TEXT NOT NULL,
              record_hash TEXT UNIQUE NOT NULL,
              timestamp TEXT NOT NULL,
              version TEXT NOT NULL
            )""")
            c.commit()

    def append(self, pipeline_result: Dict[str,Any]) -> Dict[str,Any]:
        analysis_id=pipeline_result["analysis_id"]
        claim_id=pipeline_result["claim_id"]
        decision_id=self._next_id()
        previous=self.latest_hash() or "GENESIS"
        ts=datetime.now(timezone.utc).isoformat()
        core={
          "decision_id":decision_id,
          "analysis_id":analysis_id,
          "claim_id":claim_id,
          "decision":pipeline_result["decision"],
          "readiness":pipeline_result["source_states"]["integrity_readiness"],
          "evidence_state":pipeline_result["source_states"]["evidence_graph"],
          "claim_state":pipeline_result["source_states"]["claim_governance"],
          "blockers":pipeline_result.get("blockers",[]),
          "warnings":pipeline_result.get("warnings",[]),
          "previous_hash":previous,
          "timestamp":ts,
          "version":self.VERSION
        }
        rh=sha256(json.dumps(core,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()
        rec={**core,"record_hash":rh}
        with self._conn() as c:
            c.execute("""INSERT INTO decision_ledger
            (decision_id,analysis_id,claim_id,decision,readiness,evidence_state,claim_state,
             blockers_json,warnings_json,previous_hash,record_hash,timestamp,version)
             VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)""",
             (decision_id,analysis_id,claim_id,core["decision"],core["readiness"],
              core["evidence_state"],core["claim_state"],json.dumps(core["blockers"]),
              json.dumps(core["warnings"]),previous,rh,ts,self.VERSION))
            c.commit()
        return rec

    def _next_id(self):
        with self._conn() as c:
            row=c.execute("SELECT seq FROM decision_ledger ORDER BY seq DESC LIMIT 1").fetchone()
        return f"DEC-{(row[0]+1 if row else 1):06d}"

    def latest_hash(self)->Optional[str]:
        with self._conn() as c:
            row=c.execute("SELECT record_hash FROM decision_ledger ORDER BY seq DESC LIMIT 1").fetchone()
        return row[0] if row else None

    def list_records(self)->List[Dict[str,Any]]:
        with self._conn() as c:
            rows=c.execute("""SELECT decision_id,analysis_id,claim_id,decision,readiness,
              evidence_state,claim_state,blockers_json,warnings_json,previous_hash,
              record_hash,timestamp,version FROM decision_ledger ORDER BY seq""").fetchall()
        keys=["decision_id","analysis_id","claim_id","decision","readiness","evidence_state",
              "claim_state","blockers","warnings","previous_hash","record_hash","timestamp","version"]
        out=[]
        for row in rows:
            d=dict(zip(keys,row))
            d["blockers"]=json.loads(d["blockers"]); d["warnings"]=json.loads(d["warnings"])
            out.append(d)
        return out

    def verify(self)->Dict[str,Any]:
        records=self.list_records()
        prev="GENESIS"
        errors=[]
        for r in records:
            if r["previous_hash"]!=prev:
                errors.append(f"{r['decision_id']}: previous_hash mismatch")
            core={k:r[k] for k in [
                "decision_id","analysis_id","claim_id","decision","readiness",
                "evidence_state","claim_state","blockers","warnings","previous_hash",
                "timestamp","version"]}
            expected=sha256(json.dumps(core,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()
            if expected!=r["record_hash"]:
                errors.append(f"{r['decision_id']}: record_hash mismatch")
            prev=r["record_hash"]
        return {"valid":not errors,"records":len(records),"errors":errors,
                "head_hash":prev if records else "GENESIS","version":self.VERSION}
