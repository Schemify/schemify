@echo off
echo Setting up test environment variables...

set project_name_screaming_DATABASE_URL=postgresql://postgres:postgres@localhost:5434/__project_name_kebab___test
set KAFKA_BROKERS=localhost:9094
set NODE_ENV=test

echo Environment variables set:
echo   project_name_screaming_DATABASE_URL=%project_name_screaming_DATABASE_URL%
echo   KAFKA_BROKERS=%KAFKA_BROKERS%
echo   NODE_ENV=%NODE_ENV%

echo.
echo You can now run: npm run test:integration 