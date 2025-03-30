

const fs = require("fs");
const path = require("path");
// Function to recursively scan directories
function scanDirectory(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);

        if (fs.statSync(fullPath).isDirectory()) {
            scanDirectory(fullPath);
        } else if (file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".ts") || file.endsWith(".tsx")) {
            removeToastCode(fullPath);
        }
    });
}

// Function to remove toast-related code
function removeToastCode(filePath) {
    let content = fs.readFileSync(filePath, "utf8");

    // Remove toast imports
    content = content.replace(/import\s+{[^}]*toast[^}]*}\s+from\s+['"]react-toastify['"];?\n?/g, "");
    content = content.replace(/import\s+['"]react-toastify\/dist\/ReactToastify.css['"];?\n?/g, "");

    // Remove toast function calls
    content = content.replace(/toast\.\w+\([^)]*\);?\n?/g, "");

    // Remove ToastContainer if present
    content = content.replace(/<ToastContainer\s*\/?>/g, "");

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated: ${filePath}`);
}

// Start scanning from the src directory
const srcPath = path.join(__dirname, "src");
if (fs.existsSync(srcPath)) {
    scanDirectory(srcPath);
    console.log("✅ Successfully removed all references to react-toastify!");
} else {
    console.log("❌ Error: src directory not found!");
}
