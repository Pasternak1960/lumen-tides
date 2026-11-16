import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const root = fileURLToPath(new URL('.', import.meta.url));
const target = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(target,{recursive:true});
for (const folder of ['game','screenshots']) {
  cpSync(join(root,folder),join(target,folder),{recursive:true});
}

const dossier = buildDossier(target,{
  text_max_bytes:163840,
  screenshots:{max:4,max_bytes:262144},
  game_max_files:993,
  game_max_bytes:50331648,
  game_path_max_bytes:1000,
});
writeFileSync(join(target,'dossier.json'),dossier);
