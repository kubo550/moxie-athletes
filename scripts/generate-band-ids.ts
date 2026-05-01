/**
 * Generates unique band IDs for NFC bracelet manufacturing.
 *
 * Usage:
 *   npm run generate:bands -- --count 1000
 *   npm run generate:bands -- --count 500 --domain https://moxieathletes.com
 *   npm run generate:bands -- --out custom/path.csv
 */
import { customAlphabet } from 'nanoid';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lowercase alphanumerics, no ambiguous chars (no 0/o/1/l/i)
const ALPHABET = '23456789abcdefghjkmnpqrstuvwxyz';
const ID_LENGTH = 8;
const generateId = customAlphabet(ALPHABET, ID_LENGTH);

type Args = {
  count: number;
  domain: string;
  outPath: string;
};

const parseArgs = (): Args => {
  const args = process.argv.slice(2);
  let count = 1000;
  let domain =
    process.env.VITE_APP_PUBLIC_DOMAIN || 'https://moxieathletes.com';
  let outPath = resolve(__dirname, '..', 'band-ids.csv');

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--count' || arg === '-c') {
      count = parseInt(args[++i] ?? '0', 10);
    } else if (arg === '--domain' || arg === '-d') {
      domain = args[++i] ?? domain;
    } else if (arg === '--out' || arg === '-o') {
      outPath = resolve(args[++i] ?? outPath);
    }
  }

  if (!Number.isInteger(count) || count <= 0) {
    throw new Error('--count must be a positive integer');
  }
  if (!/^https?:\/\//.test(domain)) {
    throw new Error(`--domain must start with http:// or https:// (got: ${domain})`);
  }

  return { count, domain: domain.replace(/\/$/, ''), outPath };
};

const main = () => {
  const { count, domain, outPath } = parseArgs();
  const ids = new Set<string>();
  while (ids.size < count) {
    ids.add(generateId());
  }

  const rows = ['id,url'];
  for (const id of ids) {
    rows.push(`${id},${domain}/g/${id}`);
  }

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, rows.join('\n') + '\n', 'utf8');

  console.log(`Generated ${count} band IDs.`);
  console.log(`Domain: ${domain}`);
  console.log(`Output: ${outPath}`);
};

main();
