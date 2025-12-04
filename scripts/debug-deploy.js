const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PUBLIC_REPO_URL = 'https://github.com/clkhoo5211/effective-garbanzo.git';
const TEMP_DIR = path.join(__dirname, '..', 'temp-deploy');

try {
  // Check if temp directory exists and remove it
  if (fs.existsSync(TEMP_DIR)) {
    console.log('Removing existing temp directory...');
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }

  // Clone the public repository
  console.log('Cloning public repository...');
  execSync(`git clone ${PUBLIC_REPO_URL} "${TEMP_DIR}"`, { stdio: 'inherit' });

  // Remove existing files except .git directory
  console.log('Cleaning repository contents...');
  const files = fs.readdirSync(TEMP_DIR);
  files.forEach(file => {
    if (file !== '.git') {
      const filePath = path.join(TEMP_DIR, file);
      fs.rmSync(filePath, { recursive: true, force: true });
    }
  });

  // Copy build files to the repository
  console.log('Copying build files...');
  const outDir = path.join(__dirname, '..', 'out');
  const filesToCopy = fs.readdirSync(outDir);
  
  filesToCopy.forEach(file => {
    const srcPath = path.join(outDir, file);
    const destPath = path.join(TEMP_DIR, file);
    
    if (fs.lstatSync(srcPath).isDirectory()) {
      execSync(`cp -r "${srcPath}" "${destPath}"`);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });

  // Debug: Check the structure of the temp directory
  console.log('\n=== DEBUG INFO ===');
  console.log('Checking _next/static directory structure:');
  const staticDir = path.join(TEMP_DIR, '_next', 'static');
  if (fs.existsSync(staticDir)) {
    console.log('_next/static contents:');
    const staticContents = fs.readdirSync(staticDir);
    staticContents.forEach(item => {
      console.log(`  ${item}`);
      const itemPath = path.join(staticDir, item);
      if (fs.lstatSync(itemPath).isDirectory()) {
        const subItems = fs.readdirSync(itemPath).slice(0, 5); // Show first 5 items
        subItems.forEach(subItem => {
          console.log(`    ${subItem}`);
        });
        if (fs.readdirSync(itemPath).length > 5) {
          console.log(`    ... and ${fs.readdirSync(itemPath).length - 5} more items`);
        }
      }
    });
  } else {
    console.log('_next/static directory does not exist!');
  }

  console.log('\nChecking specific CSS file:');
  const cssFilePath = path.join(TEMP_DIR, '_next', 'static', 'chunks', '6cd2979c84dafa2c.css');
  if (fs.existsSync(cssFilePath)) {
    const stats = fs.statSync(cssFilePath);
    console.log(`CSS file exists: ${cssFilePath}`);
    console.log(`File size: ${stats.size} bytes`);
  } else {
    console.log(`CSS file does not exist: ${cssFilePath}`);
  }

  console.log('\nChecking index.html references:');
  const indexHtmlPath = path.join(TEMP_DIR, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
    const cssMatches = indexContent.match(/\/effective-garbanzo\/_next\/static\/chunks\/[a-zA-Z0-9]+\.css/g);
    if (cssMatches) {
      console.log('CSS references in index.html:');
      cssMatches.slice(0, 5).forEach(match => {
        console.log(`  ${match}`);
      });
    }
  }

  // Don't commit, just leave the temp directory for inspection
  console.log('\n⚠️  Deployment paused for debugging. Temp directory preserved at:');
  console.log(TEMP_DIR);
  console.log('To continue deployment, run:');
  console.log('cd', TEMP_DIR, '&& git add . && git commit -m "Deploy chainBlogger build" && git push origin main');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}