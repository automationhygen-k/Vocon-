import { spawnSync } from 'node:child_process';

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    ...options
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

run('npm', ['run', 'build'], { cwd: 'frontend' });
run('node', ['scripts/copy-web-assets.mjs']);
run('gradle', ['assembleDebug'], { cwd: 'android' });

console.log('APK build complete: android/app/build/outputs/apk/debug/app-debug.apk');
