import { existsSync, readdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import process from 'node:process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mobile = resolve(root, 'apps/mobile');
const android = resolve(mobile, 'android');
const gradleProject = [resolve(android, 'app/build.gradle'), resolve(android, 'app/build.gradle.kts')].some(existsSync);

if (!gradleProject) {
  if (existsSync(android)) {
    const entries = readdirSync(android);
    if (entries.every((entry) => entry === '.gitkeep')) rmSync(android, { recursive: true, force: true });
    else {
      process.stderr.write('La carpeta android existe, pero no parece un proyecto Capacitor válido. Revísala antes de regenerarla.\n');
      process.exit(1);
    }
  }
  const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const result = spawnSync(command, ['cap', 'add', 'android'], { cwd: mobile, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
