import './styles.css';

const templates = {
  'National ID': { type: 'National ID', name: 'Amal Hassan', number: 'NID-7849-2031-5528', dob: '14 Mar 1994', issue: '10 Feb 2024', expiration: '10 Feb 2034', gradient: 'linear-gradient(135deg, #13233e 0%, #1d5d78 52%, #64d9ff 130%)' },
  'Driver’s License': { type: 'Driver’s License', name: 'Amal Hassan', number: 'DL-4820-9917-CA', dob: '14 Mar 1994', issue: '22 Aug 2023', expiration: '22 Aug 2029', gradient: 'linear-gradient(135deg, #1b2516 0%, #567229 56%, #d4ff72 135%)' },
  Passport: { type: 'Passport', name: 'Amal Hassan', number: 'P-93840215', dob: '14 Mar 1994', issue: '03 Jan 2022', expiration: '03 Jan 2032', gradient: 'linear-gradient(135deg, #241638 0%, #4d2f78 52%, #c9a7ff 135%)' },
};

const screens = ['welcome', 'wallet', 'add', 'details', 'qr', 'profile'];
const storageKey = 'wathiqa-demo-documents-v02';
const settingsStorageKey = 'wathiqa-demo-settings-v02';
const defaultDocuments = Object.values(templates).map((document, index) => ({ ...document, id: `demo-${index}` }));
const root = document.querySelector('#root');
const maskNumber = (value) => `•••• •••• ${value.slice(-4)}`;
const icon = (name) => `<span class="icon" aria-hidden="true">${name}</span>`;

function restoreDocuments() {
  const savedDocuments = sessionStorage.getItem(storageKey);
  if (!savedDocuments) return defaultDocuments;

  try {
    const parsedDocuments = JSON.parse(savedDocuments);
    return Array.isArray(parsedDocuments) && parsedDocuments.length ? parsedDocuments : defaultDocuments;
  } catch {
    return defaultDocuments;
  }
}

function restoreSettings() {
  const savedSettings = sessionStorage.getItem(settingsStorageKey);
  if (!savedSettings) return { faceUnlock: false, passcode: false };

  try {
    return { faceUnlock: false, passcode: false, ...JSON.parse(savedSettings) };
  } catch {
    return { faceUnlock: false, passcode: false };
  }
}

let documents = restoreDocuments();
let selectedId = documents[0].id;
let screen = 'welcome';
let detailsExpanded = false;
let openSetting = '';
let settings = restoreSettings();

function persistDocuments() { sessionStorage.setItem(storageKey, JSON.stringify(documents)); }
function persistSettings() { sessionStorage.setItem(settingsStorageKey, JSON.stringify(settings)); }
function selectedDocument() { return documents.find((document) => document.id === selectedId) ?? documents[0]; }
function currentState() { return { wathiqa: true, screen, selectedId }; }

function render() {
  const views = { welcome, wallet, add, details, qr, profile };
  root.innerHTML = shell(views[screen]());
  root.querySelectorAll('[data-nav]').forEach((element) => element.addEventListener('click', () => navigate(element.dataset.nav)));
  root.querySelectorAll('[data-back]').forEach((element) => element.addEventListener('click', goBack));
  root.querySelectorAll('[data-open]').forEach((element) => element.addEventListener('click', () => openDocument(element.dataset.open)));
  root.querySelectorAll('[data-add]').forEach((element) => element.addEventListener('click', () => addDocument(element.dataset.add)));
  root.querySelectorAll('[data-action="details"]').forEach((element) => element.addEventListener('click', toggleDetails));
  root.querySelectorAll('[data-setting]').forEach((element) => element.addEventListener('click', () => toggleSettingPanel(element.dataset.setting)));
  root.querySelectorAll('[data-security]').forEach((element) => element.addEventListener('change', () => toggleSecurity(element.dataset.security, element.checked)));
}

function navigate(next, { replace = false } = {}) {
  screen = screens.includes(next) ? next : 'wallet';
  detailsExpanded = false;
  openSetting = '';
  window.history[replace ? 'replaceState' : 'pushState'](currentState(), '', window.location.href);
  render();
}

function goBack() {
  if (window.history.state?.wathiqa && screen !== 'welcome') {
    window.history.back();
    return;
  }

  navigate('wallet', { replace: true });
}

function openDocument(id) {
  selectedId = id;
  navigate('details');
}

function addDocument(type) {
  const newDocument = { ...templates[type], id: `${type}-${Date.now()}` };
  documents = [newDocument, ...documents];
  selectedId = newDocument.id;
  persistDocuments();
  navigate('details');
}

function toggleDetails() {
  detailsExpanded = !detailsExpanded;
  render();
}

function toggleSettingPanel(setting) {
  openSetting = openSetting === setting ? '' : setting;
  render();
}

function toggleSecurity(setting, enabled) {
  settings = { ...settings, [setting]: enabled };
  persistSettings();
  render();
}

window.addEventListener('popstate', (event) => {
  const state = event.state;
  if (!state?.wathiqa) {
    screen = 'welcome';
    selectedId = documents[0].id;
  } else {
    screen = screens.includes(state.screen) ? state.screen : 'wallet';
    selectedId = documents.some((document) => document.id === state.selectedId) ? state.selectedId : documents[0].id;
  }
  detailsExpanded = false;
  openSetting = '';
  render();
});

