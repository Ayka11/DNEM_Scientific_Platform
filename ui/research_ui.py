import gradio as gr
import json
from app.services.research_runtime import ResearchRuntime
from app.measurements.registry import REGISTRY

runtime = ResearchRuntime()

def run_selected(ids_text, n):
    ids = [x.strip() for x in ids_text.split(",") if x.strip()]
    unknown = [x for x in ids if x not in REGISTRY]
    if unknown:
        return json.dumps({"error":"unknown_measurements","items":unknown}, indent=2)
    out = runtime.compile_and_run(ids, int(n))
    return json.dumps({
        "protocol": out["protocol"],
        "trial_count": len(out["trials"]),
        "results": out["results"]
    }, indent=2)

def list_ids():
    return ", ".join(list(REGISTRY.keys())[:10])

with gr.Blocks(title="DNEM Research Runtime v1.0") as research:
    gr.Markdown("## DNEM Research Runtime v1.0")
    gr.Markdown("Synthetic deterministic runtime only; not scientific validation.")
    ids = gr.Textbox(label="Measurement IDs", value="FI-01,WM-01,PS-01")
    n = gr.Slider(1, 100, value=10, step=1, label="Trials / measurement")
    run = gr.Button("Compile + Run")
    out = gr.Code(language="json", label="Runtime output")
    run.click(run_selected, [ids,n], out)
