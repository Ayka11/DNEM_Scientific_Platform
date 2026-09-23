"""
DNEM Model Revision Lineage Engine v2.0

Persists explicit model revisions and binds them to a verified scientific
research cycle. A revision creates a successor-cycle descriptor only; it does
not execute a new experiment and never synthesizes VALIDATED status.
"""
from __future__ import annotations
from typing import Any, Dict, List, Optional
from datetime import datetime, timezone
from hashlib import sha256
import json
from app.services.persistence import Persistence
from app.research.analysis_provenance import AnalysisProvenance
from app.governance.scientific_audit_snapshot import ScientificAuditSnapshot
from app.evidence.evidence_claim_graph_integration import EvidenceClaimGraphIntegration
from app.governance.scientific_decision_ledger import ScientificDecisionLedger

class ModelRevisionLineageEngine:
    VERSION = "2.0"

    def __init__(self, db_path="data/dnem.sqlite3", ledger_path="dnem_scientific_ledger.sqlite"):
        self.persistence = Persistence(db_path)
        self.analysis = AnalysisProvenance(db_path)
        self.audit = ScientificAuditSnapshot(db_path, ledger_path)
        self.graph = EvidenceClaimGraphIntegration(db_path)
        self.ledger = ScientificDecisionLedger(ledger_path)
        self._init_schema()

    def _init_schema(self):
        self.persistence.conn.executescript("""
        CREATE TABLE IF NOT EXISTS model_revisions(
          revision_id TEXT PRIMARY KEY,
          model_id TEXT NOT NULL,
          parent_model_id TEXT,
          analysis_id TEXT NOT NULL,
          claim_id TEXT NOT NULL,
          dataset_id TEXT NOT NULL,
          analysis_hash TEXT NOT NULL,
          dataset_hash TEXT NOT NULL,
          graph_hash TEXT NOT NULL,
          snapshot_hash TEXT NOT NULL,
          decision TEXT NOT NULL,
          ledger_head_hash TEXT,
          revision_hash TEXT NOT NULL,
          payload TEXT NOT NULL,
          created_at REAL NOT NULL
        );
        CREATE TABLE IF NOT EXISTS research_cycle_successors(
          successor_cycle_id TEXT PRIMARY KEY,
          revision_id TEXT NOT NULL,
          parent_cycle_id TEXT,
          model_id TEXT NOT NULL,
          dataset_id TEXT NOT NULL,
          source_analysis_id TEXT NOT NULL,
          source_claim_id TEXT NOT NULL,
          status TEXT NOT NULL,
          payload TEXT NOT NULL,
          created_at REAL NOT NULL
        );
        """)
        self.persistence.conn.commit()

    @staticmethod
    def _hash(x: Any) -> str:
        return sha256(json.dumps(x, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()).hexdigest()

    def create(self, request: Dict[str, Any]) -> Dict[str, Any]:
        dataset_id = request["dataset_id"]
        analysis_id = request["analysis_id"]
        claim_id = request["claim_id"]
        model_id = request["model_id"]
        parent_model_id = request.get("parent_model_id")
        reason = str(request.get("revision_reason", "")).strip()
        changes = request.get("changes") or []
        parent_cycle_id = request.get("parent_cycle_id")

        if not reason:
            raise ValueError("revision_reason is required")
        if not changes:
            raise ValueError("at least_one_model_change_required")

        manifest = self.persistence.get_dataset_manifest(dataset_id)
        if not manifest:
            raise ValueError("dataset_not_found")

        analysis = self.analysis.get(analysis_id)
        if not analysis:
            raise ValueError("analysis_not_found")
        if analysis["dataset_id"] != dataset_id:
            raise ValueError("dataset_analysis_mismatch")
        if not self.analysis.verify(analysis_id).get("valid"):
            raise ValueError("analysis_integrity_failed")

        snapshot = self.audit.build(dataset_id, analysis_id, claim_id)
        if snapshot["reproducibility_status"] != "INTEGRITY_VERIFIED":
            raise ValueError("audit_snapshot_integrity_failed")

        graph = self.graph.build(analysis_id, claim_id)
        decision = request.get("decision") or {}
        decision_type = str(decision.get("decision", "")).upper()

        # Conservative governance: a BLOCKED decision cannot be used as the
        # scientific basis for a model revision. Other decision states are
        # recorded as provenance, not as validation.
        if decision_type == "BLOCKED":
            raise ValueError("blocked_decision_cannot_create_model_revision")

        supplied_graph_hash = request.get("graph_hash")
        if supplied_graph_hash and supplied_graph_hash != graph["graph_hash"]:
            raise ValueError("evidence_graph_mismatch")

        ledger = self.ledger.verify()
        if not ledger.get("valid"):
            raise ValueError("decision_ledger_integrity_failed")

        evidence_refs = [n["node_id"] for n in graph["nodes"] if n["node_type"] == "Evidence"]
        now = datetime.now(timezone.utc).isoformat()

        revision_core = {
            "model_id": model_id,
            "parent_model_id": parent_model_id,
            "analysis_id": analysis_id,
            "claim_id": claim_id,
            "dataset_id": dataset_id,
            "analysis_hash": analysis["analysis_hash"],
            "dataset_hash": manifest["dataset_hash"],
            "graph_hash": graph["graph_hash"],
            "snapshot_hash": snapshot["snapshot_hash"],
            "decision": decision_type,
            "ledger_head_hash": ledger.get("head_hash"),
            "evidence_refs": evidence_refs,
            "revision_reason": reason,
            "changes": changes,
            "parent_cycle_id": parent_cycle_id,
            "created_at": now,
            "version": self.VERSION,
        }
        revision_hash = self._hash(revision_core)
        revision_id = "REV-" + revision_hash[:12].upper()

        existing = self.persistence.conn.execute(
            "SELECT payload FROM model_revisions WHERE revision_id=?", (revision_id,)
        ).fetchone()
        if existing:
            return json.loads(existing["payload"])

        successor_id = "CYCLE-" + self._hash({
            "revision_id": revision_id,
            "model_id": model_id,
            "parent_cycle_id": parent_cycle_id,
            "dataset_id": dataset_id,
        })[:12].upper()

        record = {
            **revision_core,
            "revision_id": revision_id,
            "revision_hash": revision_hash,
            "relation": "REVISES",
            "evidence_graph_hash": graph["graph_hash"],
            "audit_snapshot_hash": snapshot["snapshot_hash"],
            "ledger_head_hash": ledger.get("head_hash"),
            "successor_cycle_id": successor_id,
            "successor_cycle_status": "READY_FOR_NEW_RESEARCH_CYCLE",
            "scientific_boundary": {
                "explicit_revision_only": True,
                "prior_records_immutable": True,
                "validated_status_issued": False,
                "new_cycle_executed": False,
                "successor_cycle_is_descriptor_only": True,
            },
        }

        successor = {
            "successor_cycle_id": successor_id,
            "revision_id": revision_id,
            "parent_cycle_id": parent_cycle_id,
            "model_id": model_id,
            "dataset_id": dataset_id,
            "source_analysis_id": analysis_id,
            "source_claim_id": claim_id,
            "status": "READY_FOR_NEW_RESEARCH_CYCLE",
            "required_next_action": "CREATE_OR_REGISTER_NEW_RESEARCH_CYCLE",
            "created_at": now,
        }

        self.persistence.conn.execute(
            """INSERT INTO model_revisions(
              revision_id,model_id,parent_model_id,analysis_id,claim_id,dataset_id,
              analysis_hash,dataset_hash,graph_hash,snapshot_hash,decision,
              ledger_head_hash,revision_hash,payload,created_at)
              VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (revision_id, model_id, parent_model_id, analysis_id, claim_id, dataset_id,
             analysis["analysis_hash"], manifest["dataset_hash"], graph["graph_hash"],
             snapshot["snapshot_hash"], decision_type, ledger.get("head_hash"),
             revision_hash, json.dumps(record, ensure_ascii=False, sort_keys=True), time.time())
        )
        self.persistence.conn.execute(
            """INSERT INTO research_cycle_successors(
              successor_cycle_id,revision_id,parent_cycle_id,model_id,dataset_id,
              source_analysis_id,source_claim_id,status,payload,created_at)
              VALUES(?,?,?,?,?,?,?,?,?,?)""",
            (successor_id, revision_id, parent_cycle_id, model_id, dataset_id,
             analysis_id, claim_id, successor["status"],
             json.dumps(successor, ensure_ascii=False, sort_keys=True), time.time())
        )
        self.persistence.conn.commit()
        return record

    def verify(self, revision_id: str) -> Dict[str, Any]:
        row = self.persistence.conn.execute(
            "SELECT payload,revision_hash FROM model_revisions WHERE revision_id=?", (revision_id,)
        ).fetchone()
        if not row:
            raise ValueError("revision_not_found")
        payload = json.loads(row["payload"])
        expected = self._hash({
            k: payload[k] for k in [
                "model_id","parent_model_id","analysis_id","claim_id","dataset_id",
                "analysis_hash","dataset_hash","graph_hash","snapshot_hash","decision",
                "ledger_head_hash","evidence_refs","revision_reason","changes",
                "parent_cycle_id","created_at","version"
            ]
        })
        return {
            "revision_id": revision_id,
            "valid": expected == payload["revision_hash"] == row["revision_hash"],
            "stored_hash": row["revision_hash"],
            "computed_hash": expected,
            "successor_cycle_id": payload["successor_cycle_id"],
        }

    def get(self, revision_id: str) -> Optional[Dict[str, Any]]:
        row = self.persistence.conn.execute(
            "SELECT payload FROM model_revisions WHERE revision_id=?", (revision_id,)
        ).fetchone()
        return json.loads(row["payload"]) if row else None

    def lineage(self, model_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if model_id:
            rows = self.persistence.conn.execute(
                "SELECT payload FROM model_revisions WHERE model_id=? ORDER BY created_at", (model_id,)
            ).fetchall()
        else:
            rows = self.persistence.conn.execute(
                "SELECT payload FROM model_revisions ORDER BY created_at"
            ).fetchall()
        return [json.loads(r["payload"]) for r in rows]
