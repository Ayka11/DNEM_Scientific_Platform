"""
DNEM Research Cycle Successor Executor v1.0

Turns a Model Revision successor descriptor into a new registered research
cycle. The executor never copies prior trial/results as new evidence and never
runs an experiment automatically.
"""
from __future__ import annotations
from typing import Any, Dict, Optional
from hashlib import sha256
from datetime import datetime, timezone
import json, time, uuid

from app.services.persistence import Persistence
from app.governance.model_revision_lineage_engine import ModelRevisionLineageEngine

class ResearchCycleSuccessorExecutor:
    VERSION = "1.0"

    def __init__(self, db_path="data/dnem.sqlite3", ledger_path="dnem_scientific_ledger.sqlite"):
        self.persistence = Persistence(db_path)
        self.revisions = ModelRevisionLineageEngine(db_path, ledger_path)
        self._init_schema()

    @staticmethod
    def _hash(value: Any) -> str:
        return sha256(json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()).hexdigest()

    def _init_schema(self):
        self.persistence.conn.executescript("""
        CREATE TABLE IF NOT EXISTS research_cycle_registrations(
          cycle_id TEXT PRIMARY KEY,
          successor_of_revision_id TEXT NOT NULL,
          parent_cycle_id TEXT,
          model_id TEXT NOT NULL,
          parent_model_id TEXT,
          dataset_id TEXT,
          source_analysis_id TEXT NOT NULL,
          source_claim_id TEXT NOT NULL,
          protocol_version TEXT NOT NULL,
          cycle_hash TEXT NOT NULL,
          status TEXT NOT NULL,
          payload TEXT NOT NULL,
          created_at REAL NOT NULL
        );
        """)
        self.persistence.conn.commit()

    def create(self, request: Dict[str, Any]) -> Dict[str, Any]:
        revision_id = request["revision_id"]
        protocol_version = str(request.get("protocol_version", "")).strip()
        if not protocol_version:
            raise ValueError("protocol_version_required")

        revision = self.revisions.get(revision_id)
        if not revision:
            raise ValueError("revision_not_found")

        verification = self.revisions.verify(revision_id)
        if not verification["valid"]:
            raise ValueError("revision_integrity_failed")

        # The new cycle must declare a new data acquisition/registration plan.
        new_dataset_id = request.get("new_dataset_id")
        if new_dataset_id and new_dataset_id == revision["dataset_id"]:
            raise ValueError("new_dataset_must_not_reuse_source_dataset")

        new_protocol_id = request.get("new_protocol_id")
        if not new_protocol_id:
            raise ValueError("new_protocol_id_required")

        cycle_id = "CYCLE-" + self._hash({
            "revision_id": revision_id,
            "new_protocol_id": new_protocol_id,
            "protocol_version": protocol_version,
            "new_dataset_id": new_dataset_id,
            "nonce": request.get("cycle_nonce", "")
        })[:12].upper()

        existing = self.persistence.conn.execute(
            "SELECT payload FROM research_cycle_registrations WHERE cycle_id=?", (cycle_id,)
        ).fetchone()
        if existing:
            return json.loads(existing["payload"])

        now = datetime.now(timezone.utc).isoformat()
        payload_core = {
            "cycle_id": cycle_id,
            "successor_of_revision_id": revision_id,
            "parent_cycle_id": request.get("parent_cycle_id") or revision.get("parent_cycle_id"),
            "model_id": revision["model_id"],
            "parent_model_id": revision.get("parent_model_id"),
            "source_dataset_id": revision["dataset_id"],
            "new_dataset_id": new_dataset_id,
            "source_analysis_id": revision["analysis_id"],
            "source_claim_id": revision["claim_id"],
            "source_graph_hash": revision["graph_hash"],
            "source_snapshot_hash": revision["snapshot_hash"],
            "source_decision": revision["decision"],
            "new_protocol_id": new_protocol_id,
            "protocol_version": protocol_version,
            "registered_at": now,
            "executor_version": self.VERSION,
        }
        cycle_hash = self._hash(payload_core)

        payload = {
            **payload_core,
            "cycle_hash": cycle_hash,
            "status": "REGISTERED_AWAITING_NEW_DATA",
            "execution_state": "NOT_EXECUTED",
            "required_inputs": {
                "new_protocol": True,
                "new_dataset": True,
                "new_trials": True,
                "independent_analysis": True,
                "new_evidence_registration": True,
            },
            "scientific_boundary": {
                "prior_trials_reused_as_new_data": False,
                "prior_results_reused_as_new_results": False,
                "new_experiment_executed": False,
                "validated_status_issued": False,
                "causal_inference_issued": False,
            },
        }

        self.persistence.conn.execute(
            """INSERT INTO research_cycle_registrations(
              cycle_id,successor_of_revision_id,parent_cycle_id,model_id,parent_model_id,
              dataset_id,source_analysis_id,source_claim_id,protocol_version,cycle_hash,
              status,payload,created_at)
              VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (cycle_id, revision_id, payload["parent_cycle_id"], payload["model_id"],
             payload["parent_model_id"], new_dataset_id, payload["source_analysis_id"],
             payload["source_claim_id"], protocol_version, cycle_hash,
             payload["status"], json.dumps(payload, ensure_ascii=False, sort_keys=True),
             time.time())
        )
        self.persistence.conn.commit()
        return payload

    def get(self, cycle_id: str) -> Optional[Dict[str, Any]]:
        row = self.persistence.conn.execute(
            "SELECT payload FROM research_cycle_registrations WHERE cycle_id=?", (cycle_id,)
        ).fetchone()
        return json.loads(row["payload"]) if row else None

    def verify(self, cycle_id: str) -> Dict[str, Any]:
        payload = self.get(cycle_id)
        if not payload:
            raise ValueError("cycle_not_found")
        core = {k: payload[k] for k in [
            "cycle_id","successor_of_revision_id","parent_cycle_id","model_id",
            "parent_model_id","source_dataset_id","new_dataset_id",
            "source_analysis_id","source_claim_id","source_graph_hash",
            "source_snapshot_hash","source_decision","new_protocol_id",
            "protocol_version","registered_at","executor_version"
        ]}
        computed = self._hash(core)
        return {
            "cycle_id": cycle_id,
            "valid": computed == payload["cycle_hash"],
            "stored_hash": payload["cycle_hash"],
            "computed_hash": computed,
            "status": payload["status"],
        }
