@echo off

echo Starting Backend...
start cmd /k "cd server && npm start"

echo Starting Frontend...
start cmd /k "cd app && yarn dev"

echo Done!
pause
