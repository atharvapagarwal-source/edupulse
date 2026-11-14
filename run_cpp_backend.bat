@echo off
title EduPulse C++ Academic Intelligence Server
echo ========================================================
echo   EduPulse C++ Backend Engine - OOPS Edition
echo ========================================================
cd backend_cpp
if not exist server.exe (
    echo [BUILDING] Compiling server.cpp with g++ ...
    g++ -std=c++17 server.cpp -lws2_32 -lsqlite3 -o server.exe
)
echo [STARTING] Launching C++ Server on http://localhost:8000 ...
server.exe
pause
