Write-Output "Building Frontend"
Write-Output "================"
Set-Location RTSER
npm run build

Write-Output ""
Write-Output "Starting Flask Server"
Write-Output "====================="
Set-Location ..
flask run -h localhost -p 8000
