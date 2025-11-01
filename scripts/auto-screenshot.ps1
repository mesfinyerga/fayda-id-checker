# Auto Screenshot Monitoring Script
# Usage: .\scripts\auto-screenshot.ps1

param(
    [int]$Interval = 30,  # Screenshot interval in seconds
    [int]$MaxScreenshots = 10  # Maximum number of screenshots to keep
)

$screenshotsDir = "C:\Users\lijma\Documents\GitHub\fayda-id-checker\screenshots"
$timestamp = Get-Date -Format "yyyy-MM-ddTHH-mm-ss-fffZ"

Write-Host "Starting Auto Screenshot Monitor..." -ForegroundColor Green
Write-Host "Screenshots Directory: $screenshotsDir" -ForegroundColor Yellow
Write-Host "Interval: $Interval seconds" -ForegroundColor Yellow
Write-Host "Max Screenshots: $MaxScreenshots" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop" -ForegroundColor Red

# Create screenshots directory if it doesn't exist
if (!(Test-Path $screenshotsDir)) {
    New-Item -ItemType Directory -Path $screenshotsDir -Force
    Write-Host "Created screenshots directory: $screenshotsDir" -ForegroundColor Green
}

# Function to clean old screenshots
function Remove-OldScreenshots {
    $screenshots = Get-ChildItem -Path $screenshotsDir -Filter "*.png" | Sort-Object LastWriteTime -Descending
    if ($screenshots.Count -gt $MaxScreenshots) {
        $toRemove = $screenshots | Select-Object -Skip $MaxScreenshots
        foreach ($file in $toRemove) {
            Remove-Item $file.FullName -Force
            Write-Host "Removed old screenshot: $($file.Name)" -ForegroundColor Yellow
        }
    }
}

# Main loop
try {
    while ($true) {
        $timestamp = Get-Date -Format "yyyy-MM-ddTHH-mm-ss-fffZ"
        $filename = "screenshot-$timestamp.png"
        $filepath = Join-Path $screenshotsDir $filename
        
        Write-Host "Capturing screenshot: $filename" -ForegroundColor Cyan
        
        # Note: This would need to be integrated with browser automation tools
        # For now, this is a placeholder for the screenshot capture logic
        Write-Host "Screenshot would be saved to: $filepath" -ForegroundColor Gray
        
        # Clean old screenshots
        Remove-OldScreenshots
        
        # Wait for next interval
        Start-Sleep -Seconds $Interval
    }
}
catch {
    Write-Host "Auto screenshot monitor stopped." -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
