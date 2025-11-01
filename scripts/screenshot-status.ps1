# Screenshot Status Check Script
# Usage: .\scripts\screenshot-status.ps1

$screenshotsDir = "C:\Users\lijma\Documents\GitHub\fayda-id-checker\screenshots"

Write-Host "=== Screenshot Folder Status ===" -ForegroundColor Green
Write-Host ""

# Check if directory exists
if (Test-Path $screenshotsDir) {
    Write-Host "✅ Screenshots directory exists" -ForegroundColor Green
} else {
    Write-Host "❌ Screenshots directory not found" -ForegroundColor Red
    exit 1
}

# Get screenshot count
$screenshots = Get-ChildItem -Path $screenshotsDir -Filter "*.png"
$count = $screenshots.Count

Write-Host "📊 Total screenshots: $count" -ForegroundColor Cyan

if ($count -gt 0) {
    Write-Host ""
    Write-Host "=== Recent Screenshots ===" -ForegroundColor Yellow
    
    # Show last 5 screenshots
    $recent = $screenshots | Sort-Object LastWriteTime -Descending | Select-Object -First 5
    
    foreach ($screenshot in $recent) {
        $size = [math]::Round($screenshot.Length / 1KB, 2)
        $date = $screenshot.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
        Write-Host "📸 $($screenshot.Name)" -ForegroundColor White
        Write-Host "   Size: ${size}KB | Date: $date" -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host "📸 No screenshots found" -ForegroundColor Yellow
}

Write-Host "=== Quick Actions ===" -ForegroundColor Green
Write-Host "1. Open folder: .\scripts\open-screenshots.bat" -ForegroundColor Cyan
Write-Host "2. Auto monitor: .\scripts\auto-screenshot.ps1" -ForegroundColor Cyan
Write-Host "3. Manual capture: Use MCP browser tools" -ForegroundColor Cyan
