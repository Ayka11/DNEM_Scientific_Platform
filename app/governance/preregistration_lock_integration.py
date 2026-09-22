"""
DNEM Pre-registration Lock Integration v1.0

Binds protocol lineage versions to the pre-registration lock lifecycle:
DRAFT -> LOCKED -> AMENDMENT -> LOCKED.

Locked protocol payloads are immutable. Amendments must create a new
protocol-lineage version and a new pre-registration record.
"""
from __future__ import annotations
from typing import Any, Dict
from hashlib import sha256
from datetime import datetime, timezone
import json, time
from app.services.persistence import Persistence
from app.research.protocol_inheritance_amendment_engine import ProtocolInheritanceAmendmentEngine

class PreregistrationLockIntegration:
    VERSION="1.0"
    STATES={"DRAFT","LOCKED","AMENDMENT"}

    def __init__(self, db_path="data/dnem.sqlite3"):
        self.persistence=Persistence(db_path)
        self.protocols=ProtocolInheritanceAmendmentEngine(db_path)
        self._init_schema()

    @staticmethod
    def _hash(x):
        return sha256(json.dumps(x,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()

    def _init_schema(self):
        self.persistence.conn.executescript("""
        CREATE TABLE IF NOT EXISTS preregistration_locks(
          preregistration_id TEXT PRIMARY KEY,
          protocol_id TEXT NOT NULL,
          protocol_version TEXT NOT NULL,
          state TEXT NOT NULL,
          parent_preregistration_id TEXT,
          protocol_hash TEXT NOT NULL,
          lock_hash TEXT NOT NULL,
          payload TEXT NOT NULL,
          created_at REAL NOT NULL
        );
        """)
        self.persistence.conn.commit()

    def create_draft(self, request: Dict[str,Any]):
        pid=request["protocol_id"]; ver=request["protocol_version"]
        p=self.protocols.get(pid,ver)
        if not p: raise ValueError("protocol_not_found")
        prereg_id="PREREG-"+self._hash({"protocol_id":pid,"version":ver,"nonce":request.get("nonce","")})[:12].upper()
        now=datetime.now(timezone.utc).isoformat()
        core={"preregistration_id":prereg_id,"protocol_id":pid,"protocol_version":ver,
              "state":"DRAFT","parent_preregistration_id":None,
              "protocol_hash":p["protocol_hash"],"created_at":now,"engine_version":self.VERSION}
        h=self._hash(core)
        payload={**core,"lock_hash":h,"scientific_boundary":{"validated_status_issued":False}}
        self.persistence.conn.execute("INSERT INTO preregistration_locks VALUES(?,?,?,?,?,?,?,?,?)",
          (prereg_id,pid,ver,"DRAFT",None,p["protocol_hash"],h,
           json.dumps(payload,ensure_ascii=False,sort_keys=True),time.time()))
        self.persistence.conn.commit()
        return payload

    def lock(self, prereg_id):
        row=self.persistence.conn.execute("SELECT payload FROM preregistration_locks WHERE preregistration_id=?",(prereg_id,)).fetchone()
        if not row: raise ValueError("preregistration_not_found")
        p=json.loads(row["payload"])
        if p["state"]!="DRAFT": raise ValueError("only_draft_can_be_locked")
        p["state"]="LOCKED"
        p["locked_at"]=datetime.now(timezone.utc).isoformat()
        core={k:p[k] for k in ["preregistration_id","protocol_id","protocol_version","state",
              "parent_preregistration_id","protocol_hash","created_at","engine_version"]}
        p["lock_hash"]=self._hash(core)
        p["scientific_boundary"]={"immutable_after_lock":True,"validated_status_issued":False}
        self.persistence.conn.execute("UPDATE preregistration_locks SET state=?,lock_hash=?,payload=? WHERE preregistration_id=?",
          ("LOCKED",p["lock_hash"],json.dumps(p,ensure_ascii=False,sort_keys=True),prereg_id))
        self.persistence.conn.commit()
        return p

    def amend(self, prereg_id, amendment_request):
        row=self.persistence.conn.execute("SELECT payload FROM preregistration_locks WHERE preregistration_id=?",(prereg_id,)).fetchone()
        if not row: raise ValueError("preregistration_not_found")
        p=json.loads(row["payload"])
        if p["state"]!="LOCKED": raise ValueError("only_locked_can_be_amended")
        new_pid=amendment_request.get("new_protocol_id") or p["protocol_id"]
        new_ver=amendment_request["new_protocol_version"]
        amended=self.protocols.amend({
          "source_protocol_id":p["protocol_id"],"source_version":p["protocol_version"],
          "new_protocol_id":new_pid,"new_version":new_ver,
          "amendments":amendment_request["amendments"],
          "cycle_id":amendment_request.get("cycle_id"),
          "revision_id":amendment_request.get("revision_id")
        })
        new_id="PREREG-"+self._hash({"parent":prereg_id,"protocol_hash":amended["protocol_hash"]})[:12].upper()
        now=datetime.now(timezone.utc).isoformat()
        core={"preregistration_id":new_id,"protocol_id":new_pid,"protocol_version":new_ver,
              "state":"AMENDMENT","parent_preregistration_id":prereg_id,
              "protocol_hash":amended["protocol_hash"],"created_at":now,"engine_version":self.VERSION}
        h=self._hash(core)
        payload={**core,"lock_hash":h,"amendment_of":prereg_id,
                 "scientific_boundary":{"new_version_required":True,"validated_status_issued":False}}
        self.persistence.conn.execute("INSERT INTO preregistration_locks VALUES(?,?,?,?,?,?,?,?,?)",
          (new_id,new_pid,new_ver,"AMENDMENT",prereg_id,amended["protocol_hash"],h,
           json.dumps(payload,ensure_ascii=False,sort_keys=True),time.time()))
        self.persistence.conn.commit()
        return payload

    def get(self,prereg_id):
        row=self.persistence.conn.execute("SELECT payload FROM preregistration_locks WHERE preregistration_id=?",(prereg_id,)).fetchone()
        return json.loads(row["payload"]) if row else None
