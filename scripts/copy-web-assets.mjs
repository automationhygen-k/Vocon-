import fs from 'node:fs';
import path from 'node:path';

const sourceDir = path.resolve('frontend/dist');
const targetDir = path.resolve('android/app/src/main/assets/public');

if (!fs.existsSync(sourceDir)) {
  console.error('Missing frontend/dist. Run frontend build first.');
  process.exit(1);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });

console.log('Copied frontend/dist into android assets/public');
