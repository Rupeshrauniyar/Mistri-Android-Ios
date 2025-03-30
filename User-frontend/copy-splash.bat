@echo off
echo Copying splash image to Android resources...

mkdir android\app\src\main\res\drawable 2>nul

copy /Y src\assets\splash.jpg android\app\src\main\res\drawable\splash.png

echo Splash image copied. Now syncing with Capacitor...
npx cap sync android

echo Done! 