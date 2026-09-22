import os
import gradio as gr
import uvicorn

from app.api.server import app as api_app
from ui.app import demo

# Avoid the app.py / app/ package name collision when using uvicorn's import syntax.
application = gr.mount_gradio_app(api_app, demo, path="/ui")

if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "7860"))
    print(f"DNEM v7.7 localhost launcher")
    print(f"API : http://{host}:{port}/api/v1/health")
    print(f"DOCS: http://{host}:{port}/docs")
    print(f"UI  : http://{host}:{port}/ui/")
    print("Press CTRL+C to stop.")
    uvicorn.run(
        application,
        host=host,
        port=port,
        log_level="info",
    )
