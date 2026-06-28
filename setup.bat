@echo off
REM WeatherGuard Admin - Quick Start Script for Windows

echo.
echo ========================================
echo 🚀 WeatherGuard Admin - Development Setup
echo ========================================
echo.

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Check for Docker
where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Docker found
    set /p USE_DOCKER="Would you like to start MongoDB using Docker? (y/n): "
    if /i "%USE_DOCKER%"=="y" (
        echo 🐳 Starting MongoDB container...
        docker-compose up -d mongodb
        echo ✅ MongoDB is running on mongodb://localhost:27017
        timeout /t 3
    )
) else (
    echo ⚠️  Docker not found. Please ensure MongoDB is running locally.
)

echo.
echo 📦 Installing backend dependencies...
cd api
call npm install
cd..

echo.
echo 📦 Installing frontend dependencies...
cd admin
call npm install
cd..

REM Copy environment files
echo.
echo ⚙️  Setting up environment files...
if not exist "api\.env" (
    copy "api\.env.example" "api\.env"
    echo ✅ Created api\.env (please update with your credentials)
) else (
    echo ✅ api\.env already exists
)

if not exist "admin\.env" (
    (
        echo VITE_API_URL=http://localhost:3001
    ) > admin\.env
    echo ✅ Created admin\.env
)

echo.
echo ========================================
echo ✨ Setup complete!
echo.
echo Next steps:
echo 1. Update api\.env with your OAuth credentials
echo 2. Start the backend: cd api ^&^& npm run dev
echo 3. In another terminal, start the frontend: cd admin ^&^& npm run dev
echo 4. Open http://localhost:3000 in your browser
echo.
echo Documentation: See README.md for detailed setup instructions
echo ========================================
echo.
pause
