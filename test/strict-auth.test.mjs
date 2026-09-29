import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';

const catalog = JSON.parse(await fs.readFile(new URL('../catalog.json', import.meta.url), 'utf8'));

test('every catalog provider is usable without sending credentials', () => {
  for (const provider of catalog.providers) {
    assert.equal(provider.auth.mode, 'none', `${provider.id} needs a token or placeholder`);
    assert.equal(provider.auth.userCredentialRequired, false, provider.id);
    assert.equal(provider.auth.value, undefined, `${provider.id} contains a credential value`);
  }
});
