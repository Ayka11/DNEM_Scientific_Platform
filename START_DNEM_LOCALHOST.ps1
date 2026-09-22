$ErrorActionPreference = "Stop"
Set-Location "C:\Users\User\Downloads\DNEM_HF_DEPLOY"
$env:HOST = "127.0.0.1"
$env:PORT = "7860"

Write-Host "Starting DNEM v7.7..."
Write-Host "Do NOT close this PowerShell window."
Write-Host ""
python .\run_localhost.py
