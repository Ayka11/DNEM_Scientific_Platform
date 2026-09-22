$ErrorActionPreference = "Stop"

$Target = "C:\Users\User\Downloads\DNEM_HF_DEPLOY"
$Zip = Join-Path $env:USERPROFILE "Downloads\DNEM_HF_DEPLOY_v7.7_LOCALHOST_UPDATE.zip"
$Backup = Join-Path $env:USERPROFILE ("Downloads\DNEM_HF_DEPLOY_BACKUP_" + (Get-Date -Format "yyyyMMdd_HHmmss"))

Write-Host "DNEM v7.7 local update"
Write-Host "Target: $Target"

if (!(Test-Path $Zip)) {
    throw "Update ZIP not found: $Zip"
}

if (Test-Path $Target) {
    Rename-Item -Path $Target -NewName (Split-Path $Backup -Leaf)
    Write-Host "Backup created: $Backup"
}

New-Item -ItemType Directory -Force -Path $Target | Out-Null
Expand-Archive -Path $Zip -DestinationPath $Target -Force

Set-Location $Target

if (!(Test-Path ".\app.py")) {
    throw "app.py was not found after extraction."
}

if (!(Test-Path ".\requirements.txt")) {
    throw "requirements.txt was not found after extraction."
}

Write-Host ""
Write-Host "Installing/updating Python dependencies..."
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

Write-Host ""
Write-Host "Compile check..."
python -m compileall app ui
if ($LASTEXITCODE -ne 0) { throw "Compile check failed." }

Write-Host ""
Write-Host "Starting DNEM on localhost:7860..."
$env:PORT = "7860"
$env:GRADIO_SERVER_NAME = "127.0.0.1"

$proc = Start-Process -FilePath "python" -ArgumentList "app.py" -WorkingDirectory $Target -PassThru -RedirectStandardOutput "$Target\dnem_localhost_stdout.log" -RedirectStandardError "$Target\dnem_localhost_stderr.log"

try {
    $ready = $false
    for ($i=0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 1
        try {
            $r = Invoke-WebRequest -Uri "http://127.0.0.1:7860/api/v1/health" -UseBasicParsing -TimeoutSec 3
            if ($r.StatusCode -eq 200) {
                $ready = $true
                Write-Host "HEALTH PASS: $($r.Content)"
                break
            }
        } catch {}
    }

    if (!$ready) {
        Write-Host "Application failed to become ready."
        if (Test-Path "$Target\dnem_localhost_stderr.log") {
            Get-Content "$Target\dnem_localhost_stderr.log" -Tail 80
        }
        throw "Localhost health check failed."
    }

    $docs = Invoke-WebRequest -Uri "http://127.0.0.1:7860/docs" -UseBasicParsing -TimeoutSec 10
    Write-Host "DOCS PASS: HTTP $($docs.StatusCode)"

    $ui = Invoke-WebRequest -Uri "http://127.0.0.1:7860/ui/" -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 10
    Write-Host "GRADIO UI PASS: HTTP $($ui.StatusCode)"

    $measurements = Invoke-WebRequest -Uri "http://127.0.0.1:7860/api/v1/measurements" -UseBasicParsing -TimeoutSec 10
    Write-Host "MEASUREMENTS PASS"
    Write-Host $measurements.Content

    Write-Host ""
    Write-Host "=========================================="
    Write-Host "DNEM v7.7 LOCALHOST TEST: PASS"
    Write-Host "API : http://127.0.0.1:7860/api/v1/health"
    Write-Host "DOCS: http://127.0.0.1:7860/docs"
    Write-Host "UI  : http://127.0.0.1:7860/ui/"
    Write-Host "=========================================="
}
finally {
    if ($proc -and !$proc.HasExited) {
        Stop-Process -Id $proc.Id -Force
    }
}
