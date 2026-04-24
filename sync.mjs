import { copyFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src  = resolve(__dirname, 'build/DistopiaTokens.kt');
const dest = resolve(__dirname, '../Writeopia/application/core/theme/src/commonMain/kotlin/io/writeopia/theme/DistopiaTokens.kt');

if (!existsSync(src)) {
  console.error('❌  build/DistopiaTokens.kt not found. Run `npm run build` first.');
  process.exit(1);
}

copyFileSync(src, dest);
console.log(`✅  Synced DistopiaTokens.kt → ${dest}`);
