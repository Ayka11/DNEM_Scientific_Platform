from fastapi import APIRouter
router=APIRouter(prefix="/api/v1/audit-console",tags=["scientific-audit-console"])
@router.get("/ui-capability")
def ui_capability():
    return {
        "component":"DNEM Scientific Audit Console",
        "version":"1.0",
        "mode":"read-only",
        "gradio_adapter":"app.governance.scientific_audit_gradio.build_audit_console_blocks",
        "status":"READY"
    }
