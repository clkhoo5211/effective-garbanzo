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

  // Commit and push changes
  console.log('Committing changes...');
  process.chdir(TEMP_DIR);
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Deploy chainBlogger build"', { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });

  console.log('✅ Deployment completed successfully!');
  console.log('Your site should be available at: https://clkhoo5211.github.io/effective-garbanzo/');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
} finally {
  // Clean up temp directory
  if (fs.existsSync(TEMP_DIR)) {
    console.log('Cleaning up temp directory...');
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }
}