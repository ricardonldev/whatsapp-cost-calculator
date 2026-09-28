// node --test tests/calc.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monthlyCost, compare } from '../calc.js';
import { RATE_CARD } from '../rates.js';

const ES = RATE_CARD.markets.Spain;
const base = {
  marketing: 0, utilityOutside: 0, utilityInside: 0, authentication: 0,
  conversations: 0, repliesPerConversation: 0, freeEntryShare: 0,
};

test('Spain rates match the official EUR card of 1 July 2026', () => {
  assert.deepEqual(ES, [0.0585, 0.0166, 0.0166]);
});

test('service replies are free before 1 Oct 2026 and charged at the utility rate after', () => {
  const v = { ...base, conversations: 1000, repliesPerConversation: 4 };
  assert.equal(monthlyCost(ES, v, false).total, 0);
  const after = monthlyCost(ES, v, true);
  assert.equal(after.serviceMessages, 4000);
  assert.equal(after.service, 66.4); // 4000 × 0.0166
});

test('utility templates inside an open window become billable after the change', () => {
  const v = { ...base, utilityOutside: 100, utilityInside: 200 };
  assert.equal(monthlyCost(ES, v, false).utility, 1.66);
  assert.equal(monthlyCost(ES, v, true).utility, 4.98);
});

test('conversations from Click-to-WhatsApp ads stay free', () => {
  const v = { ...base, conversations: 1000, repliesPerConversation: 4, freeEntryShare: 0.25 };
  assert.equal(monthlyCost(ES, v, true).serviceMessages, 3000);
});

test('marketing and authentication are charged in both periods', () => {
  const v = { ...base, marketing: 1000, authentication: 500 };
  const b = monthlyCost(ES, v, false);
  assert.equal(b.marketing, 58.5);
  assert.equal(b.authentication, 8.3);
  assert.deepEqual(b, { ...monthlyCost(ES, v, true), serviceMessages: 0 });
});

test('compare: increase and saving from fewer replies per conversation', () => {
  const v = { ...base, conversations: 2000, repliesPerConversation: 6 };
  const r = compare(ES, v, 3);
  assert.equal(r.increase, 199.2);      // 12000 × 0.0166
  assert.equal(r.monthlySaving, 99.6);  // 6000 fewer messages
  assert.equal(r.yearlySaving, 1195.2);
});

test('bad input never produces negative or NaN costs', () => {
  const v = { ...base, conversations: -5, repliesPerConversation: 'abc', freeEntryShare: 3, marketing: null };
  const r = monthlyCost(ES, v, true);
  for (const k of ['marketing', 'utility', 'authentication', 'service', 'total']) {
    assert.ok(Number.isFinite(r[k]) && r[k] >= 0, k);
  }
});
