// Encrypts private/source.json into private.enc.json using the passphrase in private/.passphrase.
// Run: node private/encrypt.mjs   (no dependencies). source.json and .passphrase are gitignored.
import { readFileSync, writeFileSync } from 'node:fs';
import { pbkdf2Sync, randomBytes, createCipheriv } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pass = readFileSync(join(here, '.passphrase'), 'utf8').trim();
const plain = readFileSync(join(here, 'source.json'), 'utf8');
JSON.parse(plain); // fail early on bad JSON

const iter = 600000;
const salt = randomBytes(16);
const iv = randomBytes(12);
const key = pbkdf2Sync(pass, salt, iter, 32, 'sha256');
const c = createCipheriv('aes-256-gcm', key, iv);
const ct = Buffer.concat([c.update(plain, 'utf8'), c.final()]);
const data = Buffer.concat([ct, c.getAuthTag()]); // WebCrypto expects ciphertext + tag
writeFileSync(join(here, '..', 'private.enc.json'), JSON.stringify({
  v: 1, iter, salt: salt.toString('base64'), iv: iv.toString('base64'), data: data.toString('base64')
}) + '\n');
console.log('wrote private.enc.json');
