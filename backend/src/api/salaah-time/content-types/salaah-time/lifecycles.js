'use strict';

const TIME_FIELDS = [
  'sehri_end',
  'fajr_start',
  'fajr_jamat',
  'sunrise',
  'zohar_start',
  'zohar_jamat',
  'asr_start',
  'asr_jamat',
  'maghrib_start',
  'maghrib_jamat',
  'isha_start',
  'isha_jamat',
  'jummah_1',
  'jummah_2',
];

function normalizeTimeValue(value) {
  if (value == null) return null;
  if (typeof value !== 'string') return value;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  if (lower === 'null' || lower === 'n/a') return null;

  // Accept HH:mm, HH:mm:ss, or HH:mm:ss.SSS and normalize to HH:mm:ss.SSS
  const match = trimmed.match(
    /^(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?$/,
  );
  if (!match) {
    // Leave as-is and let Strapi validation surface an error if truly invalid
    return value;
  }

  let [, hh, mm, ss, ms] = match;
  if (!ss) ss = '00';
  if (!ms) ms = '000';
  return `${hh}:${mm}:${ss}.${ms}`;
}

/** Fix CRLF-corrupted CSV keys (e.g. "isha_jamat\r" -> "isha_jamat") before processing */
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

module.exports = {
  beforeCreate(event) {
    normalizeTimes(event.params.data);
  },

  beforeCreateMany(event) {
    const { data } = event.params;
    if (Array.isArray(data)) {
      data.forEach(normalizeTimes);
    } else if (data && typeof data === 'object') {
      normalizeTimes(data);
    }
  },
};

