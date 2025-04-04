const fs = require('fs');
const path = require('path');

const directories = ['user-frontend', 'mistri-frontend'];
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

function removeConsoleLogs(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            removeConsoleLogs(fullPath);
        } else if (extensions.includes(path.extname(file))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const updatedContent = content.replace(/^\s*console\.log\(.*\);?/gm, '');
            fs.writeFileSync(fullPath, updatedContent, 'utf8');
        }
    });
}

directories.forEach(removeConsoleLogs);