function shell(content) {
  const header = screen === 'welcome' ? '' : `<header class="top-bar"><button class="icon-button" data-back aria-label="Go back">‹</button><span class="brand-mark">وثيقة</span><button class="icon-button" data-nav="profile" aria-label="Open profile">◉</button></header>`;
  return `<main class="app-shell"><div class="phone-frame">${header}${content}</div></main>`;
}

function welcome() { return `<section class="welcome screen-enter"><div class="logo-orb">${icon('▣')}</div><p class="eyebrow">Digital document wallet</p><h1>Wathiqa <span>وثيقة</span></h1><p class="tagline">Your documents, always with you.</p><div class="trust-card">${icon('✓')} Prototype uses fake demo data only — no government database connections.</div><button class="primary-button" data-nav="wallet">Continue</button></section>`; }
function wallet() { return `<section class="content screen-enter"><p class="eyebrow">Wallet</p><h2>Your documents</h2><div class="stack" aria-label="Document wallet cards">${documents.map((document, index) => `<button class="wallet-card" data-open="${document.id}" style="background:${document.gradient};transform:translateY(${-index * 58}px) scale(${1 - index * 0.025});z-index:${20 - index};margin-bottom:${index === 0 ? 0 : -132}px"><div><p>${document.type}</p><h3>${document.name}</h3></div><div class="chip"></div><span>${maskNumber(document.number)}</span></button>`).join('')}</div><button class="add-button" data-nav="add">+ Add Document</button></section>`; }
function add() { return `<section class="content screen-enter"><p class="eyebrow">Add Document</p><h2>Choose a demo document</h2><p class="muted">This prototype creates fake wallet cards for interaction testing.</p>${Object.keys(templates).map((type) => `<button class="choice" data-add="${type}">${icon('✦')}${type}<span>Demo</span></button>`).join('')}</section>`; }
function details() {
  const document = selectedDocument();
  const extraDetails = detailsExpanded ? `<section class="detail-panel" aria-label="Document information"><p class="eyebrow">Prototype details</p><p>This locally created demo document is available only in this browser session. Its QR view is for interface testing and does not transmit or verify any real information.</p><p class="muted">Wallet record: ${document.id}</p></section>` : '';
  return `<section class="content screen-enter"><div class="large-card" style="background:${document.gradient}"><p>${document.type}</p><h2>${document.name}</h2><span>${maskNumber(document.number)}</span><b class="badge">✓</b></div><dl class="details-grid">${[['Name', document.name], ['Document type', document.type], ['Masked number', maskNumber(document.number)], ['Date of birth', document.dob], ['Issue date', document.issue], ['Expiration date', document.expiration], ['Status', 'Valid']].map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl>${extraDetails}<div class="button-row"><button class="primary-button" data-nav="qr">▦ Show QR</button><button class="secondary-button" data-action="details" aria-expanded="${detailsExpanded}">ⓘ ${detailsExpanded ? 'Hide Details' : 'Details'}</button></div></section>`;
}
function qr() { const document = selectedDocument(); return `<section class="content center screen-enter"><p class="eyebrow">QR Verification</p><div class="qr-box" aria-label="Demo QR code"><div class="qr-grid">${Array.from({ length: 81 }).map((_, i) => `<span class="${(i * 7 + 3) % 5 === 0 || i % 10 === 0 ? 'dark' : ''}"></span>`).join('')}</div></div><h2>Document verified</h2><p class="muted">${document.type} for ${document.name} passed this prototype/demo verification flow.</p><div class="verified-pill">✓ Demo verification system — not official verification.</div></section>`; }
function settingButton(setting, symbol, title, description) {
  const isOpen = openSetting === setting;
  return `<button class="settings-card settings-button" data-setting="${setting}" aria-expanded="${isOpen}">${icon(symbol)}<span><strong>${title}</strong><small>${description}</small></span><b aria-hidden="true">${isOpen ? '−' : '+'}</b></button>`;
}
function profile() {
  const panel = openSetting === 'profile' ? `<section class="setting-panel"><strong>Demo profile</strong><p>Amal Hassan is a fixed demonstration identity. Profile editing is intentionally unavailable in this prototype.</p></section>` : openSetting === 'security' ? `<section class="setting-panel"><strong>Local security preferences</strong><label class="toggle-row"><span>Face unlock mock<small>Visual preference only; no biometric data is requested.</small></span><input type="checkbox" data-security="faceUnlock" ${settings.faceUnlock ? 'checked' : ''}><i></i></label><label class="toggle-row"><span>Passcode mock<small>Visual preference only; no passcode is collected or stored.</small></span><input type="checkbox" data-security="passcode" ${settings.passcode ? 'checked' : ''}><i></i></label></section>` : openSetting === 'information' ? `<section class="setting-panel"><strong>Wathiqa v0.2 MVP</strong><p>All documents, QR verification, and settings are demo-only. No account, backend, or official verification service is connected.</p></section>` : '';
  return `<section class="content screen-enter"><p class="eyebrow">Profile / Settings</p><h2>Amal Hassan</h2>${settingButton('profile', '◉', 'Demo user profile', 'View prototype profile information.')}${settingButton('security', '◇', 'Security settings', 'Manage local security mock preferences.')}${settingButton('information', 'ⓘ', 'App information', 'View prototype and safety details.')}${panel}</section>`;
}

window.history.replaceState(currentState(), '', window.location.href);
render();
