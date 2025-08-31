@echo off
echo 🚀 Starting EdTech ML Services...
echo.

echo 📚 Installing Python dependencies...
cd backend
pip install -r requirements.txt
echo.

echo 🤖 Starting ML Service (Port 5001)...
start "ML Service" python ml_service.py
echo.

echo ⏳ Waiting for ML service to start...
timeout /t 5 /nobreak > nul

echo 🔧 Starting Node.js Backend (Port 5000)...
start "Backend Server" npm run dev
echo.

echo ✅ Services started successfully!
echo.
echo 🌐 ML Service: http://localhost:5001
echo 🔧 Backend API: http://localhost:5000
echo 📱 Frontend: http://localhost:3001
echo.
echo Press any key to close this window...
pause > nul
