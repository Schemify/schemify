Write-Host "Setting up test environment variables..." -ForegroundColor Green

$env:MICROSERVICE_NAME_DATABASE_URL = "postgresql://postgres:postgres@localhost:5434/__project_name_kebab___test"
$env:KAFKA_BROKERS = "localhost:9094"
$env:NODE_ENV = "test"

Write-Host "Environment variables set:" -ForegroundColor Yellow
Write-Host "  MICROSERVICE_NAME_DATABASE_URL: $env:MICROSERVICE_NAME_DATABASE_URL" -ForegroundColor Cyan
Write-Host "  KAFKA_BROKERS: $env:KAFKA_BROKERS" -ForegroundColor Cyan
Write-Host "  NODE_ENV: $env:NODE_ENV" -ForegroundColor Cyan

Write-Host ""
Write-Host "You can now run: npm run test:integration" -ForegroundColor Green 