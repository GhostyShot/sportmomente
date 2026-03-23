/**
 * SPORTMOMENTE — Core Module
 * Security, Storage, Collection Passwords, Utilities
 * © 2026 Sportmomente
 */

'use strict';

// ─────────────────────────────────────────────
//  SECURITY UTILITIES
// ─────────────────────────────────────────────

/**
 * Hash a string with SHA-256 using WebCrypto API.
 */
async function hashPassword(password) {
  const salt = 'SM_SALT_2026_';
  const msgBuffer = new TextEncoder().encode(salt + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(plain, storedHash) {
  const hash = await hashPassword(plain);
  return hash === storedHash;
}

/**
 * Sanitize user input — strip HTML tags, limit length
 */
function sanitize(str, maxLen = 256) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>"'`]/g, c => ({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;','`':'&#x60;'}[c]))
    .trim()
    .substring(0, maxLen);
}

/**
 * Escape HTML for safe DOM insertion
 */
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#x27;');
}

/**
 * Rate limit helper — tracks attempts in sessionStorage
 */
function checkRateLimit(key, maxAttempts = 5, windowMs = 300000) {
  const now = Date.now();
  let data;
  try {
    data = JSON.parse(sessionStorage.getItem('rl_' + key) || '{"count":0,"start":0}');
  } catch { data = { count: 0, start: 0 }; }
  if (now - data.start > windowMs) {
    data = { count: 1, start: now };
  } else {
    data.count++;
  }
  sessionStorage.setItem('rl_' + key, JSON.stringify(data));
  return data.count <= maxAttempts;
}

function resetRateLimit(key) {
  sessionStorage.removeItem('rl_' + key);
}

// ─────────────────────────────────────────────
//  STORAGE (localStorage with versioning)
// ─────────────────────────────────────────────

const STORAGE_KEY = 'sm_data_v1';
const DATA_VERSION = 1;

function saveData(collections, settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: DATA_VERSION,
      ts: Date.now(),
      collections,
      settings
    }));
    return true;
  } catch (e) {
    console.warn('Storage save failed:', e);
    return false;
  }
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.version !== DATA_VERSION) return null;
    return data;
  } catch { return null; }
}

// ─────────────────────────────────────────────
//  COLLECTION PASSWORD SYSTEM
// ─────────────────────────────────────────────

const COLL_PW_KEY = 'sm_cpw_v1';

async function setCollectionPassword(collectionId, password) {
  if (!password) { removeCollectionPassword(collectionId); return; }
  const hash = await hashPassword(password + '_' + collectionId);
  const existing = getCollectionPasswords();
  existing[collectionId] = hash;
  localStorage.setItem(COLL_PW_KEY, JSON.stringify(existing));
}

function removeCollectionPassword(collectionId) {
  const existing = getCollectionPasswords();
  delete existing[collectionId];
  localStorage.setItem(COLL_PW_KEY, JSON.stringify(existing));
}

function getCollectionPasswords() {
  try { return JSON.parse(localStorage.getItem(COLL_PW_KEY) || '{}'); }
  catch { return {}; }
}

function collectionIsLocked(collectionId) {
  return !!getCollectionPasswords()[collectionId];
}

async function verifyCollectionPassword(collectionId, input) {
  const pws = getCollectionPasswords();
  const storedHash = pws[collectionId];
  if (!storedHash) return true;
  const inputHash = await hashPassword(input + '_' + collectionId);
  return inputHash === storedHash;
}

const unlockedCollections = new Set();
function markCollectionUnlocked(id) { unlockedCollections.add(id); }
function isCollectionUnlocked(id) { return unlockedCollections.has(id) || !collectionIsLocked(id); }

// ─────────────────────────────────────────────
//  UTILITIES
// ─────────────────────────────────────────────

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[äöüß]/g, c => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[c] || c))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function fmtDate(d) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  const months = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
  return `${parseInt(day)}. ${months[parseInt(m) - 1]} ${y}`;
}

// ─────────────────────────────────────────────
//  DEFAULT DATA
// ─────────────────────────────────────────────

const DEFAULT_COLLECTIONS = [
  { id: 1, icon: '🤾', name: 'Handball Turnier Stadtmeisterschaft', author: 'Markus Bauer', date: '2025-03-15', loc: 'Sporthalle West', cat: 'Handball', desc: 'Unglaubliche Atmosphäre beim diesjährigen Stadtturnier.', count: 47, badge: 'Neu', hot: false },
  { id: 2, icon: '⚽', name: 'Spiel gegen SC Rot-Weiß', author: 'Laura Schmidt', date: '2025-03-08', loc: 'Hauptstadion', cat: 'Fußball', desc: 'Dramatisches Spiel mit drei Toren in der Nachspielzeit.', count: 31, badge: '', hot: false },
  { id: 3, icon: '🏆', name: 'Pokalfinale 2025', author: 'Markus Bauer', date: '2025-02-28', loc: 'Stadtpark Arena', cat: 'Turnier', desc: 'Das Pokalfinale der Saison — Bilder die Geschichte schreiben.', count: 63, badge: 'Top', hot: true },
  { id: 4, icon: '🎯', name: 'Jugend Training Camp', author: 'Anna Müller', date: '2025-02-20', loc: 'Trainingsgelände Nord', cat: 'Training', desc: 'Zwei intensive Tage mit dem Nachwuchs.', count: 28, badge: '', hot: false },
  { id: 5, icon: '🥅', name: 'Stadtderby Highlights', author: 'Tom Richter', date: '2025-02-14', loc: 'Stadtpark Arena', cat: 'Fußball', desc: 'Das Derby der Saison — Rivalität, Leidenschaft und Vollgas.', count: 52, badge: '', hot: false },
];

const DEFAULT_SETTINGS = {
  siteName: 'Sportmomente',
  tagline: 'Handball · Fußball · Sport',
  heroDesc: 'Atemberaubende Bilder eurer Spiele, Turniere und unvergesslichen Momente.',
  publicGalleries: true,
  allowDownload: false,
  watermark: true,
  shareLinks: true,
  adminPasswordHash: '',
};

// Export
if (typeof window !== 'undefined') {
  window.SM = {
    hashPassword, verifyPassword, sanitize, escapeHtml,
    checkRateLimit, resetRateLimit,
    saveData, loadData,
    setCollectionPassword, removeCollectionPassword,
    collectionIsLocked, verifyCollectionPassword,
    markCollectionUnlocked, isCollectionUnlocked,
    slugify, fmtDate,
    DEFAULT_COLLECTIONS, DEFAULT_SETTINGS,
  };
}
