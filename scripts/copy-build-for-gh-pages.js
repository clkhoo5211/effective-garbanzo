const fs = require('fs');
const path = require('path');

// Function to copy directory recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Create out directory
const outDir = path.join(__dirname, '..', 'out');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

// Copy static files
const staticDir = path.join(__dirname, '..', '.next', 'static');
if (fs.existsSync(staticDir)) {
  copyDir(staticDir, path.join(outDir, '_next', 'static'));
}

// Copy server pages (simplified - in a real app you'd need to handle this properly)
const serverDir = path.join(__dirname, '..', '.next', 'server', 'app');
if (fs.existsSync(serverDir)) {
  // For simplicity, we'll just copy a few key files
  const filesToCopy = [
    'index.html',
    '404.html'
  ];
  
  // Copy index.html
  const indexPath = path.join(serverDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, path.join(outDir, 'index.html'));
  }
  
  // Copy 404.html
  const notFoundPath = path.join(serverDir, '_not-found.html');
  if (fs.existsSync(notFoundPath)) {
    fs.copyFileSync(notFoundPath, path.join(outDir, '404.html'));
  }
}

// Copy public directory
const publicDir = path.join(__dirname, '..', 'public');
if (fs.existsSync(publicDir)) {
  copyDir(publicDir, outDir);
}

console.log('Build files copied to out directory for GitHub Pages deployment.');
console.log('Note: Dynamic routes like blog posts will be loaded at runtime from your GitHub repository.');