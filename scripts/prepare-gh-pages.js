const fs = require('fs');
const path = require('path');

// Function to recursively replace strings in files
function replaceInFile(filePath, searchValue, replaceValue) {
  if (!fs.existsSync(filePath)) return;
  
  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    const files = fs.readdirSync(filePath);
    files.forEach(file => {
      replaceInFile(path.join(filePath, file), searchValue, replaceValue);
    });
  } else if (stat.isFile() && (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.endsWith('.json'))) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const newContent = content.replaceAll(searchValue, replaceValue);
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated: ${filePath}`);
      }
    } catch (err) {
      console.warn(`Could not process file: ${filePath}`, err.message);
    }
  }
}

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

// Function to flatten directory structure
function flattenChunks(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively flatten subdirectories
      flattenChunks(srcPath, destDir);
    } else {
      // Copy file to flattened directory
      const destPath = path.join(destDir, entry.name);
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Main function
function main() {
  try {
    // Create out directory
    const outDir = path.join(__dirname, '..', 'out');
    fs.rmSync(outDir, { recursive: true, force: true });
    fs.mkdirSync(outDir, { recursive: true });

    // Copy .next/server/app to out directory (simplified approach)
    const serverAppDir = path.join(__dirname, '..', '.next', 'server', 'app');
    if (fs.existsSync(serverAppDir)) {
      copyDir(serverAppDir, outDir);
    }

    // Copy public directory
    const publicDir = path.join(__dirname, '..', 'public');
    if (fs.existsSync(publicDir)) {
      copyDir(publicDir, outDir);
    }

    // Create a flattened assets directory
    const assetsDir = path.join(outDir, 'assets');
    fs.mkdirSync(assetsDir, { recursive: true });

    // Copy and flatten static assets
    const staticDir = path.join(__dirname, '..', '.next', 'static');
    if (fs.existsSync(staticDir)) {
      // Copy the entire static directory first
      copyDir(staticDir, path.join(outDir, '_next', 'static'));
      
      // Then flatten the chunks into a single assets directory
      const chunksDir = path.join(staticDir, 'chunks');
      if (fs.existsSync(chunksDir)) {
        flattenChunks(chunksDir, assetsDir);
      }
      
      // Also copy media directory
      const mediaDir = path.join(staticDir, 'media');
      if (fs.existsSync(mediaDir)) {
        copyDir(mediaDir, path.join(assetsDir, 'media'));
      }
    }

    // Fix asset paths for GitHub Pages
    console.log('Fixing asset paths for GitHub Pages...');
    replaceInFile(outDir, '/_next/', '/effective-garbanzo/_next/');
    replaceInFile(outDir, '/images/', '/effective-garbanzo/images/');
    replaceInFile(outDir, '"/"', '"/effective-garbanzo/"');
    
    // Fix paths to use flattened assets
    replaceInFile(outDir, '/effective-garbanzo/_next/static/chunks/', '/effective-garbanzo/assets/');
    
    // Fix favicon and manifest paths
    replaceInFile(outDir, 'href="/favicon.png"', 'href="/effective-garbanzo/favicon.png"');
    replaceInFile(outDir, 'href="/manifest.json"', 'href="/effective-garbanzo/manifest.json"');
    replaceInFile(outDir, 'src="/favicon.png"', 'src="/effective-garbanzo/favicon.png"');
    
    // Also fix any remaining absolute paths
    replaceInFile(outDir, '"favicon.png"', '"/effective-garbanzo/favicon.png"');
    replaceInFile(outDir, '"manifest.json"', '"/effective-garbanzo/manifest.json"');
    replaceInFile(outDir, '"/favicon.png"', '"/effective-garbanzo/favicon.png"');
    replaceInFile(outDir, '"/manifest.json"', '"/effective-garbanzo/manifest.json"');

    console.log('✅ GitHub Pages files prepared successfully!');
    console.log('📁 Files are ready in the "out" directory');
    console.log('📝 Next steps:');
    console.log('   1. Review the files in the "out" directory');
    console.log('   2. Commit and push to your GitHub Pages repository');
    console.log('   3. Configure GitHub Pages in your repository settings');

  } catch (error) {
    console.error('❌ Error preparing GitHub Pages files:', error.message);
    process.exit(1);
  }
}

main();