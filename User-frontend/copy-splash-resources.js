const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const androidResPath = path.join(__dirname, 'android/app/src/main/res');
const sourceImagesPath = path.join(__dirname, 'src/assets');

// Create resource directories if they don't exist
const resourceDirs = [
  'drawable',
  'drawable-land-hdpi',
  'drawable-land-mdpi',
  'drawable-land-xhdpi',
  'drawable-land-xxhdpi',
  'drawable-land-xxxhdpi',
  'drawable-port-hdpi',
  'drawable-port-mdpi',
  'drawable-port-xhdpi',
  'drawable-port-xxhdpi',
  'drawable-port-xxxhdpi'
];

resourceDirs.forEach(dir => {
  const dirPath = path.join(androidResPath, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Source images
const portraitSplashImage = path.join(sourceImagesPath, 'splash.jpg');
const landscapeSplashImage = path.join(sourceImagesPath, 'splash-dark.jpg');

// Check if source images exist
if (!fs.existsSync(portraitSplashImage)) {
  console.error(`Error: Portrait splash image not found at ${portraitSplashImage}`);
  process.exit(1);
}

if (!fs.existsSync(landscapeSplashImage)) {
  console.error(`Error: Landscape splash image not found at ${landscapeSplashImage}`);
  process.exit(1);
}


// Copy images to resource directories
resourceDirs.forEach(dir => {
  const targetPath = path.join(androidResPath, dir, 'splash.png');
  const sourceImage = dir.includes('land') ? landscapeSplashImage : portraitSplashImage;
  
  try {
    fs.copyFileSync(sourceImage, targetPath);
  } catch (err) {
    console.error(`Error copying to ${targetPath}:`, err);
  }
});

// Sync Capacitor project
try {
  execSync('npx cap sync android', { stdio: 'inherit' });
} catch (err) {
  console.error('Error syncing Capacitor project:', err);
}

