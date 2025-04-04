const fs = require("fs");
const path = require("path");

const directories = ["user-frontend", "mistri-frontend"];
const fileExtensions = [".js", ".jsx", ".ts", ".tsx"];

// Function to remove console.log statements
function removeConsoleLogs(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      removeConsoleLogs(fullPath); // Recursively scan directories
    } else if (fileExtensions.includes(path.extname(file))) {
      let content = fs.readFileSync(fullPath, "utf8");

      // Remove all `console.log(...)` lines
      let updatedContent = content.replace(/^\s*console\.log\(.*?\);?\s*$/gm, "");

      if (updatedContent !== content) {
        fs.writeFileSync(fullPath, updatedContent, "utf8");
        console.log(`✅ Removed console.log from: ${fullPath}`);
      }
    }
  });
}

// Process each directory
directories.forEach((dir) => {
  if (fs.existsSync(dir)) {
    removeConsoleLogs(dir);
  } else {
    console.log(`❌ Directory not found: ${dir}`);
  }
});

console.log("🚀 All console.log statements have been removed!");
