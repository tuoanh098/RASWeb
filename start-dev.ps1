
$ErrorActionPreference = "Stop"

# Start backend
Write-Host "Starting backend..."
$backend = Start-Process -FilePath "mvn" -ArgumentList "-q","-f","backend\pom.xml","spring-boot:run" -PassThru

# Start frontend
Write-Host "Starting frontend..."
Push-Location frontend
if (Test-Path package-lock.json) {
  npm ci
} else {
  npm i
}
npm run dev

# When frontend process ends (Ctrl+C), stop backend
Write-Host "Stopping backend (PID $($backend.Id))..."
Stop-Process -Id $backend.Id -Force
Pop-Location
