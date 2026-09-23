import json, sqlite3, time, hashlib
from pathlib import Path

class Persistence:
    def __init__(self, path="data/dnem.sqlite3"):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.conn = sqlite3.connect(self.path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self.init_schema()

    def init_schema(self):
        self.conn.executescript("""
        CREATE TABLE IF NOT EXISTS studies(
          study_id TEXT PRIMARY KEY, title TEXT, version TEXT, status TEXT,
          seed INTEGER, measurement_ids TEXT, created_at REAL
        );
        CREATE TABLE IF NOT EXISTS sessions(
          session_id TEXT PRIMARY KEY, study_id TEXT, participant_id TEXT,
          state TEXT, created_at REAL
        );
        CREATE TABLE IF NOT EXISTS events(
          event_id TEXT PRIMARY KEY, session_id TEXT, sequence INTEGER,
          event_type TEXT, payload TEXT, provenance_hash TEXT, created_at REAL
        );
        CREATE TABLE IF NOT EXISTS results(
          result_id TEXT PRIMARY KEY, session_id TEXT, measurement_id TEXT,
          payload TEXT, created_at REAL
        );
        CREATE TABLE IF NOT EXISTS trials(
          trial_id TEXT PRIMARY KEY, session_id TEXT, measurement_id TEXT,
          payload TEXT, created_at REAL
        );
        CREATE TABLE IF NOT EXISTS datasets(
          dataset_id TEXT PRIMARY KEY, source_type TEXT, manifest TEXT,
          dataset_hash TEXT, created_at REAL
        );
        CREATE TABLE IF NOT EXISTS claims(
          claim_id TEXT PRIMARY KEY, claim_type TEXT, statement TEXT,
          status TEXT, payload TEXT, created_at REAL
        );
        CREATE TABLE IF NOT EXISTS analyses(
          analysis_id TEXT PRIMARY KEY, dataset_id TEXT, dataset_hash TEXT,
          pipeline_version TEXT, analysis_hash TEXT, payload TEXT, created_at REAL
        );
        CREATE TABLE IF NOT EXISTS evidence(
          evidence_id TEXT PRIMARY KEY, analysis_id TEXT, dataset_id TEXT,
          dataset_hash TEXT, analysis_hash TEXT, evidence_hash TEXT,
          status TEXT, payload TEXT, created_at REAL
        );
        """)
        self.conn.commit()

    def save_study(self, study):
        self.conn.execute(
            "INSERT OR REPLACE INTO studies VALUES(?,?,?,?,?,?,?)",
            (study.study_id, study.title, study.version, study.status,
             study.seed, json.dumps(study.measurement_ids), study.created_at))
        self.conn.commit()

    def save_session(self, session):
        self.conn.execute(
            "INSERT OR REPLACE INTO sessions VALUES(?,?,?,?,?)",
            (session.session_id, session.study_id, session.participant_id,
             session.runtime.state, time.time()))
        self.conn.commit()

    def save_event(self, session_id, event):
        self.conn.execute(
            "INSERT OR REPLACE INTO events VALUES(?,?,?,?,?,?,?)",
            (event["event_id"], session_id, event["sequence"], event["event_type"],
             json.dumps(event["payload"]), event["provenance_hash"], time.time()))
        self.conn.commit()

    def save_result(self, result):
        rid = result.get("result_id") or "result_" + hashlib.sha256(
            json.dumps(result, sort_keys=True).encode()).hexdigest()[:12]
        self.conn.execute(
            "INSERT OR REPLACE INTO results VALUES(?,?,?,?,?)",
            (rid, result["session_id"], result["measurement_id"],
             json.dumps(result), time.time()))
        self.conn.commit()
        return rid

    def list_results(self, session_id):
        rows = self.conn.execute(
            "SELECT payload FROM results WHERE session_id=? ORDER BY created_at",
            (session_id,)).fetchall()
        return [json.loads(r["payload"]) for r in rows]

    def save_dataset_manifest(self, manifest):
        self.conn.execute(
            "INSERT INTO datasets(dataset_id,source_type,manifest,dataset_hash,created_at) VALUES(?,?,?,?,?)",
            (manifest["dataset_id"], manifest["source_type"],
             json.dumps(manifest, ensure_ascii=False),
             manifest["dataset_hash"], time.time())
        )
        self.conn.commit()
        return manifest["dataset_id"]

    def get_dataset_manifest(self, dataset_id):
        row=self.conn.execute(
            "SELECT manifest FROM datasets WHERE dataset_id=?",
            (dataset_id,)).fetchone()
        return json.loads(row["manifest"]) if row else None

    def list_dataset_manifests(self):
        rows=self.conn.execute(
            "SELECT manifest FROM datasets ORDER BY created_at"
        ).fetchall()
        return [json.loads(r["manifest"]) for r in rows]

    def save_trial(self, session_id, trial):
        self.conn.execute(
            "INSERT OR REPLACE INTO trials VALUES(?,?,?,?,?)",
            (trial["trial_id"], session_id, trial["measurement_id"],
             json.dumps(trial), time.time()))
        self.conn.commit()

    def save_trials(self, session_id, trials):
        for trial in trials:
            self.save_trial(session_id, trial)

    def list_trials(self, session_id, measurement_id=None):
        if measurement_id:
            rows=self.conn.execute(
                "SELECT payload FROM trials WHERE session_id=? AND measurement_id=? ORDER BY created_at",
                (session_id,measurement_id)).fetchall()
        else:
            rows=self.conn.execute(
                "SELECT payload FROM trials WHERE session_id=? ORDER BY created_at",
                (session_id,)).fetchall()
        return [json.loads(r["payload"]) for r in rows]


    def save_evidence(self, record):
        self.conn.execute(
            "INSERT INTO evidence(evidence_id,analysis_id,dataset_id,dataset_hash,analysis_hash,evidence_hash,status,payload,created_at) VALUES(?,?,?,?,?,?,?,?,?)",
            (record["evidence_id"], record["analysis_id"], record["dataset_id"],
             record["dataset_hash"], record["analysis_hash"], record["evidence_hash"],
             record.get("status","REGISTERED"), json.dumps(record, ensure_ascii=False),
             record["created_at"]))
        self.conn.commit()
        return record["evidence_id"]

    def get_evidence(self, evidence_id):
        row=self.conn.execute("SELECT payload FROM evidence WHERE evidence_id=?", (evidence_id,)).fetchone()
        return json.loads(row[0]) if row else None

    def list_evidence(self, analysis_id=None):
        if analysis_id:
            rows=self.conn.execute("SELECT payload FROM evidence WHERE analysis_id=? ORDER BY created_at",
                                   (analysis_id,)).fetchall()
        else:
            rows=self.conn.execute("SELECT payload FROM evidence ORDER BY created_at").fetchall()
        return [json.loads(r[0]) for r in rows]

    def save_analysis(self, record):
        self.conn.execute(
            "INSERT INTO analyses(analysis_id,dataset_id,dataset_hash,pipeline_version,analysis_hash,payload,created_at) VALUES(?,?,?,?,?,?,?)",
            (record["analysis_id"], record["dataset_id"], record["dataset_hash"],
             record.get("pipeline_version"), record["analysis_hash"],
             json.dumps(record, ensure_ascii=False, sort_keys=True), record.get("created_at", time.time())))
        self.conn.commit()
        return record["analysis_id"]

    def get_analysis(self, analysis_id):
        row=self.conn.execute("SELECT payload FROM analyses WHERE analysis_id=?", (analysis_id,)).fetchone()
        return json.loads(row["payload"]) if row else None

    def list_analyses(self, dataset_id=None):
        if dataset_id:
            rows=self.conn.execute("SELECT payload FROM analyses WHERE dataset_id=? ORDER BY created_at", (dataset_id,)).fetchall()
        else:
            rows=self.conn.execute("SELECT payload FROM analyses ORDER BY created_at").fetchall()
        return [json.loads(r["payload"]) for r in rows]

    def close(self):
        """Close the SQLite connection deterministically."""
        conn = getattr(self, "conn", None)
        if conn is not None:
            conn.close()
            self.conn = None
