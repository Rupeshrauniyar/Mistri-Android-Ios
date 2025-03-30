const fs = require('fs');
const path = require('path');

// Define paths
const androidResPath = path.join(__dirname, 'android/app/src/main/res');
const sourceImagePath = path.join(__dirname, 'src/assets/splash.jpg');

// Create drawable directory if it doesn't exist
const drawablePath = path.join(androidResPath, 'drawable');
if (!fs.existsSync(drawablePath)) {
  console.log(`Creating directory: ${drawablePath}`);
  fs.mkdirSync(drawablePath, { recursive: true });
}

// Copy the splash image to drawable directory
try {
  if (fs.existsSync(sourceImagePath)) {
    const targetPath = path.join(drawablePath, 'splash.png');
    fs.copyFileSync(sourceImagePath, targetPath);
    console.log(`Successfully copied splash image to ${targetPath}`);
  } else {
    console.error(`Source image not found at ${sourceImagePath}`);
  }
} catch (error) {
  console.error('Error copying splash image:', error);
}

console.log('Splash image setup completed. Run "npx cap sync android" to apply changes.'); 