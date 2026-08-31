import { cp, mkdir, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const outputDirectory = 'dist';

execFileSync(process.execPath, ['--check', 'src/main.js'], { stdio: 'inherit' });

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp('index.html', `${outputDirectory}/index.html`);
await cp('src', `${outputDirectory}/src`, { recursive: true });

console.log(`Wathiqa production build created in ${outputDirectory}/`);
