$ErrorActionPreference = "Stop"

$base = "http://127.0.0.1:7860"

Write-Host "Testing DNEM v7.7 localhost..."

$health = Invoke-WebRequest "$base/api/v1/health" -UseBasicParsing
Write-Host "HEALTH: HTTP $($health.StatusCode)"
Write-Host $health.Content

$docs = Invoke-WebRequest "$base/docs" -UseBasicParsing
Write-Host "DOCS: HTTP $($docs.StatusCode)"

$ui = Invoke-WebRequest "$base/ui/" -UseBasicParsing
Write-Host "UI: HTTP $($ui.StatusCode)"

$measurements = Invoke-WebRequest "$base/api/v1/measurements" -UseBasicParsing
$data = $measurements.Content | ConvertFrom-Json
Write-Host "MEASUREMENTS: $($data.count)"

if ($health.StatusCode -eq 200 -and $docs.StatusCode -eq 200 -and $ui.StatusCode -eq 200 -and $data.count -eq 170) {
    Write-Host ""
    Write-Host "DNEM v7.7 LOCALHOST FUNCTIONAL TEST: PASS" -ForegroundColor Green
} else {
    throw "One or more localhost checks failed."
}
