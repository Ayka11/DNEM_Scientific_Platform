"""
DNEM Protocol Inheritance & Amendment Engine v1.0

Registers protocol lineage for successor research cycles. A successor protocol
may inherit an existing protocol and declare explicit amendments. Every
amendment creates a new immutable protocol version; the source version is
never overwritten.
"""
from __future__ import annotations
from typing import Any, Dict, List, Optional
from hashlib import sha256
from datetime import datetime, timezone
import json, time
from app.services.persistence import Persistence
from app.research.research_cycle_successor_executor import ResearchCycleSuccessorExecutor

class ProtocolInheritanceAmendmentEngine:
    VERSION="1.0"

    def __init__(self, db_path="data/dnem.sqlite3", ledger_path="dnem_scientific_ledger.sqlite"):
        self.persistence=Persistence(db_path)
        self.cycles=ResearchCycleSuccessorExecutor(db_path, ledger_path)
        self._init_schema()

    @staticmethod
    def _hash(x):
        return sha256(json.dumps(x,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()

    def _init_schema(self):
        self.persistence.conn.executescript("""
        CREATE TABLE IF NOT EXISTS research_protocols(
          protocol_id TEXT NOT NULL,
          version TEXT NOT NULL,
          parent_protocol_id TEXT,
          parent_version TEXT,
          cycle_id TEXT,
          revision_id TEXT,
          status TEXT NOT NULL,
          protocol_hash TEXT NOT NULL,
          payload TEXT NOT NULL,
          created_at REAL NOT NULL,
          PRIMARY KEY(protocol_id,version)
        );
        """)
        self.persistence.conn.commit()

    def register_base(self, request):
        protocol_id=request["protocol_id"]; version=request["version"]
        definition=request.get("definition") or {}
        if not definition: raise ValueError("protocol_definition_required")
        if self.persistence.conn.execute(
            "SELECT 1 FROM research_protocols WHERE protocol_id=? AND version=?",
            (protocol_id,version)).fetchone():
            raise ValueError("protocol_version_exists")
        now=datetime.now(timezone.utc).isoformat()
        core={"protocol_id":protocol_id,"version":version,"definition":definition,
              "parent_protocol_id":None,"parent_version":None,"cycle_id":request.get("cycle_id"),
              "revision_id":None,"created_at":now,"engine_version":self.VERSION}
        h=self._hash(core)
        payload={**core,"protocol_hash":h,"status":"REGISTERED",
                 "scientific_boundary":{"immutable_version":True,"validated_status_issued":False}}
        self.persistence.conn.execute(
          "INSERT INTO research_protocols VALUES(?,?,?,?,?,?,?,?,?,?)",
          (protocol_id,version,None,None,core["cycle_id"],None,"REGISTERED",h,
           json.dumps(payload,ensure_ascii=False,sort_keys=True),time.time()))
        self.persistence.conn.commit()
        return payload

    def amend(self, request):
        source_id=request["source_protocol_id"]; source_v=request["source_version"]
        new_id=request.get("new_protocol_id") or source_id
        new_v=request["new_version"]
        amendments=request.get("amendments") or []
        if not amendments: raise ValueError("amendments_required")
        row=self.persistence.conn.execute(
          "SELECT payload FROM research_protocols WHERE protocol_id=? AND version=?",
          (source_id,source_v)).fetchone()
        if not row: raise ValueError("source_protocol_not_found")
        source=json.loads(row["payload"])
        if self.persistence.conn.execute(
          "SELECT 1 FROM research_protocols WHERE protocol_id=? AND version=?",
          (new_id,new_v)).fetchone():
            raise ValueError("protocol_version_exists")
        definition=dict(source["definition"])
        changes=[]
        for a in amendments:
            path=a.get("path")
            if not path: raise ValueError("amendment_path_required")
            new_value=a.get("new_value")
            old_value=definition.get(path)
            definition[path]=new_value
            changes.append({"path":path,"old_value":old_value,"new_value":new_value,
                            "reason":a.get("reason")})
        now=datetime.now(timezone.utc).isoformat()
        core={"protocol_id":new_id,"version":new_v,"definition":definition,
              "parent_protocol_id":source_id,"parent_version":source_v,
              "cycle_id":request.get("cycle_id"),"revision_id":request.get("revision_id"),
              "amendments":changes,"created_at":now,"engine_version":self.VERSION}
        h=self._hash(core)
        payload={**core,"protocol_hash":h,"status":"AMENDED_REGISTERED",
                 "scientific_boundary":{"source_version_immutable":True,
                                        "amendments_explicit":True,
                                        "validated_status_issued":False}}
        self.persistence.conn.execute(
          "INSERT INTO research_protocols VALUES(?,?,?,?,?,?,?,?,?,?)",
          (new_id,new_v,source_id,source_v,core["cycle_id"],core["revision_id"],
           "AMENDED_REGISTERED",h,json.dumps(payload,ensure_ascii=False,sort_keys=True),time.time()))
        self.persistence.conn.commit()
        return payload

    def get(self,pid,version):
        row=self.persistence.conn.execute(
          "SELECT payload FROM research_protocols WHERE protocol_id=? AND version=?",(pid,version)).fetchone()
        return json.loads(row["payload"]) if row else None

    def lineage(self,pid):
        rows=self.persistence.conn.execute(
          "SELECT payload FROM research_protocols WHERE protocol_id=? ORDER BY created_at",(pid,)).fetchall()
        return [json.loads(r["payload"]) for r in rows]

    def verify(self,pid,version):
        p=self.get(pid,version)
        if not p: raise ValueError("protocol_not_found")
        core={k:p[k] for k in ["protocol_id","version","definition","parent_protocol_id",
             "parent_version","cycle_id","revision_id","created_at","engine_version"]}
        # amended versions additionally include amendments in their hash
        if p.get("amendments") is not None: core["amendments"]=p["amendments"]
        h=self._hash(core)
        return {"protocol_id":pid,"version":version,"valid":h==p["protocol_hash"],
                "stored_hash":p["protocol_hash"],"computed_hash":h}
