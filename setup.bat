@echo off
echo ========================================
echo EdTech Project Setup Script
echo ========================================
echo.

echo Setting up Backend...
cd backend
echo Installing backend dependencies...
npm install
echo.
echo Backend setup complete!
echo.

echo Setting up Frontend...
cd ..\frontend
echo Installing frontend dependencies...
npm install
echo.
echo Frontend setup complete!
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Update config.env in backend folder with your MongoDB URI
echo 3. Start backend: cd backend ^& npm run dev
echo 4. Start frontend: cd frontend ^& npm start
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
pause
