import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { REGISTRY, listMeasurements, getMeasurement } from "./src/server/registry.js";
import { studyService } from "./src/server/studyService.js";
import { runtimeService } from "./src/server/runtimeService.js";
import { resultsService, researchRuntime } from "./src/server/resultsService.js";
import {
  executeGovernanceDemo,
  runSessionGovernance,
  runPersistedFullGovernance,
} from "./src/server/governanceRuntime.js";
import { ARCHITECTURE_LEVELS } from "./src/server/architectureData.js";
import { experimentService } from "./src/server/experimentService.js";
import { analysisService } from "./src/server/analysisService.js";
import { evidenceGraphService } from "./src/server/evidenceGraphService.js";
import { protocolService } from "./src/server/protocolService.js";
import { modelRevisionService } from "./src/server/modelRevisionService.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes FIRST
  app.get("/api/v1/health", (_req, res) => {
    res.json({
      status: "ok",
      version: "v7.7",
      scientific_status: "implementation_baseline",
    });
  });

  app.get("/api/v1/measurements", (_req, res) => {
    res.json({ count: Object.keys(REGISTRY).length, items: listMeasurements() });
  });

  app.get("/api/v1/measurements/:id", (req, res) => {
    const item = getMeasurement(req.params.id);
    if (!item) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    res.json(item);
  });

  app.post("/api/v1/studies", (req, res) => {
    try {
      const { title, measurement_ids, seed } = req.body || {};
      const study = studyService.create(title, measurement_ids, seed);
      res.json(study);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/v1/studies/:id/freeze", (req, res) => {
    try {
      const study = studyService.freeze(req.params.id);
      res.json(study);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  });

  app.post("/api/v1/studies/:id/sessions", (req, res) => {
    try {
      const { participant_id, seed } = req.body || {};
      const session = runtimeService.start(req.params.id, participant_id, seed);
      res.json({ session_id: session.session_id, state: session.state });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/v1/sessions/:id/demo-run", (req, res) => {
    try {
      const session = runtimeService.runDemo(req.params.id);
      res.json({
        session_id: session.session_id,
        state: session.state,
        events: session.events,
      });
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  });

  app.post("/api/v1/sessions/:id/submit-human-trials", (req, res) => {
    try {
      const { measurement_id, trials, participant_id } = req.body || {};
      const result = runtimeService.submitHumanTrials(
        req.params.id,
        measurement_id || "C05-01",
        trials || [],
        participant_id || "human_participant"
      );
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/api/v1/demo-result", (req, res) => {
    const sessionId = (req.query.session_id as string) || "demo_session";
    const mid = (req.query.measurement_id as string) || "FI-01";
    res.json(resultsService.demoResult(sessionId, mid));
  });

  app.post("/api/v1/research/compile-run", (req, res) => {
    try {
      const { measurement_ids, trials_per_measurement } = req.body || {};
      const ids = Array.isArray(measurement_ids)
        ? measurement_ids
        : (measurement_ids || "C01-01,C02-01,C03-01")
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
      const n = Number(trials_per_measurement) || 10;
      const result = researchRuntime.compileAndRun(ids, n);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/api/v1/governance/snapshot", (_req, res) => {
    res.json(executeGovernanceDemo());
  });

  app.post("/api/v1/governance/session", (req, res) => {
    try {
      const { study_id } = req.body || {};
      const result = runSessionGovernance(study_id || "DEMO-STUDY");
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/v1/governance/persisted", (req, res) => {
    try {
      const { study_id } = req.body || {};
      const result = runPersistedFullGovernance(study_id || "DEMO-STUDY");
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // 9-Level Architecture API
  app.get("/api/v1/architecture/levels", (_req, res) => {
    res.json({ levels: ARCHITECTURE_LEVELS });
  });

  // Experiment Workspace API
  app.get("/api/v1/experiment/datasets", (_req, res) => {
    res.json({ items: experimentService.listDatasets() });
  });

  app.post("/api/v1/experiment/datasets", (req, res) => {
    try {
      const { name, condition_matrix, sample_size } = req.body || {};
      const ds = experimentService.createDataset(name || "New Dataset", condition_matrix || ["Condition A"], sample_size || 50);
      res.json(ds);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/v1/experiment/datasets/:id/lock", (req, res) => {
    try {
      const ds = experimentService.lockDataset(req.params.id);
      res.json(ds);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Results & Statistical Analysis Plan API
  app.post("/api/v1/analysis/statistical-plan", (req, res) => {
    try {
      const { study_id, primary_outcome, sample_size } = req.body || {};
      const plan = analysisService.executePlan(study_id || "STUDY-DEMO", primary_outcome, sample_size);
      res.json(plan);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Evidence & Claim Graph API
  app.get("/api/v1/evidence/graph", (_req, res) => {
    res.json(evidenceGraphService.getGraph());
  });

  // Protocols & Preregistration API
  app.get("/api/v1/protocols/preregistration", (_req, res) => {
    res.json({ items: protocolService.listLocks() });
  });

  app.post("/api/v1/protocols/preregistration/lock", (req, res) => {
    try {
      const { study_id, title, hypotheses } = req.body || {};
      const record = protocolService.createLock(study_id || "STUDY-01", title || "Preregistered Protocol", hypotheses || []);
      res.json(record);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/v1/protocols/preregistration/:id/amend", (req, res) => {
    try {
      const { reason } = req.body || {};
      const record = protocolService.amendLock(req.params.id, reason || "Administrative Amendment");
      res.json(record);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // L8 Model Revision Lineage API
  app.get("/api/v1/model-revision/lineage", (_req, res) => {
    res.json({ items: modelRevisionService.listRevisions() });
  });

  app.post("/api/v1/model-revision/create", (req, res) => {
    try {
      const { model_id, parent_model_id, reason, changes } = req.body || {};
      const rev = modelRevisionService.createRevision(
        model_id || "DNEM-MODEL",
        parent_model_id || "",
        reason || "Formal evidence-linked update",
        changes || [{ component: "Parameters", action: "UPDATE", diff: "+evidence linked update" }]
      );
      res.json(rev);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DNEM Scientific Platform server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
