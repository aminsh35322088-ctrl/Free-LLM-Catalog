import assert from 'node:assert/strict';
import test from 'node:test';
import { auditModelRows } from '../scripts/live-model-audit.mjs';

test('a removed model fails the live audit', () => {
  const issues = auditModelRows({id: 'ovh-anonymous', discovery: {kind: 'openai-models'}, models: [{id: 'removed'}]}, [{id: 'still-here'}]);
  assert.match(issues.join(' '), /removed/);
});

test('a Kilo model no longer marked free fails the live audit', () => {
  const issues = auditModelRows({id: 'kilo-anonymous', discovery: {kind: 'kilo-free'}, models: [{id: 'example:free'}]}, [{id: 'example:free', isFree: false}]);
  assert.match(issues.join(' '), /no longer free/);
});

test('a present free Kilo model passes', () => {
  assert.deepEqual(auditModelRows({id: 'kilo-anonymous', discovery: {kind: 'kilo-free'}, models: [{id: 'example:free'}]}, [{id: 'example:free', isFree: true}]), []);
});
