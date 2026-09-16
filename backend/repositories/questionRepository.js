/**
 * repositories/questionRepository.js
 * Data access layer for all question-related files.
 * No business logic here — only file I/O with a simple in-memory cache.
 */

const fs   = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'data');

// Simple in-memory LRU-style cache (max 200 entries per type)
const CACHE = {};
function fromCache(key)      { return CACHE[key]; }
function toCache(key, val)   { CACHE[key] = val; return val; }

/** Load JSON file synchronously (cached). */
function loadJson(filePath) {
  const cached = fromCache(filePath);
  if (cached) return cached;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return toCache(filePath, JSON.parse(raw));
  } catch (e) {
    throw new Error(`Failed to load ${path.relative(process.cwd(), filePath)}: ${e.message}`);
  }
}

/** Load all 100 mission metadata from heymine_100_questions_mvp.json */
let _allMissions = null;
function getAllMissions() {
  if (_allMissions) return _allMissions;
  const raw = loadJson(path.join(__dirname, '..', 'heymine_100_questions_mvp.json'));
  _allMissions = raw.questions;
  return _allMissions;
}

/** Load single mission metadata from data/questions/HMXXX.json */
function getQuestionMeta(id) {
  return loadJson(path.join(DATA, 'questions', `${id}.json`));
}

/** Load 5 visible test cases (sent to frontend). */
function getVisibleTests(id) {
  return loadJson(path.join(DATA, 'visible-tests', `${id}.json`));
}

/**
 * Load 5 hidden test cases.
 * ⚠️  NEVER send this to the frontend — only used inside judgeService.
 */
function getHiddenTests(id) {
  return loadJson(path.join(DATA, 'hidden-tests', `${id}.json`));
}

/** Load progressive hints array. */
function getHints(id) {
  const data = loadJson(path.join(DATA, 'hints', `${id}.json`));
  return data.hints || [];
}

/** Load all stage metadata from the main JSON. */
function getStages() {
  const raw = loadJson(path.join(__dirname, '..', 'heymine_100_questions_mvp.json'));
  return raw.theme.stages;
}

/** Get missions grouped by stage. */
function getMissionsByStage() {
  const missions  = getAllMissions();
  const stages    = getStages();
  const grouped   = {};
  for (const s of stages) grouped[s.id] = { ...s, missions: [] };
  for (const m of missions) {
    if (grouped[m.stage]) grouped[m.stage].missions.push(m);
  }
  return Object.values(grouped);
}

/** Clear the in-memory cache (useful for hot-reload in dev). */
function clearCache() {
  Object.keys(CACHE).forEach(k => delete CACHE[k]);
  _allMissions = null;
}

module.exports = {
  getAllMissions,
  getQuestionMeta,
  getVisibleTests,
  getHiddenTests,
  getHints,
  getStages,
  getMissionsByStage,
  clearCache,
};
