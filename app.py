from app.api.server import app as api_app
import gradio as gr
from ui.app import demo

# Serve the FastAPI research API and the Gradio research UI from the same process.
# Gradio is mounted at /ui so the API remains available under /api/v1/*.
app = gr.mount_gradio_app(api_app, demo, path="/ui")

if __name__ == "__main__":
    import os
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", "7860")),
    )
