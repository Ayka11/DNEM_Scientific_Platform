"""
DNEM Scientific Audit Console — Gradio UI adapter v1.0
Provides a compact read-only governance dashboard component.
"""
from __future__ import annotations
import json
from typing import Any, Dict

def build_audit_console_blocks(gr, console_engine, initial_state=None):
    with gr.Column():
        gr.Markdown("## DNEM Scientific Audit Console")
        gr.Markdown("Read-only scientific governance status. `VALIDATED` is never inferred by the dashboard.")
        status = gr.Textbox(label="Governance status", interactive=False)
        score = gr.Number(label="Integrity score", precision=2, interactive=False)
        readiness = gr.Textbox(label="Analysis readiness", interactive=False)
        evidence = gr.Textbox(label="Evidence Graph", interactive=False)
        claim = gr.Textbox(label="Claim state", interactive=False)
        decision = gr.Textbox(label="Scientific decision", interactive=False)
        blockers = gr.Textbox(label="Blocking reasons", lines=4, interactive=False)
        ledger = gr.Textbox(label="Ledger integrity", interactive=False)
        revision = gr.Textbox(label="Model revision", interactive=False)

        def render(snapshot):
            snapshot = snapshot or {}
            return (
                snapshot.get("status","UNKNOWN"),
                snapshot.get("analysis_integrity",{}).get("score"),
                snapshot.get("analysis_integrity",{}).get("readiness",""),
                snapshot.get("evidence",{}).get("governance_state",""),
                snapshot.get("claim",{}).get("state",""),
                snapshot.get("decision",{}).get("type",""),
                "\n".join(snapshot.get("blocking_reasons",[])) or "None",
                f"valid={snapshot.get('ledger',{}).get('valid')}; records={snapshot.get('ledger',{}).get('records')}",
                f"{snapshot.get('model_revision',{}).get('revision_id') or 'None'}"
            )
        if initial_state is not None:
            values=render(initial_state)
            for component,value in zip(
                [status,score,readiness,evidence,claim,decision,blockers,ledger,revision], values
            ):
                component.value=value
        return {"status":status,"score":score,"readiness":readiness,"evidence":evidence,
                "claim":claim,"decision":decision,"blockers":blockers,"ledger":ledger,
                "revision":revision}
