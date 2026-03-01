#!/usr/bin/env node
/**
 * Test: lifecycle normalizeKeys + normalizeTimes with CRLF CSV
 * Simulates what the strapi-csv-import-export plugin produces and what our lifecycle does
 */
const fs = require('fs');
const path = require('path');
const { csv2json } = require('json-2-csv');

const TIME_FIELDS = [
  'sehri_end', 'fajr_start', 'fajr_jamat', 'sunrise', 'zohar_start', 'zohar_jamat',
  'asr_start', 'asr_jamat', 'maghrib_start', 'maghrib_jamat', 'isha_start', 'isha_jamat',
  'jummah_1', 'jummah_2',
];

function normalizeTimeValue(value) {
  if (value == null) return null;
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  if (lower === 'null' || lower === 'n/a') return null;
  const match = trimmed.match(/^(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?$/);
  if (!match) return value;
  let [, hh, mm, ss, ms] = match;
  if (!ss) ss = '00';
  if (!ms) ms = '000';
  return `${hh}:${mm}:${ss}.${ms}`;
}

function normalizeKeys(data = {}) {
  for (const key of Object.keys(data)) {
    const cleanKey = key.replace(/\r+$/, '').trim();
    if (cleanKey !== key) {
      data[cleanKey] = data[key];
      delete data[key];
    }
  }
}

function normalizeTimes(data = {}) {
  normalizeKeys(data);
  for (const field of TIME_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      data[field] = normalizeTimeValue(data[field]);
    }
  }
}

const csvPath = process.argv[2] || '/Users/imad/Downloads/Madni 2026 - Madni Timetable RAW CSV.csv';
const csv = fs.readFileSync(csvPath, 'utf8');

console.log('Parsing CSV with json-2-csv (simulates plugin)...');
const parsed = csv2json(csv);

console.log('\n--- BEFORE lifecycle (first row) ---');
const first = parsed[0];
console.log('Keys with isha:', Object.keys(first).filter((k) => k.includes('isha')));
console.log('isha_jamat:', first.isha_jamat);
console.log("isha_jamat\\r key exists:", 'isha_jamat\r' in first);
console.log("Value at isha_jamat\\r:", first['isha_jamat\r']);

// Save expected values before mutation (from corrupted key)
const expectedByIndex = parsed.map((r) => r['isha_jamat\r']);

console.log('\n--- Running normalizeTimes (lifecycle logic) ---');
parsed.forEach(normalizeTimes);

console.log('\n--- AFTER lifecycle (first 3 rows) ---');
for (let i = 0; i < Math.min(3, parsed.length); i++) {
  const row = parsed[i];
  console.log(`Row ${i + 1} date=${row.date} isha_jamat=${row.isha_jamat}`);
}

// Rows that had a value in the corrupted key should have it in isha_jamat after lifecycle
const failed = parsed.filter((r, i) => {
  const hadValue = expectedByIndex[i];
  return hadValue && hadValue.trim() && hadValue.toLowerCase() !== 'null' && !r.isha_jamat;
});

console.log('\n--- Result ---');
if (failed.length === 0) {
  console.log('PASS: All rows have isha_jamat correctly set after lifecycle.');
  const sample = parsed.find((r) => r.isha_jamat);
  if (sample) console.log('Sample:', sample.date, '-> isha_jamat:', sample.isha_jamat);
} else {
  console.log('FAIL:', failed.length, 'rows have missing isha_jamat');
  console.log('First failure:', failed[0]);
}
