const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const deployDir = path.join(__dirname, 'deploy');

// Clean and create deploy directory
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true, force: true });
}
fs.mkdirSync(deployDir);

console.log('Building minified CSS for production...');
try {
  execSync('npx tailwindcss -i ./src/style.css -o ./dist/output.css --minify', { stdio: 'inherit' });
} catch (e) {
  console.error('Failed to build CSS', e);
  process.exit(1);
}

// Helper to copy directories recursively
function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Copying files to deploy folder...');

// Copy HTML files
const files = fs.readdirSync(__dirname);
files.forEach(file => {
  if (file.endsWith('.html')) {
    fs.copyFileSync(path.join(__dirname, file), path.join(deployDir, file));
  }
});

// Copy required directories
const dirsToCopy = ['assets', 'dist'];
dirsToCopy.forEach(dir => {
  if (fs.existsSync(path.join(__dirname, dir))) {
    copyDirSync(path.join(__dirname, dir), path.join(deployDir, dir));
  }
});

// Copy specific src files (just script.js)
fs.mkdirSync(path.join(deployDir, 'src'));
if (fs.existsSync(path.join(__dirname, 'src', 'script.js'))) {
  fs.copyFileSync(path.join(__dirname, 'src', 'script.js'), path.join(deployDir, 'src', 'script.js'));
}

console.log('✅ Deployment folder prepared successfully at /deploy!');
