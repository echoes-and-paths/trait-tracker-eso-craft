import { writeFileSync } from 'fs';

const commit = process.env.APP_COMMIT || process.env.CF_PAGES_COMMIT_SHA || 'unknown';
const buildTime = new Date().toISOString();

const content = `// Auto‑generated at build
export const APP_COMMIT = '${commit}';
export const APP_BUILD_TIME = '${buildTime}';
`;
writeFileSync('src/version.ts', content);
console.log('[version] Generated src/version.ts →', commit);
