/**
 * SPORTMOMENTE — Core Module
 * Security · Storage · Collection Passwords · Utilities
 * © 2026 Sportmomente
 */
'use strict';

// ─── SECURITY ────────────────────────────────────────────────────────────────

async function hashPassword(password) {
  const salt = 'SM_SALT_2026_';
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + password));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}
async function verifyPassword(plain, hash) { return (await hashPassword(plain)) === hash; }

function sanitize(str, maxLen = 256) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>"'`]/g, c =>
    ({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;','`':'&#x60;'}[c])
  ).trim().substring(0, maxLen);
}

function escapeHtml(str) {
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
}

function checkRateLimit(key, maxAttempts = 5, windowMs = 300000) {
  const now = Date.now();
  let d;
  try { d = JSON.parse(sessionStorage.getItem('rl_'+key)||'{"c":0,"s":0}'); }
  catch { d = {c:0,s:0}; }
  if (now - d.s > windowMs) d = {c:1, s:now};
  else d.c++;
  sessionStorage.setItem('rl_'+key, JSON.stringify(d));
  return d.c <= maxAttempts;
}
function resetRateLimit(key) { sessionStorage.removeItem('rl_'+key); }

// ─── STORAGE ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'sm_data_v1';
const DATA_VERSION = 1;

function saveData(collections, settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: DATA_VERSION, ts: Date.now(), collections, settings
    }));
    return true;
  } catch(e) { console.warn('SM saveData failed:', e); return false; }
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    return d.version === DATA_VERSION ? d : null;
  } catch { return null; }
}

// ─── COLLECTION PASSWORDS ────────────────────────────────────────────────────

const COLL_PW_KEY = 'sm_cpw_v1';

async function setCollectionPassword(id, password) {
  if (!password) { removeCollectionPassword(id); return; }
  const hash = await hashPassword(password + '_' + id);
  const pws = getCollectionPasswords();
  pws[id] = hash;
  localStorage.setItem(COLL_PW_KEY, JSON.stringify(pws));
}
function removeCollectionPassword(id) {
  const pws = getCollectionPasswords();
  delete pws[id];
  localStorage.setItem(COLL_PW_KEY, JSON.stringify(pws));
}
function getCollectionPasswords() {
  try { return JSON.parse(localStorage.getItem(COLL_PW_KEY)||'{}'); } catch { return {}; }
}
function collectionIsLocked(id) { return !!getCollectionPasswords()[id]; }
async function verifyCollectionPassword(id, input) {
  const h = getCollectionPasswords()[id];
  if (!h) return true;
  return (await hashPassword(input + '_' + id)) === h;
}
const _unlocked = new Set();
function markCollectionUnlocked(id) { _unlocked.add(id); }
function isCollectionUnlocked(id) { return _unlocked.has(id) || !collectionIsLocked(id); }

// ─── UTILITIES ───────────────────────────────────────────────────────────────

function slugify(s) {
  return (s||'').toLowerCase()
    .replace(/[äöüß]/g, c=>({ä:'ae',ö:'oe',ü:'ue',ß:'ss'}[c]||c))
    .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}

function fmtDate(d) {
  if (!d) return '—';
  const [y,m,day] = d.split('-');
  return `${parseInt(day)}. ${['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'][parseInt(m)-1]} ${y}`;
}

// ─── DEFAULT DATA ────────────────────────────────────────────────────────────

const DEFAULT_COLLECTIONS = [
  {id:1,icon:'🤾',name:'Handball Turnier Stadtmeisterschaft',author:'Markus Bauer',date:'2025-03-15',loc:'Sporthalle West',cat:'Handball',desc:'Unglaubliche Atmosphäre beim diesjährigen Stadtturnier. Unsere Mannschaft kämpfte sich bis ins Finale vor.',count:47,badge:'Neu',hot:false},
  {id:2,icon:'⚽',name:'Spiel gegen SC Rot-Weiß',author:'Laura Schmidt',date:'2025-03-08',loc:'Hauptstadion',cat:'Fußball',desc:'Dramatisches Spiel mit drei Toren in der Nachspielzeit.',count:31,badge:'',hot:false},
  {id:3,icon:'🏆',name:'Pokalfinale 2025',author:'Markus Bauer',date:'2025-02-28',loc:'Stadtpark Arena',cat:'Turnier',desc:'Das Pokalfinale der Saison — Bilder die Geschichte schreiben.',count:63,badge:'Top',hot:true},
  {id:4,icon:'🎯',name:'Jugend Training Camp',author:'Anna Müller',date:'2025-02-20',loc:'Trainingsgelände Nord',cat:'Training',desc:'Zwei intensive Tage mit dem Nachwuchs. Talent, Schweiß und jede Menge Spaß.',count:28,badge:'',hot:false},
  {id:5,icon:'🥅',name:'Stadtderby Highlights',author:'Tom Richter',date:'2025-02-14',loc:'Stadtpark Arena',cat:'Fußball',desc:'Das Derby der Saison — Rivalität, Leidenschaft und Vollgas.',count:52,badge:'',hot:false},
];

const DEFAULT_SETTINGS = {
  siteName:'Sportmomente', tagline:'Handball · Fußball · Sport',
  heroDesc:'Atemberaubende Bilder eurer Spiele, Turniere und unvergesslichen Momente.',
  publicGalleries:true, allowDownload:false, watermark:true, shareLinks:true,
  adminPasswordHash:'',
};

// ─── EXPORT ──────────────────────────────────────────────────────────────────

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
