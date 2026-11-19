// Leonida Trophy Guide — the program that hands the guide in (Node 22, stdlib only).
// The guide itself is app/: plain static files, opened at app/index.html, offline.
// Its data is app/data/trophies.json; its screenshots are screenshots/ (3 or 4).
// This program copies both folders to /output and writes /output/dossier.json
// with the kit's vendored library — the dossier the judge reads. Do not edit
// vendor/makefun-frontend.ts: the scorer rebuilds the dossier with its own copy
// and requires the two to be byte for byte identical.
//
// Run it locally the same way the grader runs it:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// and serve the result with `node serve.ts` (http://localhost:8080).

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The repository root is the folder this file sits in.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The grader caps /output at 1000 entries and 64 MiB; app/ may hold at most
// 993 entries and 48 MiB, screenshots/ at most 4 files of 256 KiB each, and
// the dossier at most 1.5 MiB. Refuse early if our own tree is already past
// those caps, so a bad entry fails loudly here instead of at the gate.
function countEntries(dir) {
  let total = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    total += 1;
    if (entry.isDirectory()) total += countEntries(join(dir, entry.name));
  }
  return total;
}

const appDir = join(repoRoot, 'app');
const shotsDir = join(repoRoot, 'screenshots');

if (countEntries(appDir) > 993) throw new Error('app/ holds more than 993 entries');
if (existsSync(shotsDir) && countEntries(shotsDir) > 4) throw new Error('screenshots/ holds more than 4 files');

mkdirSync(outputDir, { recursive: true });
cpSync(appDir, join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(shotsDir)) cpSync(shotsDir, join(outputDir, 'screenshots'), { recursive: true });

writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
