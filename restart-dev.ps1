# Script para reiniciar el servidor de desarrollo y limpiar caché

Write-Host "Deteniendo procesos de Node.js..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

Start-Sleep -Seconds 2

Write-Host "Eliminando carpeta .next..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "Carpeta .next eliminada" -ForegroundColor Green
}

Write-Host "Eliminando carpeta node_modules/.cache..." -ForegroundColor Yellow
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force node_modules/.cache
    Write-Host "Caché de node_modules eliminada" -ForegroundColor Green
}

Write-Host "`nIniciando servidor de desarrollo..." -ForegroundColor Green
npm run dev
